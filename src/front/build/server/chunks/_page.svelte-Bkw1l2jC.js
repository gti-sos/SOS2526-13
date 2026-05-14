import { c as attr } from './index-XUVkxrbo.js';
import { p as page } from './index2-DvRhx10k.js';
import './exports-DQBej4hX.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let recipient = page.params.recipient;
    let year = page.params.year_of_order;
    let supplier_editar = "";
    let tiv_editar = "";
    $$renderer2.push(`<div style="max-width:600px;margin:40px auto;padding:20px;background:#f9f9f9;border:1px solid #ddd;border-radius:5px;"><h2>Editando registro:</h2> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form style="display:flex;flex-direction:column;gap:15px"><div style="display:flex;gap:10px"><input type="text"${attr("value", recipient)} readonly=""/> <input type="text"${attr("value", year)} readonly=""/></div> <input placeholder="Proveedor"${attr("value", supplier_editar)} required="" style="padding:8px;border:1px solid #ccc;border-radius:4px"/> <input type="number" step="any" placeholder="Valor"${attr("value", tiv_editar)} required="" style="padding:8px;border:1px solid #ccc;border-radius:4px"/> <button type="submit">Actualizar</button> <a href="/exportations-stats">← Volver</a></form></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Bkw1l2jC.js.map
