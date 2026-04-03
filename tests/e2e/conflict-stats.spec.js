// @ts-check
import { test, expect } from "@playwright/test";

let app = "http://localhost:3000";

async function setup(page) {
    await page.goto(app);
    await page.getByRole("link", { name: "Frontend de Pablo Moraleda Alvarez" }).click();
    await page.getByRole("button", {name: "Borrar datos"}).click();
    await page.getByRole("button",{name: "Cargar datos iniciales"}).click();

    await page.waitForTimeout(1000);
}

//Página personal (título)
test("Navegación a página con título", async ({ page }) => {
    await page.goto(app);
    await page.getByRole("link", { name: "Frontend de Pablo Moraleda Alvarez" }).click();
    await expect(page).toHaveTitle(/Conflict Stats/);
});

//Contar datos
test("Cargar datos iniciales", async ({ page }) => {
    await setup(page);

    const numDatos = await page.getByTestId("filas tabla").count();
    expect(numDatos).toBe(10);
});

//Editar un elemento y comprobar que el cambio se refleja en la tabla
test("Editar elemento", async ({ page }) => {
  await setup(page);

  // Ir a editar (primer elemento)
  await page.getByRole("link", { name: "Editar" }).first().click();

  // Esperar a que carguen los datos
  await page.waitForSelector('input[placeholder="Intensity"]');

  // Cambiar valor
  const input = page.getByPlaceholder("Intensity");
  await input.fill("9999");

  // Guardar cambios
  await page.getByRole("button", { name: "Guardar" }).click();

  await page.waitForTimeout(1000);

  // Volver a la lista
  await page.getByRole("link", { name: "Volver" }).click();

  await page.waitForSelector('[data-testid="filas tabla"]');

  // Comprobar que el valor actualizado aparece
  await expect(page.getByText("9999")).toBeVisible();
});

