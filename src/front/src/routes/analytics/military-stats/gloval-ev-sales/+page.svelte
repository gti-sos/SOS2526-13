<script>
    import { onMount } from "svelte";

    onMount(async () => {
        // 1. Cambia la URL por tu endpoint de EV Sales
        const response = await fetch( "https://sos2526-16.onrender.com/api/v1/global-ev-sales");
        const data = await response.json();

        // 2. Extraer años y regiones únicas
        const years = [...new Set(data.map(d => d.year))].sort((a, b) => a - b);
        const regions = [...new Set(data.map(d => d.region))];

        // 3. Crear las series para Highcharts
        const series = regions.map(region => ({
            name: region,
            data: years.map(year => {
                // Buscamos el registro para esa región y año
                const record = data.find(d => d.region === region && d.year === year);
                
                return {
                    y: record ? record.value : 0, // El valor de la métrica (ej: EV stock share)
                    // Metadatos adicionales para el tooltip
                    powertrain: record ? record.powertrain : 'N/A',
                    impact: record ? record.economic_impact : 0,
                    unit: record ? record.unit : ''
                };
            })
        }));

        // 4. Configuración del gráfico
        Highcharts.chart("container-ev", {
            chart: { type: "area" },
            title: { text: "Cuota de mercado de Vehículos Eléctricos por Región" },
            xAxis: { categories: years },
            yAxis: {
                title: { text: "Valor (%)" },
                labels: { format: "{value}" }
            },
            plotOptions: {
                area: {
                    stacking: "normal", // O "percent" si quieres ver distribución relativa
                    marker: { enabled: false }
                }
            },
            tooltip: {
                formatter: function () {
                    return `<b>${this.series.name}</b><br/>
                            Año: ${this.x}<br/>
                            Valor: ${this.y.toFixed(5)} ${this.point.unit}<br/>
                            Propulsión: ${this.point.powertrain}<br/>
                            Impacto Económico: ${this.point.impact}`;
                }
            },
            series
        });
    });
</script>

<div id="container-ev"></div>