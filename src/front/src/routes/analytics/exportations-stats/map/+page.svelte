<script>
	import { onMount } from "svelte";
	import { browser, dev } from "$app/environment";

	let API = "/api/v2/exportations-stats";

	if (dev) {
		API = "http://localhost:3000" + API;
	}

	// Mapeo ISO-A3 (estable y fiable)
	const isoMap = {
		Spain: "ESP",
		Egypt: "EGY",
		Ethiopia: "ETH",
		Greece: "GRC",
		Afghanistan: "AFG",
		Angola: "AGO",
		Estonia: "EST",
		Algeria: "DZA",
		"El Salvador": "SLV",
		"Equatorial Guinea": "GNQ"
	};

	onMount(async () => {

		if (!browser) return;

		try {
			const Highcharts = (await import("highcharts")).default;
			await import("highcharts/modules/map");

			const topology = await fetch(
				"https://code.highcharts.com/mapdata/custom/world.topo.json"
			).then(res => res.json());

			const res = await fetch(API);
			const data = await res.json();

			// Agrupar por país (suma de TIV)
			let grouped = {};

			data.forEach(d => {
				let iso = isoMap[d.recipient];
				if (!iso) return;

				grouped[iso] = (grouped[iso] || 0) + d.tiv_total_order;
			});

			let mapData = Object.entries(grouped).map(([iso, value]) => ({
				code: iso,
				value: value
			}));

			// Crear mapa
			Highcharts.mapChart("container", {
				chart: {
					map: topology
				},
				title: {
					text: "Distribución geográfica de exportaciones (TIV)"
				},
				subtitle: {
					text: "Agregación del valor total de exportaciones por país destinatario"
				},
				accessibility: {
					enabled: false
				},
				mapNavigation: {
					enabled: true
				},
				colorAxis: {
					min: 0,
					stops: [
						[0, "#FFE5E5"],
						[0.5, "#FF4D4D"],
						[1, "#800000"]
					]
				},
				tooltip: {
					pointFormat: "<b>{point.name}</b><br/>TIV total: {point.value}"
				},
				series: [{
					name: "Exportaciones",
					data: mapData,
					joinBy: ["iso-a3", "code"],
					borderColor: "#FFFFFF",
					borderWidth: 0.5,
					dataLabels: {
						enabled: false
					}
				}]
			});

		} catch (e) {
			console.error("Error creando el mapa:", e);
		}
	});
</script>

<h1>Mapa de Exportaciones</h1>

<div
	id="container"
	style="height: 600px; border-radius: 10px;"
></div>