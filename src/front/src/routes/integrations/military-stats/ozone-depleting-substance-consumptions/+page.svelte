<script>
    import { onMount } from "svelte";
    import Highcharts from "highcharts";

    let data = [];

    onMount(async () => {
        // Sustituye por la URL de tu nuevo endpoint
        const response = await fetch("https://sos2526-22.onrender.com/api/v1/ozone-depleting-substance-consumptions");
        data = await response.json();

        const compounds = [
            "methyl_chloroform", 
            "methyl_bromide", 
            "hcfc", 
            "carbon_tetrachloride", 
            "halon", 
            "cfc"
        ];

        const years = [...new Set(data.map(d => d.year))].sort((a, b) => a - b);

        const series = compounds.map(compound => ({
            name: compound.replace("_", " ").toUpperCase(), // Formatear nombre para leyenda
            data: years.map(year => {
                // Buscamos el registro para ese año (puedes filtrar también por país si hay varios)
                const record = data.find(d => d.year === year);
                return record ? record[compound] : 0;
            })
        }));

        // 4. Configurar Highcharts
        Highcharts.chart("chemical-container", {
            chart: {
                type: 'column' // Columnas para comparar magnitudes
            },
            title: {
                text: 'Emisiones de Sustancias Químicas por Año'
            },
            xAxis: {
                categories: years,
                title: { text: 'Año' }
            },
            yAxis: {
                title: { text: 'Cantidad (Unidades)' },
                stackLabels: { enabled: true } // Muestra el total encima de la barra
            },
            plotOptions: {
                column: {
                    stacking: 'normal', // Apila una sustancia sobre otra
                    dataLabels: { enabled: false }
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: series
        });
    });
</script>

<div id="chemical-container"></div>

<style>
    #chemical-container {
        width: 100%;
        height: 500px;
        margin: 20px 0;
    }
</style>