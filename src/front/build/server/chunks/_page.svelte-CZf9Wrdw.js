import { d as escape_html, c as attr } from './index-XUVkxrbo.js';
import { p as page } from './index2-DvRhx10k.js';
import './exports-DQBej4hX.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let country = page.params.country;
    let year = page.params.year;
    let milex_total = "";
    let milex_gdp = "";
    let milex_per_capita = "";
    let mensaje = "";
    $$renderer2.push(`<form><h2>Editar dato</h2> <p><b>${escape_html(country)}</b> - ${escape_html(year)}</p> <input type="number"${attr("value", milex_total)} placeholder="Milex total" required=""/> <input type="number"${attr("value", milex_gdp)} placeholder="Milex gdp" required=""/> <input type="number"${attr("value", milex_per_capita)} placeholder="Milex per capita" required=""/> <a href="/military-stats" data-sveltekit-reload="">Volver</a> <button>Guardar</button></form> <h3>${escape_html(mensaje)}</h3>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CZf9Wrdw.js.map
