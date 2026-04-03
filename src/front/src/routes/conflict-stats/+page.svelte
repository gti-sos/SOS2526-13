<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let data = $state([]);
	let mensaje = $state('');
	let API = '/api/v2/conflict-stats';

	if (dev) {
		API = 'http://localhost:3000' + API;
	}

	//GET COLECCIÓN
	async function getData() {
		const response = await fetch(API, { method: 'GET' });
		data = await response.json();
		updateSelectors();
	}

	//CARGA DATOS INICIALES
	async function loadData() {
		const response = await fetch(API + '/loadInitialData', { method: 'GET' });
		if (response.status === 201) {
			mensaje = 'Los datos se han cargado correctamente';
		} else if (response.status === 409) {
			mensaje = 'Los datos ya estaban cargados (Conflict)';
		} else {
			mensaje = `Respuesta inesperada: ${response.status}`;
		}

		await getData();
	}

	//BORRA LA COLECCIÓN ENTERA
	async function deleteData() {
		const response = await fetch(API, { method: 'DELETE' });
		mensaje = 'Datos borrados correctamente';
		await getData();
	}

	//BORRA RECURSO CONCRETO
	async function deleteRecurso(location, year) {
		const response = await fetch(API + `/${location}/${year}`, { method: 'DELETE' });
		mensaje = 'Recurso borrado correctamente';
		await getData();
	}

	//INSERTA UN RECURSO
	let newLocation = $state('');
	let newYear = $state('');
	let newIntensity = $state('');
	let newType = $state('');
	let newPrecision = $state('');

	let showNew = $state(false);

	function abrirInsertar() {
		showNew = true;

		newLocation = '';
		newYear = '';
		newIntensity = '';
		newType = '';
		newPrecision = '';
	}

	async function insertConflict() {
		if (
			newLocation === '' ||
			newYear === '' ||
			newIntensity === '' ||
			newType === '' ||
			newPrecision === ''
		) {
			mensaje = 'Faltan campos obligatorios';
			return;
		} else {
			const response = await fetch(API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				//body a recibir
				body: JSON.stringify({
					location: newLocation,
					year: Number(newYear),
					intensity_level: Number(newIntensity),
					conflict_type: Number(newType),
					start_precision: Number(newPrecision)
				})
			});
			if (response.status === 201) {
				mensaje = 'Elemento insertado correctamente';
				await getData();
				showNew = false;
			} else if (response.status === 409) {
				mensaje = 'Elemento ya insertado';
			} else if (response.status === 400) {
				mensaje = 'Formato incorrecto';
			} else {
				mensaje = `Error inesperado ${response.status}`;
			}
		}
	}

	// Busquedas que permite la API

	// FILTROS
	let filterLocation = $state('');
	let filterYear = $state('');
	let filterIntensity = $state('');
	let filterType = $state('');
	let filterPrecision = $state('');

	// OPCIONES SELECT
	let locations = $state([]);
	let years = $state([]);

	// GENERAR OPCIONES ÚNICAS
	function updateSelectors() {
		locations = [...new Set(data.map((d) => d.location))];
		years = [...new Set(data.map((d) => d.year))];
	}

	// BUSCADOR
	async function searchData() {
		let params = new URLSearchParams();

		if (filterLocation) params.append('location', filterLocation);
		if (filterYear) params.append('year', filterYear);
		if (filterIntensity) params.append('intensity_level', filterIntensity);
		if (filterType) params.append('conflict_type', filterType);
		if (filterPrecision) params.append('start_precision', filterPrecision);

		const query = params.toString();

		const res = await fetch(API + '?' + query); //genera la URL
		data = await res.json();
	}

	// --- RESET ---
	function resetFilters() {
		filterLocation = '';
		filterYear = '';
		filterIntensity = '';
		filterType = '';
		filterPrecision = '';
		getData();
	}

	onMount(() => {
		getData();
	});

</script>

<svelte:head>
	<title>Conflict Stats</title>
</svelte:head>

<h1>Test API Conflict Stats</h1>

<h2>Buscar conflictos</h2>

<div style="margin-bottom: 20px;">
	<!-- LOCATION -->
	<select bind:value={filterLocation}>
		<option value="">Todas las localizaciones</option>
		{#each locations as loc}
			<option value={loc}>{loc}</option>
		{/each}
	</select>

	<!-- YEAR -->
	<select bind:value={filterYear}>
		<option value="">Todos los años</option>
		{#each years as y}
			<option value={y}>{y}</option>
		{/each}
	</select>

	<!-- NUMÉRICOS -->
	<input type="number" bind:value={filterIntensity} placeholder="Intensity level" />
	<input type="number" bind:value={filterType} placeholder="Conflict type" />
	<input type="number" bind:value={filterPrecision} placeholder="Start precision" />

	<br /><br />

	<button onclick={searchData}>Buscar</button>
	<button onclick={resetFilters}>Reset</button>
</div>

<button onclick={loadData}> Cargar datos iniciales </button>

<table style="border-collapse: collapse; width: 100%;">
	<thead>
		<tr style="border: 1px solid black;padding: 8px;text-align: center;">
			<th>Location</th>
			<th>Year</th>
			<th>Intensity level</th>
			<th>Conflict type</th>
			<th>Start precision</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each data as item (item.location + item.year)}
			<tr
				data-testid="filas tabla"
				style="border: 1px solid black;padding: 8px;text-align: center;"
			>
				<td>{item.location}</td>
				<td>{item.year}</td>
				<td>{item.intensity_level}</td>
				<td>{item.conflict_type}</td>
				<td>{item.start_precision}</td>
				<td>
					<button onclick={() => deleteRecurso(item.location, item.year)}> Borrar fila </button>
					<a href={`/conflict-stats/${item.location}/${item.year}`}> Editar </a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<button onclick={() => abrirInsertar()}> Insertar nuevo conflicto</button>
<button onclick={deleteData}> Borrar datos</button>

{#if showNew}
	<div class="modal">
		<div class="modal-content">
			<h2>Insertar conflicto</h2>

			<input bind:value={newLocation} placeholder="Location" required />
			<input type="number" bind:value={newYear} placeholder="Year" required />
			<input type="number" bind:value={newIntensity} placeholder="Intensity" required />
			<input type="number" bind:value={newType} placeholder="Type" required />
			<input type="number" bind:value={newPrecision} placeholder="Precision" required />

			<br /><br />
			<button onclick={() => (showNew = false)}>Cancelar</button>
			<button onclick={() => insertConflict()}> Insertar </button>
		</div>
	</div>
{/if}

<p>Estado de operación: <strong>{mensaje}</strong></p>
