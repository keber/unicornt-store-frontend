import "bootstrap/dist/css/bootstrap.min.css";
import { renderGlobalFallback } from "@/components/GlobalFallback/GlobalFallback";
import { initLoginView } from "@/views/login.view";
import { initRegisterView } from "@/views/register.view";
// Importing the auth service registers the shared bearer-token provider and keeps
// the login/logout event stream live on these pages.
import "@/services/auth.service";

/**
 * Entry point shared by login.html and register.html. It wires whichever form is
 * present on the page and, on success, returns the visitor to the catalog.
 */
export function bootstrapAuthPage(): void {
  try {
    const goHome = (): void => {
      window.location.href = "/";
    };
    if (document.getElementById("login-form") !== null) {
      initLoginView({ onSuccess: goHome });
    }
    if (document.getElementById("register-form") !== null) {
      initRegisterView({ onSuccess: goHome });
    }
  } catch {
    renderGlobalFallback();
  }
}

document.addEventListener("DOMContentLoaded", bootstrapAuthPage);
