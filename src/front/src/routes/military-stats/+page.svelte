<script>
  let datos = $state([]);
  let dato = $state({});
  let mensaje = $state("");
  let pais= $state("");
  let año= $state("");

  let API = "api/v1/military-stats"; 
     

  //CARGAR TODOS LOS DATOS
  async function loadMilitaryDataColeccion(){
        const res = await fetch(`${API}/loadInitialData`,
        {
            method: "GET"
        });
        if(res.ok){
            await getMilitaryDataColeccion();
            mensaje = "Datos cargados correctamente";
        }
  }
  //GET TODOS LOS DATOS
  async function getMilitaryDataColeccion(){
    const res = await fetch(`${API}`,
        {
            method: "GET"
        }
    );
    const data = await res.json();
    datos = data;
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

  let esEdicion = $state(false);
  let filaEditada = $state('');

  function abrirEditor(dato){

    esEdicion = true;
    filaEditada = `${dato.country}-${dato.year}`;
    editDato.country = dato.country;
    editDato.year = dato.year;
    editDato.milex_total = dato.milex_total;
    editDato.milex_per_capita = dato.milex_per_capita;
    editDato.milex_gdp = dato.milex_gdp;

    mensaje = "Editando dato: " + dato.country + " - " + dato.year;
  }

  let actPais = $state('');
  let actAño = $state('');
  let actMilexTotal = $state('');
  let actMilexPerCapita = $state('');
  let actMilexGDP = $state('');
  
  async function updateMilitaryData(){
    
    const dato = {
        country:editDato.country.trim(),
        year: parseInt(editDato.year),
        milex_total: parseFloat(editDato.milex_total),
        milex_gdp: parseFloat(editDato.milex_gdp),
        milex_per_capita: parseFloat(editDato.milex_per_capita)
    };
    if(dato.country === '' || isNaN(dato.year) || isNaN(dato.milex_total) || isNaN(dato.milex_per_capita) || isNaN(dato.milex_gdp)){
        mensaje = "Por favor, rellena todos los campos correctamente";
        return;
    }   
    
    const res = await fetch(`${API}/${editDato.country}/${editDato.year}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dato)
        }
    );
    if(res.status == 404){
        mensaje = "Dato no encontrado";
    }else if(res.ok){
        mensaje = "Dato actualizado correctamente";
        await getMilitaryDataColeccion();
        filaEditada = '';
        limipioForm();

    }
  }

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
     mensaje = "Datos borrados correctamente";
  }

</script>
<svelte:head>
    <title>Military Stats</title>
</svelte:head>
<h1>Military Stats</h1>

<button onclick={loadMilitaryDataColeccion}>Cargar datos</button>
<button onclick={getMilitaryDataColeccion}>Ver/Refrescar tabla</button>
<button onclick={deleteMilitaryDataColeccion}>Borrar todos los datos</button>

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
                {#if filaEditada === item.country + '-' + item.year}
                    <td>{item.country}</td>
                    <td>{item.year}</td>
                    <td><input type="number" bind:value={editDato.milex_total} style="width: 70px;"></td>
                    <td><input type="number" bind:value={editDato.milex_per_capita} style="width: 70px;"></td>
                    <td><input type="number" bind:value={editDato.milex_gdp} style="width: 70px;"></td>
                    <td>
                        <button onclick={updateMilitaryData}>Guardar</button>
                        <button onclick={() => filaEditada = ''}>Cancelar</button>
                    </td>
                {:else}
                    <td>{item.country}</td>
                    <td>{item.year}</td>
                    <td>{item.milex_total}</td>
                    <td>{item.milex_per_capita}</td>
                    <td>{item.milex_gdp}</td>
                    <td>
                        <button onclick={() => abrirEditor(item)}>Editar</button>
                        <button onclick={() => deleteMilitaryData(item.country, item.year)}>Borrar</button>
                    </td>
                {/if}
            </tr>
        {/each}
    </tbody>
</table>
{:else}
    <p>Haz clic en "Ver Tabla" para mostrar los resultados.</p>
{/if}

