<script>
	//@ts-ignore
	let data = $state([]);
	let mensaje = $state("");

	import { dev } from "$app/environment";
	import { onMount } from "svelte";

	let API = "/api/v2/exportations-stats";

	if (dev) {
		API = "http://localhost:3000" + API;
	}

	// =====================
	// CARGA DATOS
	// =====================
	async function getData() {
		const res = await fetch(API);
		data = await res.json();
	}

	onMount(() => {
		getData();
	});

	// =====================
	// CARGA INICIAL
	// =====================
	async function loadData() {
		const response = await fetch(`${API}/loadInitialData`);

		if (response.status === 201) {
			mensaje = "Los datos se han cargado correctamente";
		} else if (response.status === 409) {
			mensaje = "Los datos ya estaban cargados";
		} else {
			mensaje = `Error inesperado ${response.status}`;
		}

		await getData();
	}


	// =====================
	// CREATE
	// =====================
	let newRecipient = $state("");
	let newSupplier = $state("");
	let newYear = $state("");
	let newTiv = $state("");
	let showNew = $state(false);

	function abrirInsertar() {
		showNew = true;

		newRecipient = "";
		newSupplier = "";
		newYear = "";
		newTiv = "";
	}

	async function insertData() {
		if (!newRecipient || !newSupplier || !newYear || !newTiv) {
			mensaje = "Faltan campos obligatorios";
			return;
		}

		const response = await fetch(API, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				recipient: newRecipient,
				supplier: newSupplier,
				year_of_order: parseInt(newYear),
				tiv_total_order: parseFloat(newTiv)
			})
		});

		if (response.status === 201) {
			mensaje = "Elemento insertado correctamente";
			await getData();
			showNew = false;
		} else if (response.status === 409) {
			mensaje = "Elemento ya existe";
		} else if (response.status === 400) {
			mensaje = "Formato incorrecto";
		} else {
			mensaje = `Error inesperado ${response.status}`;
		}
	}

	// =====================
	// BUSCAR
	// =====================
	let searchRecipient = $state("");
	let searchSupplier = $state("");
	let searchYear = $state("");
	let searchTiv = $state("");
	let showSearch= $state(false);


	async function buscar(){

		let url = API + "?";

		if(searchRecipient) url += `recipient=${searchRecipient}&`;
		if(searchSupplier) url += `supplier=${searchSupplier}&`;
		if(searchYear) url += `year_of_order=${searchYear}&`;

		const res = await fetch(url);
		data = await res.json();
	}
	function abrirBuscar() {
		showSearch = true;

		searchRecipient = "";
		searchSupplier = "";
		searchYear = "";
		searchTiv = "";
	}

	// =====================
	// DELETE UNO
	// =====================
	async function deleteRecurso(recipient, year) {
		const res = await fetch(`${API}/${recipient}/${year}`, {
			method: "DELETE"
		});

		if (res.status === 404) {
			mensaje = "No existe ese dato";
		} else {
			mensaje = "Eliminado correctamente";
			await getData();
		}
	}

	// DELETE TODOS
	async function deleteData() {
		await fetch(API, { method: "DELETE" });
		mensaje = "Todos los datos eliminados";
		await getData();
	}
</script>

<p><strong>{mensaje}</strong></p>

<!-- BOTONES GENERALES -->
<button onclick={loadData}>Cargar datos iniciales</button>
<button onclick={deleteData}>Eliminar todos</button>
<button onclick={abrirInsertar}>Añadir nuevo</button>
<button onclick={abrirBuscar}>Buscar</button>

<hr />

<!-- FORMULARIO CREAR -->
{#if showNew}
	<h2>Nuevo recurso</h2>
	<input placeholder="País destinatario" bind:value={newRecipient} />
	<input placeholder="Proveedor" bind:value={newSupplier} />
	<input placeholder="Año" bind:value={newYear} />
	<input placeholder="Valor TIV" bind:value={newTiv} />

	<br /><br />

	<button onclick={insertData}>Guardar</button>
	<button onclick={() => (showNew = false)}>Cancelar</button>
	<hr />
{/if}

<!-- FORMULARIO BUSCAR -->
{#if showSearch}
	<h2>Buscar</h2>
	<input placeholder="País destinatario" bind:value={searchRecipient} />
	<input placeholder="Proveedor" bind:value={searchSupplier} />
	<input placeholder="Año" bind:value={searchYear} />
	<input placeholder="Valor TIV" bind:value={searchTiv} />
	<br /><br />
	<button onclick={buscar}>Buscar</button>
	<button onclick={getData}>Reset</button>
	<button onclick={() => (showSearch = false)}>Cancelar</button>
{/if}

<!-- LISTA DE DATOS -->
<h2>Lista</h2>

<table border="1" cellpadding="5">
	<thead>
		<tr>
			<th>País Destinatario</th>
			<th>Proveedor</th>
			<th>Año</th>
			<th>Valor TIV</th>
			<th>Acciones</th>
		</tr>
	</thead>

	<tbody>
		{#each data as d}
			<tr>
				<td>{d.recipient}</td>
				<td>{d.supplier}</td>
				<td>{d.year_of_order}</td>
				<td>{d.tiv_total_order}</td>

				<td>
  					<a href={`/exportations-stats/${d.recipient}/${d.year_of_order}`}>
  						<button>Editar</button>
					</a>
  					<button onclick={() => deleteRecurso(d.recipient, d.year_of_order)}>Eliminar</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>