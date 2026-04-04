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
test("Contar datos iniciales", async ({ page }) => {
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

//Test de búsqueda 
test("Busqueda avanzada South Sudan devuelve 4 resultados", async ({ page }) => {
  await setup(page);

  await page.getByTestId("location-select").selectOption("South Sudan");
  await page.getByRole("button", { name: "Buscar" }).click();

  await page.waitForTimeout(1000);

  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(4);
});

//Borrar todos los datos
test("Borrar todos los datos", async ({ page }) => {
  await setup(page);

  await page.getByRole("button", {name: "Borrar datos", exact: true}).click();
  await page.waitForTimeout(1000);

  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(0);
});

// Recuperar datos iniciales
test("Recuperar datos iniciales", async ({ page }) => {
  await page.goto(app);
  await page.getByRole("link", { name: "Frontend de Pablo Moraleda Alvarez" }).click();

  await page.getByRole("button", {name: "Cargar datos iniciales"}).click();

  await page.waitForSelector('[data-testid="filas tabla"]');

  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(10);
});

//Crear elemento
test("Crear elemento y comprobar total de filas", async ({ page }) => {
  await setup(page);
  await page.getByRole("button", { name: "Insertar nuevo conflicto" }).click();

  await page.getByPlaceholder("Location").fill("TestLocation");
  await page.getByPlaceholder("Year").fill("2026");
  await page.getByPlaceholder("Intensity", { exact: true }).fill("08");
  await page.getByPlaceholder("Type", { exact: true }).fill("06");
  await page.getByPlaceholder("Precision", { exact: true }).fill("2024");

  await page.getByRole("button", { name: "Insertar", exact: true }).click();
  await page.waitForSelector('[data-testid="filas tabla"]');
  await page.waitForTimeout(1000);
  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(11);
});

//Borrar un elemento y comprobar que el número de filas disminuye en 1
test("Borrar elemento", async ({ page }) => {
  await setup(page);

  const filasAntes = await page.getByTestId("filas tabla").count();

  //Borramos la primera fila
  await page.getByRole("button", { name: "Borrar fila", exact:true }).first().click();

  await page.waitForTimeout(1000);

  const filasDespues = await page.getByTestId("filas tabla").count();

  //Comprobamos que las filas hayan disminuido
  expect(filasDespues).toBe(filasAntes - 1);
});