<script>
	import { onMount } from "svelte";
	import { browser, dev } from "$app/environment";

	let API = "/api/v2/conflict-stats";

	if (dev) {
		API = "http://localhost:3000" + API;
	}

	// ISO-A3 básico (añade más si los necesitas)
	const isoMap = {
		India: "IND",
		Egypt: "EGY",
		Israel: "ISR",
		Sudan: "SDN",
		"South Sudan": "SSD",
		Spain: "ESP",
		Greece: "GRC",
		Afghanistan: "AFG",
		Algeria: "DZA"
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

			let grouped = {};

			data.forEach(d => {

				if (!d.location) return;

				// separar países: "Egypt, Israel"
				const countries = d.location.split(",");

				countries.forEach(c => {
					const country = c.trim();
					const iso = isoMap[country];

					if (!iso) return;

					grouped[iso] =
						(grouped[iso] || 0) + (Number(d.intensity_level) || 0);
				});
			});

			const mapData = Object.entries(grouped).map(([iso, value]) => ({
				code: iso,
				value: value
			}));

			Highcharts.mapChart("container", {
				chart: {
					map: topology
				},
				title: {
					text: "Conflictos por país"
				},
				subtitle: {
					text: "Suma de intensidad de conflictos"
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
						[0, "#E6F2FF"],
						[0.5, "#3399FF"],
						[1, "#003366"]
					]
				},
				tooltip: {
					pointFormat:
						"<b>{point.name}</b><br/>Intensidad total: {point.value}"
				},
				series: [{
					name: "Conflictos",
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

<h1>Mapa de Conflictos</h1>

<div
	id="container"
	style="height: 600px; border-radius: 10px;"
></div>