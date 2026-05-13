import { a9 as escape_html, ab as ensure_array_like, a8 as attr } from './index-CE5smqwk.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = [];
    let mensaje = "";
    $$renderer2.push(`<p><strong>${escape_html(mensaje)}</strong></p> <button data-testid="cargar-datos">Cargar datos iniciales</button> <button data-testid="borrar-datos">Eliminar todos</button> <button>Añadir nuevo</button> <button>Buscar</button> <hr/> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <h2>Lista</h2> <table border="1" cellpadding="5"><thead><tr><th>País Destinatario</th><th>Proveedor</th><th>Año</th><th>Valor TIV</th><th>Acciones</th></tr></thead><tbody><!--[-->`);
    const each_array = ensure_array_like(data);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let d = each_array[$$index];
      $$renderer2.push(`<tr data-testid="fila-tabla"><td>${escape_html(d.recipient)}</td><td>${escape_html(d.supplier)}</td><td>${escape_html(d.year_of_order)}</td><td>${escape_html(d.tiv_total_order)}</td><td><a${attr("href", `/exportations-stats/${d.recipient}/${d.year_of_order}`)}><button>Editar</button></a> <button>Eliminar</button></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B9qqHP9e.js.map
