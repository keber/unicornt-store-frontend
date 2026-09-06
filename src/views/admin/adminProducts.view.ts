import { ApiError } from "@/api/errors";
import type { ProductWritePayload } from "@/api/product.api";
import { requireElement, requireElementOfType } from "@/lib/dom";
import { isAdmin } from "@/models/auth.model";
import type { ProductModel } from "@/models/product.model";
import { fetchCurrentUser, isAuthenticated } from "@/services/auth.service";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/services/product.service";

/**
 * Minimal admin product module: list, create/edit form, delete. Expected markup
 * inside `root` (see admin.html):
 *
 * ```html
 * <p id="admin-gate" hidden></p>
 * <form id="admin-product-form">
 *   <input type="hidden" id="admin-product-id" />
 *   <input id="admin-name" name="name" />
 *   <input id="admin-description" name="description" />
 *   <input id="admin-imageBase" name="imageBase" />
 *   <input id="admin-price" name="price" type="number" />
 *   <input id="admin-categoryId" name="categoryId" type="number" />
 *   <input id="admin-productTypeId" name="productTypeId" type="number" />
 *   <input id="admin-stock" name="stock" type="number" />
 *   <input id="admin-active" name="active" type="checkbox" checked />
 *   <p id="admin-form-error" hidden></p>
 *   <button id="admin-submit" type="submit">Guardar</button>
 *   <button id="admin-reset" type="button">Nuevo</button>
 * </form>
 * <ul id="admin-product-list"></ul>
 * ```
 *
 * A non-admin session (or any 403 from a write) shows an actionable message in
 * `#admin-gate` and never a broken screen.
 */
type SubmitState = "idle" | "submitting" | "success" | "error";

const FORBIDDEN =
  "Necesitas una sesión de administrador para gestionar el catálogo. Inicia sesión con una cuenta ROLE_ADMIN.";

export async function initAdminProductsView(root: ParentNode = document): Promise<void> {
  const gate = requireElement("#admin-gate", root);
  const form = requireElementOfType("#admin-product-form", HTMLFormElement, root);
  const list = requireElementOfType("#admin-product-list", HTMLUListElement, root);
  const idField = requireElementOfType("#admin-product-id", HTMLInputElement, form);
  const formError = requireElement("#admin-form-error", form);
  const submit = requireElementOfType("#admin-submit", HTMLButtonElement, form);

  const showGate = (message: string): void => {
    gate.textContent = message;
    gate.removeAttribute("hidden");
    form.setAttribute("hidden", "");
    list.setAttribute("hidden", "");
  };

  if (!isAuthenticated()) {
    showGate("Inicia sesión como administrador para gestionar el catálogo.");
    return;
  }
  try {
    const user = await fetchCurrentUser();
    if (!isAdmin(user)) {
      showGate(FORBIDDEN);
      return;
    }
  } catch {
    showGate("No se pudo verificar tu sesión. Vuelve a iniciar sesión.");
    return;
  }

  const setFormError = (message: string | null): void => {
    formError.textContent = message ?? "";
    formError.toggleAttribute("hidden", message === null);
  };
  const setState = (state: SubmitState): void => {
    submit.disabled = state === "submitting";
    submit.textContent = state === "submitting" ? "Guardando..." : "Guardar";
  };

  const readForm = (): ProductWritePayload => {
    const num = (id: string): number =>
      Number(requireElementOfType(`#${id}`, HTMLInputElement, form).value);
    return {
      name: requireElementOfType("#admin-name", HTMLInputElement, form).value.trim(),
      description: requireElementOfType("#admin-description", HTMLInputElement, form).value.trim(),
      imageBase: requireElementOfType("#admin-imageBase", HTMLInputElement, form).value.trim(),
      price: num("admin-price"),
      categoryId: num("admin-categoryId"),
      productTypeId: num("admin-productTypeId"),
      stock: num("admin-stock"),
      active: requireElementOfType("#admin-active", HTMLInputElement, form).checked,
    };
  };

  const fillForm = (product: ProductModel): void => {
    idField.value = String(product.id);
    requireElementOfType("#admin-name", HTMLInputElement, form).value = product.name;
    requireElementOfType("#admin-description", HTMLInputElement, form).value = product.description;
    requireElementOfType("#admin-imageBase", HTMLInputElement, form).value = product.image;
    requireElementOfType("#admin-price", HTMLInputElement, form).value = String(product.price);
    requireElementOfType("#admin-categoryId", HTMLInputElement, form).value = String(
      product.categoryId ?? "",
    );
    requireElementOfType("#admin-stock", HTMLInputElement, form).value = String(product.stock ?? 0);
    requireElementOfType("#admin-active", HTMLInputElement, form).checked =
      product.active !== false;
  };

  const renderList = (products: readonly ProductModel[]): void => {
    list.replaceChildren();
    for (const product of products) {
      const item = document.createElement("li");
      item.dataset.id = String(product.id);

      const label = document.createElement("span");
      label.textContent = `#${String(product.id)} ${product.name} — $${String(product.price)} — stock ${String(product.stock ?? 0)}`;

      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "btn-edit";
      edit.textContent = "Editar";
      edit.addEventListener("click", () => {
        fillForm(product);
        setFormError(null);
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn-delete";
      remove.textContent = "Eliminar";
      remove.addEventListener("click", () => {
        void onDelete(product.id);
      });

      item.append(label, edit, remove);
      list.append(item);
    }
  };

  const reload = async (): Promise<void> => {
    renderList(await fetchProducts());
  };

  const messageFor = (cause: unknown): string => {
    if (cause instanceof ApiError && cause.reason === "http" && cause.message.includes("403")) {
      return FORBIDDEN;
    }
    if (cause instanceof ApiError && cause.reason === "http" && cause.message.includes("400")) {
      return "Revisa los datos del formulario: precio, categoría y tipo deben existir y ser positivos.";
    }
    return "No se pudo completar la operación. Intenta de nuevo.";
  };

  async function onDelete(id: number): Promise<void> {
    setFormError(null);
    try {
      await deleteProduct(id);
      await reload();
    } catch (cause) {
      setFormError(messageFor(cause));
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setFormError(null);
    const payload = readForm();
    const editingId = idField.value.trim();

    void (async () => {
      setState("submitting");
      try {
        if (editingId.length > 0) {
          await updateProduct(Number(editingId), payload);
        } else {
          await createProduct(payload);
        }
        form.reset();
        idField.value = "";
        setState("success");
        await reload();
      } catch (cause) {
        setState("error");
        setFormError(messageFor(cause));
      }
    })();
  });

  requireElementOfType("#admin-reset", HTMLButtonElement, form).addEventListener("click", () => {
    form.reset();
    idField.value = "";
    setFormError(null);
  });

  await reload();
}
