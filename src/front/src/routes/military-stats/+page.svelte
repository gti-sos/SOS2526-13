<script>
  let datos = $state([]);
  let dato = $state({});
  let mensaje = $state("");
  let pais= $state("");
  let año= $state("");

     

  //CARGAR TODOS LOS DATOS
  async function loadMilitaryDataColeccion(){
        const res = await fetch("http://localhost:3000/api/v1/military-stats/loadInitialData",
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
    const res = await fetch("http://localhost:3000/api/v1/military-stats",
        {
            method: "GET"
        }
    );
    const data = await res.json();
    datos = data;
  }

  //ACTUALIZAR UN DATO EN CONCRETO

  let actPais = $state('');
  let actAño = $state('');
  let actMilexTotal = $state('');
  let actMilexPerCapita = $state('');
  let actMilexGDP = $state('');



  async function updateMilitaryData(dato){
    const res = await fetch(`http://localhost:3000/api/v1/military-stats/${pais}/${año}`,
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
    }else{
        mensaje = "Dato actualizado correctamente";
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
    const res = await fetch("http://localhost:3000/api/v1/military-stats",
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
        actPais = '';
        actAño = '';    
        actMilexTotal = '';
        actMilexPerCapita = '';
        actMilexGDP = '';
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
    const res = await fetch(`http://localhost:3000/api/v1/military-stats/${pais}/${año}`,
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
    const res = await fetch("http://localhost:3000/api/v1/military-stats",
        {
            method: "DELETE"
        }
    );
     mensaje = "Datos borrados correctamente";
  }

</script>

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
            </tr>
        </thead>
        <tbody>
            {#each datos as item}
                <tr>
                    <td>{item.country}</td>
                    <td>{item.year}</td>
                    <td>{item.milex_total}</td>
                    <td>{item.milex_per_capita}</td>
                    <td>{item.milex_gdp}</td>
                    <td>
                        <button onclick={() => abrirEditor(item)}>Editar</button>
                    </td>
                    <td>
                        <button onclick={() => deleteMilitaryData(item.country, item.year)}>Borrar</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{:else}
    <p>Haz clic en "Ver Tabla" para mostrar los resultados.</p>
{/if}

