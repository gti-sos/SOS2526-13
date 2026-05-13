<script>
import { onMount } from "svelte";
import { browser } from "$app/environment";

function loadScript(src) {
    return new Promise(resolve => {
        if (document.querySelector(`script[src="${src}"]`)) {
            return resolve();
        }
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        document.head.appendChild(s);
    });
}

onMount(async () => {

    if (!browser) return;

    await loadScript("https://code.highcharts.com/highcharts.js");
    await loadScript("https://code.highcharts.com/highcharts-more.js");

    const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken"
    );

    const json = await res.json();

    const meals = json.meals || [];

    const ingredientCount = {};

    meals.forEach(meal => {

        for (let i = 1; i <= 20; i++) {

            const ingredient = meal[`strIngredient${i}`];

            if (!ingredient) continue;

            const name = ingredient.trim().toLowerCase();

            if (name === "chicken" || name === "") continue;

            ingredientCount[name] = (ingredientCount[name] || 0) + 1;
        }
    });

    const chartData = Object.entries(ingredientCount)
        .map(([name, value]) => ({
            name,
            x: value,
            y: value,
            z: value
        }))
        .sort((a, b) => b.z - a.z)
        .slice(0, 20);

    Highcharts.chart("meal-bubble", {

        chart: {
            type: "bubble",
            backgroundColor: "#ffffff"
        },

        title: {
            text: "Visualización Ingredientes (Pollo)"
        },

        subtitle: {
            text: "Frecuencia de ingredientes en recetas con pollo"
        },

        tooltip: {
            pointFormat: "<b>{point.name}</b><br>Veces: {point.z}"
        },

        series: [{
            name: "Ingredientes",
            data: chartData
        }],

        credits: {
            enabled: false
        }
    });
});
</script>

<div id="meal-bubble" style="height: 700px;"></div>