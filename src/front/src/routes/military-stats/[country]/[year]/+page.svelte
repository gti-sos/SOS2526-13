<script>
    import { onMount } from "svelte";
    import { page } from '$app/state';
	import{dev} from "$app/environment";


    let API = '/api/v2/military-stats';
    if(dev){
		API = "http://localhost:3000"+API;
	}

    let country = page.params.country;
    let year = page.params.year;
    let milex_total = $state('');
    let milex_gdp = $state('');
    let milex_per_capita = $state('');

    let mensaje = $state('');

    //EDITAR DATO

    async function editarFila(){
        if(country===null || year ===null || milex_total === null || milex_per_capita === null || milex_gdp === null){
            mensaje = 'Faltan campos obligatorios';
            return;
        }

        const res = await fetch(`${API}/${country}/${year}`,
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({
                    country,
                    year : Number(year),
                    milex_total : Number(milex_total),
                    milex_gdp: Number(milex_gdp),
                    milex_per_capita: Number(milex_per_capita)
                })
            });

          if (res.status === 200) {
			    mensaje = 'Elemento actualizado';
		    } else if (res.status === 400) {
			    mensaje = 'Datos incorrectos';
	    	} else if (res.status === 404) {
			    mensaje = 'No encontrado';
		    } else {
			    mensaje = `Error ${res.status}`;
		    }  
    }

    onMount(async() =>{
        const res = await fetch(`${API}/${country}/${year}`);
        if (res.status === 200){
            const data = await res.json();

            milex_total= data.milex_total;
            milex_gdp = data.milex_gdp;
            milex_per_capita = data.milex_per_capita;
        }
    });

</script>


<form >
    <h2>Editar dato</h2>
   	<p><b>{country}</b> - {year}</p>

    <input type="number" bind:value={milex_total} placeholder="Milex total" required>
    <input type="number" bind:value={milex_gdp} placeholder="Milex gdp" required>
    <input type="number" bind:value={milex_per_capita} placeholder="Milex per capita" required>

    <a href='/military-stats' data-sveltekit-reload>Volver</a>
    <button onclick={()=> editarFila()}> Guardar</button>


</form>

<h3>{mensaje}</h3>