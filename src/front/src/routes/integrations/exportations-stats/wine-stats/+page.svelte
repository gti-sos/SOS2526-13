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
    await loadScript("https://code.highcharts.com/modules/sankey.js");
    await fetch("https://sos2526-29.onrender.com/api/v1/wine-stats/loadInitialData");
    const res = await fetch(
        "https://sos2526-29.onrender.com/api/v1/wine-stats"
    );

    const data = await res.json();

    const links = [];

    data.forEach(w => {

        const grape = w.grape || "Unknown grape";
        const type = w.type || "Unknown type";
        const region = w.region || "Unknown region";

        // Uva - Tipo
        links.push([grape, type]);

        // Tipo - Region
        links.push([type, region]);
    });

    Highcharts.chart("wine", {

        title: {
            text: "Flujo vino: Uva → Tipo → Region"
        },

        series: [{
            type: "sankey",
            name:"flujo",
            keys: ["from", "to", "weight"],
            data: links.map(l => [...l, 1])
        }]
    });
});
</script>

<div id="wine"></div>