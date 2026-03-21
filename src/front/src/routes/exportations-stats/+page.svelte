<script>
	//@ts-ignore
	let data = $state([]);
	let mensaje = $state("");

	import { dev } from "$app/environment";
	import { onMount } from "svelte";

	let API = "/api/v1/exportations-stats";

	if (dev) {
		API = "http://localhost:3000" + API;
	}

	// GET

	async function getData() {
		const res = await fetch(API);
		data = await res.json();
	}

	onMount(() => {
		getData();
	});

	// LOAD INITIAL DATA
	// 
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


	// CREATE
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
	// EDITAR
	// =====================
	let editRecipient = $state("");
	let editSupplier = $state("");
	let editYear = $state("");
	let editTiv = $state("");

	let showEditar = $state(false);

	function abrirEditor(item) {
		showEditar = true;

		editRecipient = item.recipient;
		editSupplier = item.supplier;
		editYear = item.year_of_order;
		editTiv = item.tiv_total_order;
	}

	async function editarFila() {
		if (!editRecipient || !editSupplier || !editYear || !editTiv) {
			mensaje = "Faltan campos obligatorios";
			return;
		}

		const res = await fetch(
			`${API}/${editRecipient}/${editYear}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					recipient: editRecipient,
					supplier: editSupplier,
					year_of_order: parseInt(editYear),
					tiv_total_order: parseFloat(editTiv)
				})
			}
		);

		if (res.status === 200) {
			mensaje = "Elemento actualizado correctamente";
			await getData();
			showEditar = false;
		} else if (res.status === 400) {
			mensaje = "Datos incorrectos";
		} else if (res.status === 404) {
			mensaje = "Elemento no encontrado";
		} else {
			mensaje = `Error inesperado ${res.status}`;
		}
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

<hr />

<!-- FORMULARIO CREAR -->
{#if showNew}
	<h2>Nuevo recurso</h2>

	<input placeholder="País" bind:value={newRecipient} />
	<input placeholder="Proveedor" bind:value={newSupplier} />
	<input placeholder="Año" bind:value={newYear} />
	<input placeholder="Valor" bind:value={newTiv} />

	<br /><br />

	<button onclick={insertData}>Guardar</button>
	<button onclick={() => (showNew = false)}>Cancelar</button>

	<hr />
{/if}

<!-- FORMULARIO EDITAR -->
{#if showEditar}
	<h2>Editar recurso</h2>
	
	<p><b>{editRecipient}</b> - {editYear}</p>

	<input placeholder="Proveedor" bind:value={editSupplier} />
	<input placeholder="Valor" bind:value={editTiv} />

	<br /><br />

	<button onclick={editarFila}>Actualizar</button>
	<button onclick={() => (showEditar = false)}>Cancelar</button>

	<hr />
{/if}

<!-- LISTA DE DATOS -->
<h2>Lista</h2>

<table border="1" cellpadding="5">
	<thead>
		<tr>
			<th>País</th>
			<th>Proveedor</th>
			<th>Año</th>
			<th>Valor</th>
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
					<button onclick={() => abrirEditor(d)}>Editar</button>
					<button onclick={() => deleteRecurso(d.recipient, d.year_of_order)}>Eliminar</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>