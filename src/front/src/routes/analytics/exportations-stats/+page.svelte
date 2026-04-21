<script>
    import { onMount } from "svelte";
    import Highcharts from "highcharts";
    import { dev } from "$app/environment";

    let API = "/api/v2/exportations-stats";

    if (dev) {
        API = "http://localhost:3000" + API;
    }

    onMount(async () => {
        const res = await fetch(API);
        const data = await res.json();

        // Agrupar por supplier
        let grouped = {};

        data.forEach(d => {
            if (!grouped[d.supplier]) {
                grouped[d.supplier] = 0;
            }
            grouped[d.supplier] += d.tiv_total_order;
        });

        let chartData = Object.entries(grouped).map(([key, value]) => ({
            name: key,
            y: value
        }));

        Highcharts.chart("container", {
            chart: {
                type: "pie"
            },
            title: {
                text: "Exportaciones por proveedor"
            },
            series: [{
                name: "TIV total",
                data: chartData
            }]
        });
    });
</script>

<h1>Visualización de Exportaciones</h1>
<div id="container"></div>