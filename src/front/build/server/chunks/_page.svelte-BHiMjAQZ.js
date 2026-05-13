import { a9 as escape_html, a8 as attr } from './index-CE5smqwk.js';
import { p as page } from './index2-CjviEB4g.js';
import './exports-DhLLft2t.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let location = page.params.location;
    let year = page.params.year;
    let intensity = "";
    let type = "";
    let precision = "";
    let mensaje = "";
    $$renderer2.push(`<form><h2>Editar conflicto</h2> <p><b>${escape_html(location)}</b> - ${escape_html(year)}</p> <input type="number"${attr("value", intensity)} placeholder="Intensity" required=""/> <input type="number"${attr("value", type)} placeholder="Type" required=""/> <input type="number"${attr("value", precision)} placeholder="Precision" required=""/> <br/><br/> <a href="/conflict-stats">Volver</a> <button>Guardar</button></form> <p>Estado de operación: <strong>${escape_html(mensaje)}</strong></p>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BHiMjAQZ.js.map
