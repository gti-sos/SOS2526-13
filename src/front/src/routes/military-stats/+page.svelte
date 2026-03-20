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
  //BORRAR UN DATO EN CONCRETO
  async function deleteMilitaryData(dato){
    const res = await fetch("http://localhost:3000/api/v1/military-stats/"+{pais}+"/"+{año},
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