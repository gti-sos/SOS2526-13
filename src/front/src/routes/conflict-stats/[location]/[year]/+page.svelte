<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import{dev} from "$app/environment";

    let API = '/api/v2/conflict-stats';

	if(dev){
		API = "http://localhost:3000"+API;
	}

	let location = page.params.location;
	let year = page.params.year;

	let intensity = $state('');
	let type = $state('');
	let precision = $state('');

	let mensaje = $state('');

	// Función de editar
	async function editarFila() {
		if (intensity === null || type === null || precision === null) {
			mensaje = 'Faltan campos obligatorios';
			return;
		}

		const res = await fetch(`${API}/${location}/${year}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				location,
				year: Number(year),
				intensity_level: Number(intensity),
				conflict_type: Number(type),
				start_precision: Number(precision)
			})
		});

		if (res.status === 200) {
			mensaje = 'Elemento actualizado';
		} else if (res.status === 400) {
			mensaje = 'Datos incorrectos';
		} else if (res.status === 404) {
			mensaje = 'No encontrado';
		} else {
			mensaje = `Error ${res.status}`;
		}
	}

    onMount(async () => {
		const res = await fetch(`${API}/${location}/${year}`);
		if (res.status === 200) {
			const data = await res.json();

			intensity = data.intensity_level;
			type = data.conflict_type;
			precision = data.start_precision;
		}
	});
</script>

<form>
	<h2>Editar conflicto</h2>

	<p><b>{location}</b> - {year}</p>

	<input type="number" bind:value={intensity} placeholder="Intensity" required />
	<input type="number" bind:value={type} placeholder="Type" required />
	<input type="number" bind:value={precision} placeholder="Precision" required />

	<br /><br />
	<a href={'/conflict-stats'}>Volver</a>
	<button onclick={() => editarFila()}> Guardar </button>
</form>

<p>Estado de operación: <strong>{mensaje}</strong></p>
