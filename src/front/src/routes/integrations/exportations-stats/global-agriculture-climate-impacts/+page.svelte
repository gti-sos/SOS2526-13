<script>
import { onMount } from "svelte";
import { browser } from "$app/environment";

function loadScript(src) {
    return new Promise(resolve => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        document.head.appendChild(s);
    });
}

onMount(async () => {

    if (!browser) return;

    await loadScript("https://code.highcharts.com/highcharts.js");
    await loadScript("https://code.highcharts.com/modules/heatmap.js");
    

    const res = await fetch(
        "/api/v2/exportations-stats/proxy/global-agriculture-climate-impacts"
    );

    const data = await res.json();

    const sample = data.slice(0, 10);

    // Extrae los  VALORES
    const temps = sample.map(d => d.average_temperature_c);

    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);

    //HEATMAP DATA (x, y, value)
    const chartData = sample.map((d, i) => {

        // normalización 0-100
        const value =
            ((d.average_temperature_c - minTemp) /
            (maxTemp - minTemp)) * 100;

        return [i, 0, value];
    });

    Highcharts.chart("heatmap", {

        chart: {
            type: "heatmap"
        },

        title: {
            text: "Impacto global del clima en la agricultura"
        },

        xAxis: {
            categories: sample.map(d => d.country)
        },

        yAxis: {
            categories: ["Temperatura"],
            title: null
        },

        colorAxis: {
            min: 0,
            max: 100,
            stops: [
                [0, "#1f77b4"],   // azul (frío)
                [0.5, "#f7f7f7"], // neutro
                [1, "#d62728"]    // rojo (calor)
            ]
        },

        series: [{
            name: "Temperatura",
            borderWidth: 1,
            data: chartData,
            dataLabels: {
                enabled: true,
                format: "{point.value:.1f}%"
            }
        }]
    });
});
</script>

<div id="heatmap"></div>