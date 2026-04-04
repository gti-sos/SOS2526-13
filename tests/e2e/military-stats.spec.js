// @ts-check
import { test, expect } from '@playwright/test';

let app = 'http://localhost:3000/military-stats';




test('has title', async ({ page }) => {
  await page.goto(app);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Military Stats/);
});
test.describe('Military Stats E2E Tests', () => {

    test('debería cargar datos iniciales, listar, borrar uno y borrar todos', async ({ page }) => {
        await page.goto(app);

        // 1. BORRAR TODO AL INICIO (para limpiar la prueba)
        await page.click('button:has-text("Borrar todos los datos")');
        // Esperamos a que la tabla esté vacía (o que no haya filas de datos)
        await expect(page.locator('table tbody tr')).toHaveCount(0);

        // 2. CREAR RECURSOS (Cargar iniciales)
        await page.click('button:has-text("Cargar datos")');
        await page.waitForTimeout(1000); // Esperar a que NeDB procese
        const filasIniciales = page.locator('table tbody tr');
        await expect(filasIniciales).not.toHaveCount(0);

        // 3. CREAR UN RECURSO MANUALMENTE
        await page.fill('input[placeholder="País"]', 'test-country');
        await page.fill('input[placeholder="Año"]', '2026');
        await page.fill('input[placeholder="Milex total"]', '1000');
        await page.fill('input[placeholder="Milex per capita"]', '10');
        await page.fill('input[placeholder="Milex GDP"]', '1.5');
        await page.click('button:has-text("Añadir")');
        
        // Verificar que aparece en la lista
        await expect(page.getByText('test-country')).toBeVisible();

        // 4. BUSCAR RECURSOS
        await page.fill('input[placeholder*="País (ej: cuba)"]', 'test-country');
        await page.click('button:has-text("Buscar")');
        // Solo debería quedar la fila de 'test-country'
        await expect(page.locator('table tbody tr')).toHaveCount(1);
        
        // Limpiar búsqueda
        await page.click('button:has-text("Limpiar filtros")');

        // 5. EDITAR RECURSO (Vista separada dinámica)
        // Buscamos el enlace "Editar" del recurso que creamos
        const filaAReemplazar = page.locator('tr', { hasText: 'test-country' });
        await filaAReemplazar.getByRole('link', { name: 'Editar' }).click();
        
        // Verificar que estamos en la URL dinámica (ej: /military-stats/test-country/2026)
        await expect(page).toHaveURL(/\/military-stats\/test-country\/2026/);
        
        // Cambiar un valor
        await page.fill('input[name="milex_total"]', '9999'); 
        await page.click('button:has-text("Actualizar")'); // O el botón que tengas en tu vista de edición
        
        // Volver y verificar
        await page.goto(LOCALHOST_URL);
        await expect(page.getByText('9999')).toBeVisible();

        // 6. BORRAR UN RECURSO CONCRETO
        const totalAntes = await page.locator('table tbody tr').count();
        await page.locator('tr', { hasText: 'test-country' }).getByRole('button', { name: 'Borrar' }).click();
        const totalDespues = await page.locator('table tbody tr').count();
        expect(totalDespues).toBe(totalAntes - 1);

        // 7. BORRAR TODOS LOS RECURSOS
        await page.click('button:has-text("Borrar todos los datos")');
        await expect(page.locator('table tbody tr')).toHaveCount(0);
    });
});

