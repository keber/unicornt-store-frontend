import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/errors";
import { requireElementOfType } from "@/lib/dom";

const {
  isAuthenticated,
  fetchCurrentUser,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = vi.hoisted(() => ({
  isAuthenticated: vi.fn(),
  fetchCurrentUser: vi.fn(),
  fetchProducts: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

vi.mock("@/services/auth.service", () => ({ isAuthenticated, fetchCurrentUser }));
vi.mock("@/services/product.service", () => ({
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
}));

const { initAdminProductsView } = await import("@/views/admin/adminProducts.view");

const MARKUP = `
  <p id="admin-gate" hidden></p>
  <form id="admin-product-form">
    <input type="hidden" id="admin-product-id" />
    <input id="admin-name" name="name" />
    <input id="admin-description" name="description" />
    <input id="admin-imageBase" name="imageBase" />
    <input id="admin-price" name="price" type="number" />
    <input id="admin-categoryId" name="categoryId" type="number" />
    <input id="admin-productTypeId" name="productTypeId" type="number" />
    <input id="admin-stock" name="stock" type="number" />
    <input id="admin-active" name="active" type="checkbox" checked />
    <p id="admin-form-error" hidden></p>
    <button id="admin-submit" type="submit">Guardar</button>
    <button id="admin-reset" type="button">Nuevo</button>
  </form>
  <ul id="admin-product-list"></ul>
`;

function setInput(id: string, value: string): void {
  requireElementOfType(id, HTMLInputElement).value = value;
}

function product(id: number, name = "Mug"): unknown {
  return {
    id,
    name,
    category: "Rainbows",
    categoryId: 2,
    subcategory: "Mug",
    price: 7990,
    description: "d",
    image: "mug",
    stock: 10,
    active: true,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = MARKUP;
  isAuthenticated.mockReturnValue(true);
  fetchCurrentUser.mockResolvedValue({ id: 1, email: "a@b.cl", roles: ["ROLE_ADMIN"] });
  fetchProducts.mockResolvedValue([product(1), product(2, "Poster")]);
});

async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

describe("initAdminProductsView", () => {
  it("shows a sign-in gate when there is no session", async () => {
    isAuthenticated.mockReturnValue(false);

    await initAdminProductsView();

    const gate = document.querySelector("#admin-gate");
    expect(gate?.hasAttribute("hidden")).toBe(false);
    expect(gate?.textContent).toContain("administrador");
    expect(fetchProducts).not.toHaveBeenCalled();
  });

  it("shows a forbidden message for a non-admin session", async () => {
    fetchCurrentUser.mockResolvedValue({ id: 1, email: "u@b.cl", roles: ["ROLE_USER"] });

    await initAdminProductsView();

    expect(document.querySelector("#admin-gate")?.textContent).toContain("ROLE_ADMIN");
    expect(document.querySelector("#admin-product-form")?.hasAttribute("hidden")).toBe(true);
  });

  it("renders the product list for an admin", async () => {
    await initAdminProductsView();
    await flush();

    const rows = document.querySelectorAll("#admin-product-list li");
    expect(rows).toHaveLength(2);
    expect(rows[0]?.textContent).toContain("Mug");
  });

  it("submitting the form creates a product with the mapped payload and reloads", async () => {
    createProduct.mockResolvedValue(product(3, "Sticker"));
    await initAdminProductsView();
    await flush();
    fetchProducts.mockResolvedValueOnce([product(1), product(2), product(3, "Sticker")]);

    setInput("#admin-name", "Sticker");
    setInput("#admin-description", "vinyl");
    setInput("#admin-imageBase", "sticker");
    setInput("#admin-price", "1990");
    setInput("#admin-categoryId", "2");
    setInput("#admin-productTypeId", "1");
    setInput("#admin-stock", "50");

    document.querySelector("#admin-product-form")?.dispatchEvent(new Event("submit"));
    await flush();

    expect(createProduct).toHaveBeenCalledWith({
      name: "Sticker",
      description: "vinyl",
      imageBase: "sticker",
      price: 1990,
      categoryId: 2,
      productTypeId: 1,
      stock: 50,
      active: true,
    });
    expect(document.querySelectorAll("#admin-product-list li")).toHaveLength(3);
  });

  it("deleting a row calls the service and reloads without it", async () => {
    await initAdminProductsView();
    await flush();
    deleteProduct.mockResolvedValue(undefined);
    fetchProducts.mockResolvedValueOnce([product(2, "Poster")]);

    requireElementOfType("#admin-product-list li .btn-delete", HTMLButtonElement).click();
    await flush();

    expect(deleteProduct).toHaveBeenCalledWith(1);
    expect(document.querySelectorAll("#admin-product-list li")).toHaveLength(1);
  });

  it("surfaces an actionable message when a write returns 403", async () => {
    createProduct.mockRejectedValue(new ApiError("http", "backend error (HTTP 403)."));
    await initAdminProductsView();
    await flush();

    setInput("#admin-name", "X");
    setInput("#admin-price", "1");
    setInput("#admin-categoryId", "1");
    setInput("#admin-productTypeId", "1");
    setInput("#admin-stock", "1");

    document.querySelector("#admin-product-form")?.dispatchEvent(new Event("submit"));
    await flush();

    const err = document.querySelector("#admin-form-error");
    expect(err?.hasAttribute("hidden")).toBe(false);
    expect(err?.textContent).toContain("administrador");
  });
});
