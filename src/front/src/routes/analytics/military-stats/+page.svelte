<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import Highcharts from "highcharts";

    let chartContainer;
    let API = "/api/v2/military-stats"; 

    if (dev) {
        API = "http://localhost:3000" + API;
    }

    // 1. Función para inicializar los datos si la DB está vacía
    async function loadInitialData() {
        console.log("Verificando/Cargando datos iniciales...");
        try {
            const res = await fetch(`${API}/loadInitialData`);
            if (res.ok) {
                console.log("Datos iniciales cargados con éxito.");
            } else {
                console.error("Error al ejecutar loadInitialData (puede que ya existan datos)");
            }
        } catch (error) {
            console.error("Error de conexión al cargar datos iniciales:", error);
        }
    }

    async function loadGraph() {
        try {
            const res = await fetch(API);
            const data = await res.json();

            if (data.length === 0) {
                console.warn("La API devolvió un array vacío.");
                return;
            }

            const years = [...new Set(data.map(d => d.year))].sort((a, b) => a - b);
            const countries = [...new Set(data.map(d => d.country))];

            const seriesData = countries.map(countryName => {
                return {
                    name: countryName,
                    data: years.map(y => {
                        const found = data.find(d => d.country === countryName && d.year === y);
                        return found ? found.milex_total : 0;
                    })
                };
            });

            Highcharts.chart(chartContainer, {
                chart: { type: "area" },
                title: { text: "Evolución del Gasto Militar Total" },
                xAxis: { categories: years, title: { text: "Año" } },
                yAxis: { title: { text: "Milex Total (USD)" } },
                series: seriesData
            });
        } catch (error) {
            console.error("Error al cargar el gráfico:", error);
        }
    }

    onMount(async () => {
        // Ejecutamos la secuencia lógica
        await loadInitialData(); // Primero poblar la DB
        await loadGraph();       // Luego pedir los datos y dibujar
    });
</script>

<h1>Visualización de Gasto Militar</h1>

<div bind:this={chartContainer} style="height: 500px; margin: 20px; border: 1px solid #eee;">
    Cargando datos y generando gráfico...
</div>