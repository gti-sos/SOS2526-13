<script>
	//@ts-ignore
	let dato = $state([]);
	let mensaje = $state("");

	let recipient = $state("");
	let supplier = $state("");
	let year = $state("");
	let tiv = $state("");

	import { dev } from "$app/environment";

	let API = "/api/v2/exportations-stats";

	if (dev) {
		API = "http://localhost:3000" + API; // <--- CORRECCIÓN HTTP
	}

	// Cargar datos iniciales
	async function loadInitial() {
		await fetch(`${API}/loadInitialData`);
		mensaje = "Datos cargados";
		cargar();
	}

	// GET
	async function cargar() {
		const res = await fetch(API);
		dato = await res.json();
	}

	// CREATE
	async function crear() {
		const res = await fetch(API, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				recipient,
				supplier,
				year_of_order: parseInt(year),
				tiv_total_order: parseFloat(tiv)
			})
		});

		if (res.ok) {
			mensaje = "Creado correctamente";
			cargar();
		} else if (res.status === 409) {
			mensaje = "El recurso ya existe";
		} else {
			mensaje = "Error al crear";
		}
	}

	// DELETE uno
	async function borrar(d) {
		const res = await fetch(`${API}/${d.recipient}/${d.year_of_order}`, {
			method: "DELETE"
		});

		if (res.status === 404) {
			mensaje = "No existe ese dato";
		} else {
			mensaje = "Eliminado correctamente";
			cargar();
		}
	}

	// DELETE todos
	async function borrarTodo() {
		await fetch(API, { method: "DELETE" });
		mensaje = "Todos eliminados";
		cargar();
	}

	cargar();
</script>

<h1>Exportaciones</h1>
<p>{mensaje}</p>

<button on:click={loadInitial}>Cargar datos iniciales</button>

<h2>Crear</h2>

<input bind:value={recipient} placeholder="País" />
<input bind:value={supplier} placeholder="Proveedor" />
<input bind:value={year} placeholder="Año" />
<input bind:value={tiv} placeholder="Valor" />

<button on:click={crear}>Crear</button>
<button on:click={borrarTodo}>Eliminar todos</button>

<h2>Lista</h2>

<ul>
	{#each dato as d}
		<li>
			{d.recipient} - {d.year_of_order}

			<button on:click={() => borrar(d)}>Eliminar</button>

			<a href={`/exportations-stats/edit/${d.recipient}/${d.year_of_order}`}>
				<button>Editar</button>
			</a>
		</li>
	{/each}
</ul>