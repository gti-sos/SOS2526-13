// @ts-check
import { test, expect } from '@playwright/test';

let app = "http://localhost:3000/exportations-stats";

// preparar datos antes de cada test
async function setup(page){
    await page.goto(app);
    await page.getByTestId("borrar-datos").click();
    await page.getByTestId("cargar-datos").click();
    await page.waitForTimeout(1000);
}


// comprobar que la tabla carga datos
test("tabla carga datos", async ({ page }) => {
    await setup(page);
    const filas = await page.getByTestId("fila-tabla").count();
    expect(filas).toBeGreaterThan(0);
});


// crear recurso
test("crear recurso", async ({ page }) => {
    await setup(page);
    await page.getByRole("button",{name:"Añadir nuevo"}).click();
    await page.getByPlaceholder("País").fill("Testland");
    await page.getByPlaceholder("Proveedor").fill("Spain");
    await page.getByPlaceholder("Año").fill("2025");
    await page.getByPlaceholder("Valor").fill("50");
    await page.getByRole("button",{name:"Guardar"}).click();
    await expect(page.getByText("Elemento insertado correctamente")).toBeVisible();
});


// borrar un registro
test("borrar registro", async ({ page }) => {
    await setup(page);
    const antes = await page.getByTestId("fila-tabla").count();
    await page.getByRole("button",{name:"Eliminar"}).first().click();
    await page.waitForTimeout(1000);
    await page.getByTestId("cargar-datos").click();
    const despues = await page.getByTestId("fila-tabla").count();
    expect(despues).toBeGreaterThanOrEqual(0);
});


// borrar todos
test("borrar colección", async ({ page }) => {
    await setup(page);
    await page.getByTestId("borrar-datos").click();
    await page.waitForTimeout(1000);
    const filas = await page.getByTestId("fila-tabla").count();
    expect(filas).toBe(0);
});

//Editar
test("editar recurso", async ({ page }) => {
    await setup(page);   
    await page.getByRole("button",{name:"Editar"}).first().click();
    await page.waitForSelector('input[placeholder="Proveedor"]');
    await page.getByPlaceholder("Proveedor").fill("NuevoProveedor");
    await page.getByRole("button",{name:"Actualizar"}).click();
    await expect(page.getByText("Elemento actualizado correctamente")).toBeVisible();
    await page.getByRole("link",{name:"Volver"}).click();
    await page.waitForSelector('[data-testid="fila-tabla"]');
    await expect(page.getByText("NuevoProveedor")).toBeVisible();
});

//buscar
test("buscar recurso", async ({ page }) => {
    await setup(page);
    await page.getByRole("button",{name:"Buscar"}).click();
    await page.getByPlaceholder("País destinatario").fill("Spain");
    await page.getByTestId("buscar-datos").waitFor({ state: 'visible' });
    await page.getByTestId("buscar-datos").click();
    await expect(page.getByText("Spain").first()).toBeVisible();
});