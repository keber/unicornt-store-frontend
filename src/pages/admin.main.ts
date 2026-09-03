import "bootstrap/dist/css/bootstrap.min.css";
import { renderGlobalFallback } from "@/components/GlobalFallback/GlobalFallback";
// Importing the auth service registers the shared bearer-token provider.
import "@/services/auth.service";
import { initAdminProductsView } from "@/views/admin/adminProducts.view";

/** Entry point for admin.html. */
export function bootstrapAdminPage(): void {
  try {
    void initAdminProductsView();
  } catch {
    renderGlobalFallback();
  }
}

document.addEventListener("DOMContentLoaded", bootstrapAdminPage);
