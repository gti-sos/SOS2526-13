<script>
	// onMount se ejecuta una sola vez cuando el componente se monta en el DOM.
	// dev es true cuando el servidor corre en modo desarrollo (vite dev server).
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	// Estado reactivo con la sintaxis de Svelte 5 ($state).
	// Cualquier cambio en estas variables re-renderiza automáticamente el HTML.
	let data    = $state([]);   // array de conflictos que muestra la tabla
	let mensaje = $state('');   // texto de feedback al usuario tras operaciones

	// En producción las peticiones van a la misma URL relativa (mismo servidor).
	// En desarrollo el frontend corre en el puerto de Vite (distinto al 3000
	// del backend), por eso se necesita la URL absoluta con el puerto de Express.
	let API = '/api/v2/conflict-stats';
	if (dev) {
		API = 'http://localhost:3000' + API;
	}

	// ── GET COLECCIÓN ─────────────────────────────────────────────────────────
	// Pide todos los conflictos al backend y actualiza el estado `data`.
	// Después llama a updateSelectors() para regenerar las opciones de los
	// desplegables de filtro con los valores únicos que haya en la BD.
	async function getData() {
		const response = await fetch(API, { method: 'GET' });
		data = await response.json();
		updateSelectors();
	}

	// ── CARGA DE DATOS INICIALES ──────────────────────────────────────────────
	// Llama al endpoint /loadInitialData del backend.
	// Si la BD estaba vacía (201) informa del éxito.
	// Si ya tenía datos (409) informa de que ya estaban cargados.
	// En cualquier caso refresca la tabla.
	async function loadData() {
		const response = await fetch(API + '/loadInitialData', { method: 'GET' });
		if (response.status === 201) {
			mensaje = 'Los datos se han cargado correctamente';
		} else if (response.status === 409) {
			mensaje = 'Los datos ya estaban cargados (Conflict)';
		} else {
			mensaje = `Respuesta inesperada: ${response.status}`;
		}
		await getData(); // refresca la tabla tras la carga
	}

	// ── BORRAR TODA LA COLECCIÓN ──────────────────────────────────────────────
	// Envía DELETE a la raíz del recurso, borrando todos los documentos.
	// Después refresca la tabla (quedará vacía).
	async function deleteData() {
		const response = await fetch(API, { method: 'DELETE' });
		mensaje = 'Datos borrados correctamente';
		await getData();
	}

	// ── BORRAR UN RECURSO CONCRETO ────────────────────────────────────────────
	// Envía DELETE a /location/year para borrar solo ese registro.
	// Se llama desde el botón "Borrar fila" de cada fila de la tabla.
	async function deleteRecurso(location, year) {
		const response = await fetch(API + `/${location}/${year}`, { method: 'DELETE' });
		mensaje = 'Recurso borrado correctamente';
		await getData(); // refresca la tabla
	}

	// ── ESTADO DEL FORMULARIO DE INSERCIÓN ───────────────────────────────────
	// Cada campo del formulario tiene su propia variable reactiva.
	let newLocation  = $state('');
	let newYear      = $state('');
	let newIntensity = $state('');
	let newType      = $state('');
	let newPrecision = $state('');

	// Controla la visibilidad del modal de inserción.
	let showNew = $state(false);

	// Abre el modal y limpia los campos del formulario.
	function abrirInsertar() {
		showNew = true;
		newLocation  = '';
		newYear      = '';
		newIntensity = '';
		newType      = '';
		newPrecision = '';
	}

	// ── INSERTAR UN NUEVO CONFLICTO ───────────────────────────────────────────
	// Valida que todos los campos estén rellenos antes de enviar.
	// Hace POST con el JSON del nuevo conflicto.
	// Gestiona los distintos códigos de respuesta del backend:
	//   201 → insertado correctamente, cierra el modal y refresca la tabla
	//   409 → ya existe un conflicto con ese location+year
	//   400 → el JSON enviado no tiene el formato correcto
	async function insertConflict() {
		if (newLocation === '' || newYear === '' || newIntensity === '' ||
			newType === '' || newPrecision === '') {
			mensaje = 'Faltan campos obligatorios';
			return; // aborta sin hacer la petición
		}

		const response = await fetch(API, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			// Convierte los valores numéricos de string a Number antes de enviar
			body: JSON.stringify({
				location:       newLocation,
				year:           Number(newYear),
				intensity_level: Number(newIntensity),
				conflict_type:  Number(newType),
				start_precision: Number(newPrecision)
			})
		});

		if (response.status === 201) {
			mensaje = 'Elemento insertado correctamente';
			await getData();  // refresca la tabla con el nuevo elemento
			showNew = false;  // cierra el modal
		} else if (response.status === 409) {
			mensaje = 'Elemento ya insertado';
		} else if (response.status === 400) {
			mensaje = 'Formato incorrecto';
		} else {
			mensaje = `Error inesperado ${response.status}`;
		}
	}

	// ── ESTADO DE LOS FILTROS ─────────────────────────────────────────────────
	// Una variable por cada campo filtrable. Se enlazan a los inputs del buscador.
	let filterLocation  = $state('');
	let filterYear      = $state('');
	let filterIntensity = $state('');
	let filterType      = $state('');
	let filterPrecision = $state('');

	// Opciones únicas para los selectores de Location y Year.
	// Se generan a partir de los datos actuales de la tabla.
	let locations = $state([]);
	let years     = $state([]);

	// Extrae los valores únicos de location y year del array `data`
	// usando Set para eliminar duplicados, y los asigna a los selectores.
	function updateSelectors() {
		locations = [...new Set(data.map((d) => d.location))];
		years     = [...new Set(data.map((d) => d.year))];
	}

	// ── BUSCAR CON FILTROS ────────────────────────────────────────────────────
	// Construye la query string con solo los filtros que tengan valor
	// y hace GET a la API con esos parámetros.
	// El backend filtra en la BD y devuelve solo los resultados que coincidan.
	async function searchData() {
		let params = new URLSearchParams();

		// Solo añade a la URL los parámetros que el usuario haya rellenado
		if (filterLocation)  params.append('location',       filterLocation);
		if (filterYear)      params.append('year',           filterYear);
		if (filterIntensity) params.append('intensity_level', filterIntensity);
		if (filterType)      params.append('conflict_type',  filterType);
		if (filterPrecision) params.append('start_precision', filterPrecision);

		const query = params.toString(); // ej: "location=India&year=2012"
		const res = await fetch(API + '?' + query);
		data = await res.json(); // actualiza la tabla con los resultados filtrados
	}

	// ── RESET DE FILTROS ──────────────────────────────────────────────────────
	// Limpia todos los campos de filtro y vuelve a cargar todos los datos.
	function resetFilters() {
		filterLocation  = '';
		filterYear      = '';
		filterIntensity = '';
		filterType      = '';
		filterPrecision = '';
		getData(); // recarga la tabla sin filtros
	}

	// Carga los datos al montar el componente por primera vez.
	onMount(() => {
		getData();
	});
</script>

<!-- Título de la pestaña del navegador -->
<svelte:head>
	<title>Conflict Stats</title>
</svelte:head>

<h1>Test API Conflict Stats</h1>

<!-- ── BUSCADOR ────────────────────────────────────────────────────────────── -->
<fieldset style="display: inline-block;">
<legend>Buscador</legend>
<div style="margin-bottom: 20px;">

	<!-- Selector de localización: las opciones se generan dinámicamente
	     con los valores únicos de `locations` (actualizado en updateSelectors) -->
	<select bind:value={filterLocation} data-testid="location-select">
		<option value="">Todas las localizaciones</option>
		{#each locations as loc}
			<option value={loc}>{loc}</option>
		{/each}
	</select>

	<!-- Selector de año: igual que location, opciones dinámicas -->
	<select bind:value={filterYear}>
		<option value="">Todos los años</option>
		{#each years as y}
			<option value={y}>{y}</option>
		{/each}
	</select>

	<!-- Inputs numéricos para los filtros restantes -->
	<input type="number" bind:value={filterIntensity} placeholder="Intensity level" />
	<input type="number" bind:value={filterType}      placeholder="Conflict type" />
	<input type="number" bind:value={filterPrecision} placeholder="Start precision" />

	<br /><br />

	<button onclick={searchData}>Buscar</button>
	<button onclick={resetFilters}>Reset</button>
</div>
</fieldset>
<br /><br />

<button onclick={loadData}> Cargar datos iniciales </button>

<!-- ── TABLA DE CONFLICTOS ─────────────────────────────────────────────────── -->
<table style="border-collapse: collapse; width: 53%;">
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
		<!-- Svelte itera sobre el array `data` y renderiza una fila por elemento.
		     La key (item.location + item.year) permite a Svelte identificar
		     cada fila de forma única para actualizaciones eficientes del DOM. -->
		{#each data as item (item.location + item.year)}
			<tr data-testid="filas tabla"
				style="border: 1px solid black;padding: 8px;text-align: center;"
			>
				<td>{item.location}</td>
				<td>{item.year}</td>
				<td>{item.intensity_level}</td>
				<td>{item.conflict_type}</td>
				<td>{item.start_precision}</td>
				<td>
					<!-- Llama a deleteRecurso con los datos de esta fila -->
					<button onclick={() => deleteRecurso(item.location, item.year)}> Borrar fila </button>
					<!-- Navega a la página de edición del recurso concreto -->
					<a href={`/conflict-stats/${item.location}/${item.year}`}> Editar </a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<button onclick={() => abrirInsertar()}> Insertar nuevo conflicto</button>
<button onclick={deleteData}> Borrar datos</button>

<!-- ── MODAL DE INSERCIÓN ─────────────────────────────────────────────────── -->
<!-- Solo se renderiza en el DOM cuando showNew es true -->
{#if showNew}
	<div class="modal">
		<div class="modal-content">
			<h2>Insertar conflicto</h2>

			<!-- bind:value enlaza el input con la variable reactiva correspondiente -->
			<input type="text"   bind:value={newLocation}  placeholder="Location"  required />
			<input type="number" bind:value={newYear}      placeholder="Year"      required />
			<input type="number" bind:value={newIntensity} placeholder="Intensity" required />
			<input type="number" bind:value={newType}      placeholder="Type"      required />
			<input type="number" bind:value={newPrecision} placeholder="Precision" required />

			<br /><br />
			<button onclick={() => (showNew = false)}>Cancelar</button>
			<button onclick={() => insertConflict()}> Insertar </button>
		</div>
	</div>
{/if}

<!-- Muestra el resultado de la última operación realizada -->
<p>Estado de operación: <strong>{mensaje}</strong></p>