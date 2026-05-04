<script>
    import { onMount } from "svelte";
    import Highcharts from "highcharts";

    onMount(async () => {
        try {
            // 1. Obtener los datos de la API de café
            const response = await fetch("https://api.sampleapis.com/coffee/hot");
            const data = await response.json();

            // 2. Procesar los datos
            // Vamos a contar cuántos ingredientes tiene cada café
            const chartData = data.map(coffee => ({
                name: coffee.title,
                y: coffee.ingredients.length,
                ingredientsList: coffee.ingredients.join(", ")
            }));

            // 3. Configurar Highcharts
            Highcharts.chart("coffee-container", {
                chart: {
                    type: 'bar', // Barras horizontales
                    backgroundColor: '#faf9f6' // Color crema/papel
                },
                title: {
                    text: 'Complejidad del Café: Número de Ingredientes'
                },
                xAxis: {
                    type: 'category',
                    title: { text: null }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Cantidad de ingredientes',
                        align: 'high'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size: 12px"><b>{point.key}</b></span><br/>',
                    pointFormat: 'Ingredientes: <i>{point.ingredientsList}</i>'
                },
                plotOptions: {
                    bar: {
                        dataLabels: { enabled: true },
                        color: '#6F4E37' // Color café
                    }
                },
                legend: { enabled: false },
                series: [{
                    name: 'Ingredientes',
                    data: chartData
                }]
            });
        } catch (error) {
            console.error("Error con la API de café:", error);
        }
    });
</script>

<div id="coffee-container"></div>

<style>
    #coffee-container {
        width: 100%;
        height: 600px; /* Un poco más alto para que quepan todos los nombres */
        margin: 20px 0;
        border-radius: 10px;
        overflow: hidden;
    }
</style>