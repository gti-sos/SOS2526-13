<script>
    import { onMount } from "svelte";
    import Highcharts from "highcharts";
    import { dev } from "$app/environment";

    let API1 = "/api/v2/exportations-stats";

    if (dev) {
        API1 = "http://localhost:3000" + API1;
    }

    let API2 = "api/v2/military-stats";
    let API3 = "api/v2/conflict-stats";

   
    async function getCountries(url) {
        try {
            let res = await fetch(url);
            let data = await res.json();

            let countries = new Set();

            data.forEach(d => {

                // TU API
                if (d.recipient) {
                    countries.add(d.recipient);
                }

                // MILITAR
                else if (d.country) {
                    countries.add(d.country);
                }

                // CONFLICTOS
                else if (d.location) {
                    let parts = d.location.split(",");
                    parts.forEach(p => countries.add(p.trim()));
                }

            });

            return countries;

        } catch (e) {
            console.log("Error API:", url);
            return new Set();
        }
    }

    function buildPresence(allCountries, apiCountries) {
        return allCountries.map(c => apiCountries.has(c) ? 1 : 0);
    }

    onMount(async () => {

        let c1 = await getCountries(API1);
        let c2 = await getCountries(API2);
        let c3 = await getCountries(API3);

        let all = new Set([...c1, ...c2, ...c3]);

        let categories = Array.from(all).slice(0, 12); // limitar visualmente

        let series1 = buildPresence(categories, c1);
        let series2 = buildPresence(categories, c2);
        let series3 = buildPresence(categories, c3);

        Highcharts.chart("container", {
            chart: {
                type: "column"
            },
            title: {
                text: "Presencia de actividad por país (APIs del grupo)"
            },
            xAxis: {
                categories: categories,
                title: {
                    text: "País"
                }
            },
            yAxis: {
                min: 0,
                max: 1,
                title: {
                    text: "Presencia (0 = no, 1 = sí)"
                }
            },
            series: [
                { name: "Exportaciones", data: series1 },
                { name: "Conflictos", data: series2 },
                { name: "Gasto militar", data: series3 }
            ]
        });

    });
</script>

<h1>Analytics del Grupo</h1>
<div id="container"></div>