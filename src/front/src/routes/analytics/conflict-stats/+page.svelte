<script>
	import { onMount } from 'svelte';
    import { dev } from "$app/environment";

	let data = [];
    let API = '/api/v2/conflict-stats';

    if (dev) {
        API = "http://localhost:3000" + API;
    }

	onMount(async () => {

		// 🔥 cargar datos iniciales
		await fetch(API);

		const res = await fetch(API);

		if (!res.ok) {
			console.error("Error API:", res.status);
			return;
		}

		data = await res.json();

		// Limitar años para que quepan bien
		const years = [...new Set(data.map(d => d.year))]
			.sort((a, b) => a - b)
			.slice(-5);

		const series = years.map(year => {

			const dataYear = data.filter(d => d.year === year);

			return {
				name: `Year ${year}`,
				data: dataYear.map(d => ({
					name: d.location,
					value: Number(d.intensity_level) || 0,

					custom: {
						conflict_type: Number(d.conflict_type) || 0,
						start_precision: Number(d.start_precision) || 0
					}
				}))
			};
		});

		const Highcharts = window.Highcharts;

		Highcharts.chart('container', {
			chart: {
				type: 'packedbubble',
				height: '900px' // 🔥 clave para que entren todos
			},

			title: {
				text: 'Conflict Stats'
			},

			subtitle: {
				text: 'Nivel 1: Año | Nivel 2: País'
			},

			tooltip: {
				useHTML: true,
				pointFormat: `
					<b>{point.name}</b><br/>
					Type: {point.custom.conflict_type}<br/>
					Precision: {point.custom.start_precision}
				`
			},

			plotOptions: {
				packedbubble: {
					minSize: '10%',
					maxSize: '60%',
					zMin: 0,
					zMax: 2000000,

					layoutAlgorithm: {
						gravitationalConstant: 0.015,
						splitSeries: true,
						seriesInteraction: false,
						dragBetweenSeries: false,
						parentNodeLimit: true
					},

					dataLabels: {
						enabled: true,
						format: '{point.name}',
						allowOverlap: false,
						style: {
							color: 'black',
							textOutline: 'none',
							fontSize: '9px'
						}
					}
				}
			},

			series
		});
	});
</script>

<!-- 🔥 Highcharts desde navegador -->
<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-more.js"></script>
</svelte:head>

<div id="container" style="width:100%; height:900px; max-width:1000px; margin:auto;"></div>