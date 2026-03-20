<script>
  let datos = $state([]);
  let mensaje = $state("");



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