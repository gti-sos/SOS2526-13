<script>
import { onMount } from "svelte";
import { browser } from "$app/environment";

function loadScript(src) {

    return new Promise(resolve => {

        if (document.querySelector(`script[src="${src}"]`)) {
            return resolve();
        }

        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        document.head.appendChild(s);
    });
}

onMount(async () => {

    if (!browser) return;

    await loadScript("https://code.highcharts.com/highcharts.js");
    await loadScript("https://code.highcharts.com/modules/networkgraph.js");
    await fetch("https://sos2526-18-cereal-productions-stable.onrender.com/api/v2/cereal-productions/loadInitialData");
    const res = await fetch(
        "https://sos2526-18-cereal-productions-stable.onrender.com/api/v2/cereal-productions"
    );

    const data = await res.json();

    const grouped = {};

    data.forEach(d => {

        const country = d.country || "Unknown";

        grouped[country] =
            (grouped[country] || 0) +
            Number(d.cereal_production || 0);
    });

    const sorted = Object.entries(grouped)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    const nodes = sorted.map(d => ({
        id: d.name,

        // tamaño del nodo según producción
        marker: {
            radius: Math.max(8, d.value / 2000000)
        },

        //  dato que se va a mostrar en tooltip
        value: d.value
    }));

    const links = [];

    for (let i = 0; i < sorted.length - 1; i++) {
        links.push({
            from: sorted[i].name,
            to: sorted[i + 1].name
        });
    }

    Highcharts.chart("cereal-network", {

        chart: {
            type: "networkgraph",
            backgroundColor: "#ffffff"
        },

        title: {
            text: "Produccion de cereales"
        },

        subtitle: {
            text: "Esta visualización representa en cada nodo el total de produccion de cereal por pais"
        },

        tooltip: {
            useHTML: true,
            formatter: function () {
                return `
                    <b>${this.point.id}</b><br/>
                    Produccion: <b>${this.point.value}</b>
                `;
            }
        },

        plotOptions: {
            networkgraph: {
                keys: ["from", "to"],
                layoutAlgorithm: {
                    enableSimulation: true
                }
            }
        },

        series: [{
            data: links,
            nodes: nodes
        }],

        credits: {
            enabled: false
        }
    });
});
</script>

<div
    id="cereal-network"
    style="
        width: 100%;
        height: 700px;
        background: white;
        border-radius: 14px;
    "
></div>