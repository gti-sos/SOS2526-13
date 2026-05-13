import { a7 as head, a8 as attr, a9 as escape_html, ab as ensure_array_like } from './index-CE5smqwk.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let datos = [];
    let mensaje = "";
    let searchCountry = "";
    let searchYear = "";
    let searchFrom = "";
    let searchTo = "";
    let searchLimit = "";
    let searchOffset = "";
    let actPais = "";
    let actAño = "";
    let actMilexTotal = "";
    let actMilexPerCapita = "";
    let actMilexGDP = "";
    head("1r8hqty", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Military Stats</title>`);
      });
    });
    $$renderer2.push(`<h1>Military Stats</h1> <button>Cargar datos</button> <button>Borrar todos los datos</button> <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;"><h3>Buscador</h3> <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;"><input placeholder="País (ej: cuba)s"${attr("value", searchCountry)}/> <input type="number" placeholder="Año exacto"${attr("value", searchYear)}/> <input type="number" placeholder="Desde el año..."${attr("value", searchFrom)}/> <input type="number" placeholder="Hasta el año..."${attr("value", searchTo)}/></div> <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;"><input type="number" placeholder="Límite (Paginación)"${attr("value", searchLimit)}/> <input type="number" placeholder="Offset (Salto)"${attr("value", searchOffset)}/></div> <button>Buscar</button> <button>Limpiar filtros</button></div> <div><h3>Añadir nuevo registro</h3> <input placeholder="País"${attr("value", actPais)}/> <input placeholder="Año"${attr("value", actAño)}/> <input placeholder="Milex total"${attr("value", actMilexTotal)}/> <input placeholder="Milex per capita"${attr("value", actMilexPerCapita)}/> <input placeholder="Milex GDP"${attr("value", actMilexGDP)}/> <button>Añadir</button></div> <p>${escape_html(mensaje)}</p> `);
    if (datos.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<table><thead><tr><th>Country</th><th>Year</th><th>Milex total</th><th>Milex per capita</th><th>Milex GDP</th><th>Acciones</th></tr></thead><tbody><!--[-->`);
      const each_array = ensure_array_like(datos);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<tr><td>${escape_html(item.country)}</td><td>${escape_html(item.year)}</td><td>${escape_html(item.milex_total)}</td><td>${escape_html(item.milex_per_capita)}</td><td>${escape_html(item.milex_gdp)}</td><td><a${attr("href", `/military-stats/${item.country}/${item.year}`)}>Editar</a> <button>Borrar</button></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DxYZqGhD.js.map
