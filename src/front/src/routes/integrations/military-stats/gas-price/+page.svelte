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
            console.log('Gas API response:', json);

            gasData = json.result || [];

            createChart();
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    function parsePrice(price) {
        return Number(String(price).replace('$', '')) || 0;
    }

    function createChart() {
        const Highcharts = window.Highcharts;

        const topStates = gasData
            .map((state) => ({
                name: state.name,
                regular: parsePrice(state.regular),
                midGrade: parsePrice(state.midGrade),
                premium: parsePrice(state.premium),
                diesel: parsePrice(state.diesel)
            }))
            .filter((s) => s.regular > 0)
            .sort((a, b) => b.regular - a.regular)
            .slice(0, 10);

        Highcharts.chart('container', {
            chart: {
                // Cambiado de 'column' a 'spline'
                type: 'spline'
            },

            title: {
                text: 'Top 10 USA States by Gas Price'
            },

            subtitle: {
                text: 'Data obtained from RapidAPI through my own proxy'
            },

            xAxis: {
                categories: topStates.map((s) => s.name),
                title: {
                    text: 'State'
                }
            },

            yAxis: {
                min: 0,
                title: {
                    text: 'Price in USD'
                }
            },

            tooltip: {
                shared: true,
                valuePrefix: '$',
                crosshairs: true // Añadido para mejorar la lectura en gráficos de líneas
            },

            series: [
                {
                    name: 'Regular',
                    data: topStates.map((s) => s.regular)
                },
                {
                    name: 'MidGrade',
                    data: topStates.map((s) => s.midGrade)
                },
                {
                    name: 'Premium',
                    data: topStates.map((s) => s.premium)
                },
                {
                    name: 'Diesel',
                    data: topStates.map((s) => s.diesel)
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

    <p>
        This view retrieves USA gas price data from RapidAPI using a custom proxy and
        displays the result with a Highcharts <strong>spline</strong> chart.
    </p>

    {#if loading}
        <p>Loading gas prices...</p>
    {/if}

    {#if error}
        <p class="error">Error: {error}</p>
    {/if}

    <div id="container"></div>
</main>