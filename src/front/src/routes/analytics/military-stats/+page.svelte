<script>
    import { onMount } from "svelte";
    import { browser, dev } from "$app/environment";
    import Highcharts from "highcharts";


    let API = "/api/v2/military-stats"; 

    if (dev) {
        API = "http://localhost:3000" + API;
    }

    onMount(async () => {
        if (!browser) return;

        try {
            const Highcharts = (await import("Highcharts")).default;
            const Accessibility = (await import("highcharts/modules/accessibility")).default;
            Accessibility(Highcharts);

            const res = await fetch(API);
            const data = await res.json();

            // --- PROCESAMIENTO DE DATOS ---
            // Ordenamos por año para que el gráfico de área fluya correctamente
            data.sort((a, b) => a.year - b.year);

            // Obtenemos años únicos para el eje X
            const years = [...new Set(data.map(d => d.year))];

            // Ejemplo: Mostramos los datos filtrados por un país o globales
            // Aquí filtramos por "Spain" para el ejemplo, o puedes sumar todos los países
            const cubaData = data.filter(d => d.country === "cuba");

            const totalSeries = cubaData.map(d => d.milex_total);
            const gdpSeries = cubaData.map(d => d.milex_gdp);

            // --- CREACIÓN DEL GRÁFICO ---
            Highcharts.chart("chart-container", {
                chart: {
                    type: 'area' 
                },
                title: {
                    text: "Análisis de Gasto Militar (Cuba)"
                },
                subtitle: {
                    text: "Gasto total y porcentaje sobre el PIB"
                },
                xAxis: {
                    categories: years,
                    title: { text: "Año" }
                },
                yAxis: [{
                    title: { text: "Millones de USD" }
                }, {
                    title: { text: "% PIB" },
                    opposite: true // Ponemos el porcentaje en el eje derecho
                }],
                accessibility: {
                    enabled: true // REQUISITO: Debe ser accesible
                },
                tooltip: {
                    shared: true
                },
                series: [{
                    name: "Gasto Total",
                    data: totalSeries,
                    color: "#434348",
                    yAxis: 0
                }, {
                    name: "% del PIB",
                    data: gdpSeries,
                    color: "#7cb5ec",
                    yAxis: 1 // Usa el eje de la derecha
                }]
            });

        } catch (e) {
            console.error("Error cargando la gráfica de área:", e);
        }
    });
</script>

<h1>Visualización de Gasto Militar</h1>

<div 
    id="chart-container" 
    style="height: 500px; border-radius: 10px; margin: 20px;"
></div>