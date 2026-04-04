// @ts-check
import { test, expect } from '@playwright/test';

let app = 'http://localhost:3000/military-stats';




test('has title', async ({ page }) => {
  await page.goto(app);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Military Stats/);
});
test.describe('Pruebas E2E completas - Military Stats', () => {

    test('Debería crear, buscar, editar en vista separada y borrar', async ({ page }) => {
        // 1. Ir a la página principal
        await page.goto(app);

        // 2. Limpiar datos previos para asegurar que la prueba sea limpia
        await page.click('button:has-text("Borrar todos los datos")');
        await expect(page.locator('table tbody tr')).toHaveCount(0);

        // 3. Crear un recurso nuevo (Usando tus placeholders de la página principal)
        await page.fill('input[placeholder="País"]', 'francia');
        await page.fill('input[placeholder="Año"]', '2025');
        await page.fill('input[placeholder="Milex total"]', '50000');
        await page.fill('input[placeholder="Milex per capita"]', '800');
        await page.fill('input[placeholder="Milex GDP"]', '2.1');
        await page.click('button:has-text("Añadir")');
        
        // Verificar que aparece en la tabla
        await expect(page.getByText('francia')).toBeVisible();

        // 4. Probar Buscador (Ojo a la "s" en tu placeholder)
        await page.fill('input[placeholder="País (ej: cuba)s"]', 'francia');
        await page.click('button:has-text("Buscar")');
        await expect(page.locator('table tbody tr')).toHaveCount(1);
        await page.click('button:has-text("Limpiar filtros")');

        // 5. EDITAR EN VISTA SEPARADA (Punto clave de tu ejercicio)
        const filaFrancia = page.locator('tr', { hasText: 'francia' });
        await filaFrancia.getByRole('link', { name: 'Editar' }).click();

        // Verificar que estamos en la ruta correcta
        await expect(page).toHaveURL(/\/military-stats\/francia\/2025/);

        // Modificar valores en el formulario de edición (usando tus nuevos placeholders)
        // Usamos .clear() primero para borrar lo que cargó onMount
        await page.locator('input[placeholder="Milex total"]').clear();
        await page.fill('input[placeholder="Milex total"]', '66666');
        
        await page.locator('input[placeholder="Milex gdp"]').clear();
        await page.fill('input[placeholder="Milex gdp"]', '3.5');

        // Pulsar Guardar
        await page.click('button:has-text("Guardar")');
        
        // Verificar mensaje de éxito en la vista de edición
        await expect(page.getByText('Elemento actualizado')).toBeVisible();

        // 6. Volver a la tabla y verificar el cambio
        await page.click('a:has-text("Volver")');
        // Esperamos a que la tabla cargue y buscamos el nuevo valor
        await expect(page.getByText('66666')).toBeVisible();

        // 7. Borrar recurso concreto
        await page.locator('tr', { hasText: 'francia' }).locator('button:has-text("Borrar")').click();
        await expect(page.getByText('francia')).not.toBeVisible();
    });
});