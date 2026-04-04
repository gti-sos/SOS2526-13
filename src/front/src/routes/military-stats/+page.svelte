<script>

  import {onMount} from 'svelte';
  import {dev} from '$app/environment';


  let datos = $state([]);
  let dato = $state({});
  let mensaje = $state("");
  let pais= $state("");
  let año= $state("");

  
//variables para buscar

 let searchCountry = $state("");
 let searchYear = $state("");
 let searchFrom = $state("");
 let searchTo = $state("");
 let searchLimit = $state("");
 let searchOffset = $state("");

 function limpiarBusqueda() {
      searchCountry = "";
      searchYear = "";
      searchFrom = "";
      searchTo = "";
      searchLimit = "";
      searchOffset = "";
      getMilitaryDataColeccion(); 
  }



  let API = "api/v2/military-stats"; 
  
  if (dev) {
		API = 'http://localhost:3000' + API;
	}
    onMount(() => {
      getMilitaryDataColeccion(); 
  });

  
  //CARGAR TODOS LOS DATOS
  async function loadMilitaryDataColeccion(){
        const res = await fetch(`${API}/loadInitialData`,
        {
            method: "GET"
        });
        if(res.ok){
            mensaje = "Datos cargados correctamente";
        }
        await getMilitaryDataColeccion();

  }
  //GET TODOS LOS DATOS
  // GET CON FILTROS Y BUSCADOR
  async function getMilitaryDataColeccion() {
    // 1. Creamos un objeto para construir la URL con parámetros
    const queryParams = new URLSearchParams();

    // 2. Añadimos solo los filtros que tengan contenido
    if (searchCountry) queryParams.append("country", searchCountry);
    if (searchYear) queryParams.append("year", searchYear);
    
    // Si tu API soporta rangos (from/to), añádelos:
    if (searchFrom) queryParams.append("from", searchFrom);
    if (searchTo) queryParams.append("to", searchTo);

    // Paginación
    if (searchLimit) queryParams.append("limit", searchLimit);
    if (searchOffset) queryParams.append("offset", searchOffset);

    // 3. Construimos la URL final: ej. "api/v2/military-stats?country=cuba&year=2015"
    const finalURL = queryParams.toString() 
        ? `${API}?${queryParams.toString()}` 
        : API;

    
    const res = await fetch(finalURL, { method: "GET" });
        
        if (res.ok) {
            const data = await res.json();
            datos = data;
            mensaje = datos.length > 0 ? "" : "No se han encontrado resultados.";
        } else {
            mensaje = "Error al buscar: " + res.status;
        }
  }

  //ACTUALIZAR UN DATO EN CONCRETO

  let editDato = $state({
    country: '',
    year: '',
    milex_total: '',
    milex_per_capita: '',
    milex_gdp: ''
  });
 

  function limipioForm(){
    actPais = '';
    actAño = '';
    actMilexTotal = '';
    actMilexPerCapita = '';
    actMilexGDP = '';
  }

  let filaEditada = $state('');

  

  let actPais = $state('');
  let actAño = $state('');
  let actMilexTotal = $state('');
  let actMilexPerCapita = $state('');
  let actMilexGDP = $state('');
  
  

  //AÑADIR UN NUEVO DATO
  async function addMilitaryData(){

    if(actPais === '' || actAño === '' || actMilexTotal === '' || actMilexPerCapita === '' || actMilexGDP === ''){
        mensaje = "Por favor, rellena todos los campos";
        return;
    }
    const newDato = {
        country: actPais.trim(),
        year: parseInt(actAño),
        milex_total: parseFloat(actMilexTotal),
        milex_gdp: parseFloat(actMilexGDP),
        milex_per_capita: parseFloat(actMilexPerCapita)
    };
    const res = await fetch(`${API}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newDato)
        }
    );
    if(res.status == 201){
        mensaje = "Dato añadido correctamente";
        limipioForm();
        await getMilitaryDataColeccion();

    }else if(res.status == 409){
        mensaje = "Recurso ya existente";
    }else if(res.status == 404){
        mensaje = "Dato no encontrado";
  } else{
        mensaje = "Error al añadir el dato" + res.status;
    }
  }

  //BORRAR UN DATO EN CONCRETO
  async function deleteMilitaryData(pais, año){
    const res = await fetch(`${API}/${pais}/${año}`,
        {
            method: "DELETE"
        }

    );
    if(res.status == 404){
        mensaje = "Dato no encontrado";
    }else if(res.ok){
        mensaje = "Dato borrado correctamente";
        await getMilitaryDataColeccion();
    }else{
        mensaje = "Error al borrar el dato" + res.status;
    }
  }

  //DELETE TODOS LOS DATOS
  async function deleteMilitaryDataColeccion(){
    const res = await fetch(`${API}`,
        {
            method: "DELETE"
        }
    );
    if (res.ok){
         mensaje = "Datos borrados correctamente";
        datos = [];
    }else{
        mensaje = "Error al borrar los datos";
    }
  }

</script>
<svelte:head>
    <title>Military Stats</title>
</svelte:head>
<h1>Military Stats</h1>

<button onclick={loadMilitaryDataColeccion}>Cargar datos</button>
<button onclick={deleteMilitaryDataColeccion}>Borrar todos los datos</button>

<div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
    <h3>Buscador</h3>
    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;">
        <input placeholder="País (ej: cuba)s" bind:value={searchCountry}>
        <input type="number" placeholder="Año exacto" bind:value={searchYear}>
        <input type="number" placeholder="Desde el año..." bind:value={searchFrom}>
        <input type="number" placeholder="Hasta el año..." bind:value={searchTo}>
    </div>
    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;">
        <input type="number" placeholder="Límite (Paginación)" bind:value={searchLimit}>
        <input type="number" placeholder="Offset (Salto)" bind:value={searchOffset}>
    </div>
    <button onclick={getMilitaryDataColeccion}>Buscar</button>
    <button onclick={limpiarBusqueda}>Limpiar filtros</button>
</div>
<div>
    <h3>Añadir nuevo registro</h3>
    <input placeholder="País" bind:value={actPais}>
    <input placeholder="Año" bind:value={actAño}>
    <input placeholder="Milex total" bind:value={actMilexTotal}>
    <input placeholder="Milex per capita" bind:value={actMilexPerCapita}>
    <input placeholder="Milex GDP" bind:value={actMilexGDP}>
    <button onclick={() => addMilitaryData()}>Añadir</button>

</div>

<p>{mensaje}</p>

{#if datos.length > 0}
   <table>
    <thead>
        <tr>
            <th>Country</th>
            <th>Year</th>
            <th>Milex total</th>
            <th>Milex per capita</th>
            <th>Milex GDP</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        {#each datos as item (item.country + '-' + item.year)}
            <tr>
                    <td>{item.country}</td>
                    <td>{item.year}</td>
                    <td>{item.milex_total}</td>
                    <td>{item.milex_per_capita}</td>
                    <td>{item.milex_gdp}</td>
                    <td>
                        <a href={`/military-stats/${item.country}/${item.year}`}>Editar</a>
                        <button onclick={() => deleteMilitaryData(item.country, item.year)}>Borrar</button>
                    </td>
            </tr>
        {/each}
    </tbody>
</table>
{:else}
{/if}

