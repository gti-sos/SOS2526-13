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

		const res = await fetch('/api/v2/proxy/weather?lat=37.38&lon=-5.97');
		const data = await res.json();

		console.log('Data recibida:', data); // <-- ver qué llega

		if (!data.list) {
			console.error('Error de OpenWeather:', data.message || data);
			return;
		}

		// Cada burbuja: x = hora del día (0-23), y = temperatura, r = humedad relativa / 10
		const bubbles = data.list.map((item) => ({
			x: new Date(item.dt * 1000).getHours(),
			y: Math.round(item.main.temp * 10) / 10,
			r: Math.round(item.main.humidity / 10)
		}));

		new window.Chart(chartContainer, {
			type: 'bubble',
			data: {
				datasets: [
					{
						label: 'Temp (°C) vs hora — tamaño = humedad',
						data: bubbles,
						backgroundColor: 'rgba(55,138,221,0.5)',
						borderColor: '#378ADD',
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					tooltip: {
						callbacks: {
							label: (ctx) => {
								const d = ctx.raw;
								return `${d.x}h — ${d.y}°C — humedad: ${d.r * 10}%`;
							}
						}
					}
				},
				scales: {
					x: {
						min: 0,
						max: 23,
						title: { display: true, text: 'Hora del día' },
						ticks: { stepSize: 1 }
					},
					y: {
						title: { display: true, text: 'Temperatura (°C)' }
					}
				}
			}
		});
	});
</script>

<svelte:head>
	<title>OpenWeatherMap - Previsión Sevilla</title>
</svelte:head>

<main style="max-width: 900px; margin: 0 auto; padding: 20px; font-family: sans-serif;">
	<h2>Previsión Sevilla — temperatura por hora y humedad (vía proxy)</h2>
	<div style="position: relative; height: 450px; width: 100%;">
		<canvas bind:this={chartContainer}></canvas>
	</div>
</main>
