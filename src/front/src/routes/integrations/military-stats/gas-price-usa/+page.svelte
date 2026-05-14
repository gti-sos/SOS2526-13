<script>
    import { onMount } from 'svelte';

    let gasData = [];
    let loading = true;
    let error = '';

    const PROXY_URL = '/api/v2/military-stats/proxy/gas-price';

    onMount(async () => {
        try {
            const res = await fetch(PROXY_URL);

            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}`);
            }

            const json = await res.json();
            console.log('EIA API response:', json);

            gasData = (json.prices || []).reverse();

            createChart();
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    function createChart() {
        const Highcharts = window.Highcharts;

        Highcharts.chart('container', {
            chart: {
                type: 'spline'
            },

            title: {
                text: 'USA National Gas Prices (Last 4 Weeks)'
            },

            subtitle: {
                text: 'Data obtained from EIA API through my own proxy'
            },

            xAxis: {
                // El eje X ahora son las fechas (periodos)
                categories: gasData.map((d) => d.period),
                title: {
                    text: 'Date'
                }
            },

            yAxis: {
                title: {
                    text: 'Price (USD per Gallon)'
                }
            },

            tooltip: {
                shared: true,
                valuePrefix: '$',
                crosshairs: true
            },

            series: [
                {
                    name: 'All Grades Gas Price',
                    // El eje Y ahora son los precios
                    data: gasData.map((d) => d.price)
                }
            ]
        });
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<main>
    <h1>USA Gas Price Integration</h1>

    {#if loading}
        <p>Loading gas prices...</p>
    {/if}

    {#if error}
        <p class="error">Error: {error}</p>
    {/if}

    <div id="container"></div>
</main>