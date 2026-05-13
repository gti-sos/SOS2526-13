<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let chartContainer;

    onMount(async () => {
        if (!browser) return;

        await new Promise((resolve, reject) => {
            if (window.Chart) return resolve();
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });

        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const data = await res.json();

        // Fetch detalle de cada pokemon para obtener sus stats
        const details = await Promise.all(
            data.results.map(p => fetch(p.url).then(r => r.json()))
        );

        const labels = details.map(p => p.name);
        const weights = details.map(p => p.weight);
        const heights = details.map(p => p.height);

        new window.Chart(chartContainer, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    label: 'Peso',
                    data: weights,
                    backgroundColor: [
                        'rgba(55,138,221,0.7)',
                        'rgba(216,90,48,0.7)',
                        'rgba(46,204,113,0.7)',
                        'rgba(243,156,18,0.7)',
                        'rgba(155,89,182,0.7)',
                        'rgba(26,188,156,0.7)',
                        'rgba(231,76,60,0.7)',
                        'rgba(52,152,219,0.7)',
                        'rgba(230,126,34,0.7)',
                        'rgba(149,165,166,0.7)',
                        'rgba(55,138,221,0.4)',
                        'rgba(216,90,48,0.4)',
                        'rgba(46,204,113,0.4)',
                        'rgba(243,156,18,0.4)',
                        'rgba(155,89,182,0.4)',
                        'rgba(26,188,156,0.4)',
                        'rgba(231,76,60,0.4)',
                        'rgba(52,152,219,0.4)',
                        'rgba(230,126,34,0.4)',
                        'rgba(149,165,166,0.4)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ${ctx.raw / 10} kg`
                        }
                    }
                }
            }
        });
    });
</script>

<svelte:head>
    <title>PokeAPI - Peso de Pokémon</title>
</svelte:head>

<main style="max-width: 900px; margin: 0 auto; padding: 20px; font-family: sans-serif;">
    <h2>Peso de los primeros 20 Pokémon</h2>
    <div style="position: relative; height: 450px; width: 100%;">
        <canvas bind:this={chartContainer}></canvas>
    </div>
</main>