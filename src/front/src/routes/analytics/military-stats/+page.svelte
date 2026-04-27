<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import Highcharts from "highcharts";

    // Importante: Para accesibilidad en Highcharts, a veces necesitas este módulo
    // import accessibility from 'highcharts/modules/accessibility';
    // if (typeof Highcharts === 'object') { accessibility(Highcharts); }

    let chartContainer; // Referencia al div
    let API = "/api/v2/military-stats"; 

    if (dev) {
        API = "http://localhost:3000" + API;
    }

    onMount(async () => {
        try {
            const res = await fetch(API);
            if (!res.ok) throw new Error("Error al cargar la API");
            
            const data = await res.json();

            if (data && data.length > 0) {
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

                // Pasamos chartContainer en lugar del string "container"
                Highcharts.chart(chartContainer, {
                    chart: { type: "area" },
                    title: { text: "Evolución del Gasto Militar Total" },
                    xAxis: {
                        categories: years,
                        title: { text: "Año" }
                    },
                    yAxis: {
                        title: { text: "Milex Total (USD)" }
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.y:,.1f}</b> USD'
                    },
                    series: seriesData
                });
            } else {
                console.warn("La API no devolvió datos.");
            }
        } catch (error) {
            console.error("Error detallado:", error);
        }
    });
</script>

<h1>Visualización de Gasto Militar</h1>

<div 
    bind:this={chartContainer} 
    style="height: 500px; border-radius: 10px; margin: 20px; border: 1px solid #ccc;"
>
    Cargando gráfico...
</div>

