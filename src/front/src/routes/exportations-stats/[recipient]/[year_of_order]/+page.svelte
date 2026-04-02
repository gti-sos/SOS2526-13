<script>
import { page } from '$app/state';
import { onMount } from 'svelte';

let API = '/api/v2/exportations-stats/';

let recipient = page.params.recipient;
let year = page.params.year_of_order;

// Campos editables
let supplier_editar = $state('');
let tiv_editar = $state('');

let mensaje = $state('');
let tipoMensaje = $state('info');
let originalSupplier;
let originalTiv;

function mostrarMensaje(texto, tipo) {
    mensaje = texto;
    tipoMensaje = tipo;
}

// GET individual
async function obtenerDato() {
    const res = await fetch(API + `${recipient}/${year}`);

    if (res.status === 200) {
        const data = await res.json();
        supplier_editar = data.supplier;
        tiv_editar = data.tiv_total_order;

        //valores originales
        originalSupplier = data.supplier;
        originalTiv = data.tiv_total_order;
    } else {
        mostrarMensaje("No se encontró el registro.", "error");
    }
}

// PUT
async function actualizarElemento(e) {
    e.preventDefault();
    if(supplier_editar === originalSupplier && Number(tiv_editar) === Number(originalTiv)){
        mostrarMensaje("No se ha modificado ningún dato.", "error");
        return;
      }
      
    const res = await fetch(API + `${recipient}/${year}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            recipient: recipient,
            supplier: supplier_editar,
            year_of_order: Number(year),
            tiv_total_order: Number(tiv_editar)
        })
    });

    if (res.status === 200) {
			mostrarMensaje("Elemento actualizado correctamente");
		} else if (res.status === 400) {
			mostrarMensaje("Datos incorrectos", "error");
		} else if (res.status === 404) {
			mostrarMensaje("Elemento no encontrado", "error");
		} else {
			mostrarMensaje(`Error inesperado ${res.status}`, "error");
		}
}

// cargar dato al abrir la página
onMount(() => {
    obtenerDato();
});
</script>


<div style="max-width:600px;margin:40px auto;padding:20px;background:#f9f9f9;border:1px solid #ddd;border-radius:5px;">

<h2>Editando registro:</h2>

{#if mensaje}
  <div style="padding:10px;margin-bottom:15px;color:white;border-radius:5px;
    background-color:{tipoMensaje === 'error' ? '#ff4444' : '#00C851'}"> {mensaje}
  </div>
{/if}

  <form onsubmit={actualizarElemento} style="display:flex;flex-direction:column;gap:15px">
    <div style="display:flex;gap:10px">
      <input type="text" value={recipient} readonly>
      <input type="text" value={year} readonly>
    </div>
    
    <input placeholder="Proveedor" bind:value={supplier_editar} required style="padding:8px;border:1px solid #ccc;border-radius:4px"/>
    <input type="number" step="any" placeholder="Valor" bind:value={tiv_editar} required style="padding:8px;border:1px solid #ccc;border-radius:4px" />
    <button type="submit"> Actualizar </button>

    <a href="/exportations-stats"> ← Volver </a>
  </form>
</div>