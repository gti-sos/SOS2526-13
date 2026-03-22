<script>
	import { onMount } from 'svelte';
	import{dev} from "$app/environment";

	let data = $state([]);
	let mensaje = $state('');
	let API = '/api/v2/conflict-stats';

	if(dev){
		API = "http://localhost:3000"+API;
	}

	//GET COLECCIÓN
	async function getData() {
		const response = await fetch(API, { method: 'GET' });
		data = await response.json();
	}

	onMount(() => {
		getData();
	});

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

	//EDITA UN RECURSO

	let editLocation = $state('');
	let editYear = $state('');
	let editIntensity = $state('');
	let editType = $state('');
	let editPrecision = $state('');

	let showEditar = $state(false);

	function abrirEditor(item) {
		showEditar = true;

		editLocation = item.location;
		editYear = item.year;
		editIntensity = item.intensity_level;
		editType = item.conflict_type;
		editPrecision = item.start_precision;
	}

	async function editarFila() {
		if (editIntensity === null || editType === null || editPrecision === null) {
			mensaje = 'Faltan campos obligatorios';
			return;
		} else {
			const res = await fetch(API + `/${editLocation}/${editYear}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					location: editLocation,
					year: Number(editYear),
					intensity_level: Number(editIntensity),
					conflict_type: Number(editType),
					start_precision: Number(editPrecision)
				})
			});

			if (res.status === 200) {
				mensaje = 'Elemento actualizado';
				await getData(); // refresca tabla
				showEditar = false;
			} else if (res.status === 400) {
				mensaje = 'Datos incorrectos';
			} else if (res.status === 404) {
				mensaje = 'Elemento no encontrado';
			} else {
				mensaje = `Error inesperado ${res.status}`;
			}
		}
	}
</script>

<h1>Test API Conflict Stats</h1>

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
			<tr style="border: 1px solid black;padding: 8px;text-align: center;">
				<td>{item.location}</td>
				<td>{item.year}</td>
				<td>{item.intensity_level}</td>
				<td>{item.conflict_type}</td>
				<td>{item.start_precision}</td>
				<td>
					<button onclick={() => deleteRecurso(item.location, item.year)}> Borrar fila </button>
					<button onclick={() => abrirEditor(item)}> Editar Fila </button>
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

{#if showEditar}
	<div class="modal">
		<div class="modal-content">
			<h2>Editar conflicto</h2>

			<p><b>{editLocation}</b> - {editYear}</p>

			<input type="number" bind:value={editIntensity} placeholder="Intensity" required />
			<input type="number" bind:value={editType} placeholder="Type" required />
			<input type="number" bind:value={editPrecision} placeholder="Precision" required />

			<br /><br />
			<button onclick={() => (showEditar = false)}>Cancelar</button>
			<button onclick={() => editarFila()}> Guardar </button>
		</div>
	</div>
{/if}

<p>Estado de operación: <strong>{mensaje}</strong></p>
