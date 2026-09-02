import "bootstrap/dist/css/bootstrap.min.css";
import { renderGlobalFallback } from "@/components/GlobalFallback/GlobalFallback";
import { initLoginView } from "@/views/login.view";
import { initRegisterView } from "@/views/register.view";
// Importing the auth service here registers the shared bearer-token provider.
import { onAuthChange } from "@/services/auth.service";

/**
 * Entry point shared by login.html and register.html. It wires whichever form is
 * present on the page and, on success, returns the visitor to the catalog. The
 * `onAuthChange` import keeps `auth.service` in the bundle so the token provider
 * and the login/logout event stream are live on these pages too.
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
    // Touch the subscription API so the import is not tree-shaken away.
    void onAuthChange;
  } catch {
    renderGlobalFallback();
  }
}

document.addEventListener("DOMContentLoaded", bootstrapAuthPage);
