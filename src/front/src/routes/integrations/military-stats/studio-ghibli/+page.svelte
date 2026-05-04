<script>
    import { onMount } from "svelte";
    import Highcharts from "highcharts";

    let dataGhibli = [];

    onMount(async () => {
        try {
            // 1. Obtener los datos de la API
            const response = await fetch("https://ghibliapi.vercel.app/films");
            if (!response.ok) throw new Error("No se pudo acceder a la API");
            dataGhibli = await response.json();

            // 2. Procesar los datos para el gráfico de dispersión
            // Queremos puntos con: x = año de estreno, y = puntuación
            const seriesData = dataGhibli.map(film => ({
                x: parseInt(film.release_date),
                y: parseInt(film.rt_score),
                name: film.title,        // Para mostrar en el tooltip
                originalTitle: film.original_title,
                description: film.description.substring(0, 100) + "..."
            }));

            // 3. Configurar el gráfico de Highcharts
            Highcharts.chart("ghibli-container", {
                chart: {
                    type: 'scatter',
                    zoomType: 'xy'
                },
                title: {
                    text: 'Películas de Studio Ghibli: Calidad vs. Tiempo'
                },
                subtitle: {
                    text: 'Fuente: ghibliapi.vercel.app'
                },
                xAxis: {
                    title: { text: 'Año de Lanzamiento' },
                    gridLineWidth: 1
                },
                yAxis: {
                    title: { text: 'Puntuación (Rotten Tomatoes)' },
                    min: 0,
                    max: 105
                },
                legend: { enabled: false },
                tooltip: {
                    useHTML: true,
                    formatter: function() {
                        return `
                            <div style="width: 200px; white-space: normal;">
                                <b>${this.point.name}</b> (${this.x})<br/>
                                <i>${this.point.originalTitle}</i><br/>
                                <b>Puntuación:</b> ${this.y}%<br/><br/>
                                <small>${this.point.description}</small>
                            </div>
                        `;
                    }
                },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 7,
                            states: {
                                hover: { enabled: true, lineColor: 'rgb(100,100,100)' }
                            }
                        }
                    }
                },
                series: [{
                    name: 'Películas',
                    color: 'rgba(33, 150, 243, 0.5)',
                    data: seriesData
                }]
            });
        } catch (error) {
            console.error("Error cargando Ghibli:", error);
        }
    });
</script>

<main>
    <div id="ghibli-container"></div>
</main>

<style>
    #ghibli-container {
        width: 100%;
        height: 550px;
        margin: 20px auto;
        border: 1px solid #ddd;
        border-radius: 8px;
    }
</style>