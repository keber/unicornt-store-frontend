import { describe, expect, it } from "vitest";
import { requireFormStringField } from "@/lib/form";

describe("requireFormStringField", () => {
  it("devuelve el valor cuando el campo existe como texto", () => {
    const formData = new FormData();
    formData.set("email", "ana@example.com");

    expect(requireFormStringField(formData, "email")).toBe("ana@example.com");
  });

  it("devuelve string vacio si el campo existe pero esta vacio", () => {
    const formData = new FormData();
    formData.set("address", "");

    expect(requireFormStringField(formData, "address")).toBe("");
  });

  it("lanza TypeError si el campo no existe", () => {
    const formData = new FormData();
    expect(() => requireFormStringField(formData, "fullName")).toThrow(TypeError);
  });

  it("lanza TypeError si el campo llego como File, no como texto", () => {
    const formData = new FormData();
    formData.set("attachment", new File(["contenido"], "foto.png", { type: "image/png" }));

    expect(() => requireFormStringField(formData, "attachment")).toThrow(TypeError);
  });
});
