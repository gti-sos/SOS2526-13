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
       mensaje = "Datos cargados correctamente";

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

  //BORRAR UN DATO EN CONCRETO
  async function deleteMilitaryData(pais, año){
    const res = await fetch(`http://localhost:3000/api/v1/military-stats/${pais}/${año}`,
        {
            method: "DELETE"
        }

    );
    if(res.status == 404){
        mensaje = "Dato no encontrado";
    }else{
        mensaje = "Dato borrado correctamente";
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

<button on:click={loadMilitaryDataColeccion}>Cargar datos</button>
<button on:click={getMilitaryDataColeccion}>Mostrar datos</button>

