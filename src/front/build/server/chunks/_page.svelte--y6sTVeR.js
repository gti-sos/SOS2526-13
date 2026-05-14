import { d as escape_html, c as attr } from './index-XUVkxrbo.js';
import { p as page } from './index2-DvRhx10k.js';
import './exports-DQBej4hX.js';

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
//# sourceMappingURL=_page.svelte--y6sTVeR.js.map
