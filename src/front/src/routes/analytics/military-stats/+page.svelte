<script>
    import { onMount } from "svelte";
    import { browser, dev } from "$app/environment";
    import Highcharts from "highcharts";


    let API = "/api/v2/military-stats"; 

    if (dev) {
        API = "http://localhost:3000" + API;
    }

    onMount(async () => {
    // 1. Carga de datos (fetch)
    const res = await fetch(API);
    const data = await res.json();

    // 2. Procesamiento de datos para gráfico de AREA
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

    Highcharts.chart("container", {
        chart: {
            type: "area" // Cambiado de 'pie' a 'area'
        },
        title: {
            text: "Evolución del Gasto Militar Total"
        },
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
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: { enabled: true }
                    }
                }
            }
        },
        accessibility: {
            enabled: true, // Requisito de accesibilidad
            description: "Gráfico de área que muestra el gasto militar total de varios países entre 2010 y 2022"
        },
        series: seriesData
    });
});
</script>

<h1>Visualización de Gasto Militar</h1>

<div 
    id="container" 
    style="height: 500px; border-radius: 10px; margin: 20px;"
></div>