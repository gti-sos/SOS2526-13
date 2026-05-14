import { h as head, ab as ensure_array_like, d as escape_html, c as attr } from './index-XUVkxrbo.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = [];
    let mensaje = "";
    let filterLocation = "";
    let filterYear = "";
    let filterIntensity = "";
    let filterType = "";
    let filterPrecision = "";
    let locations = [];
    let years = [];
    head("1n4sz2x", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Conflict Stats</title>`);
      });
    });
    $$renderer2.push(`<h1>Test API Conflict Stats</h1> <fieldset style="display: inline-block;"><legend>Buscador</legend> <div style="margin-bottom: 20px;">`);
    $$renderer2.select({ value: filterLocation, "data-testid": "location-select" }, ($$renderer3) => {
      $$renderer3.option({ value: "" }, ($$renderer4) => {
        $$renderer4.push(`Todas las localizaciones`);
      });
      $$renderer3.push(`<!--[-->`);
      const each_array = ensure_array_like(locations);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let loc = each_array[$$index];
        $$renderer3.option({ value: loc }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(loc)}`);
        });
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(` `);
    $$renderer2.select({ value: filterYear }, ($$renderer3) => {
      $$renderer3.option({ value: "" }, ($$renderer4) => {
        $$renderer4.push(`Todos los años`);
      });
      $$renderer3.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(years);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let y = each_array_1[$$index_1];
        $$renderer3.option({ value: y }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(y)}`);
        });
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(` <input type="number"${attr("value", filterIntensity)} placeholder="Intensity level"/> <input type="number"${attr("value", filterType)} placeholder="Conflict type"/> <input type="number"${attr("value", filterPrecision)} placeholder="Start precision"/> <br/><br/> <button>Buscar</button> <button>Reset</button></div></fieldset> <br/><br/> <button>Cargar datos iniciales</button> <table style="border-collapse: collapse; width: 53%;"><thead><tr style="border: 1px solid black;padding: 8px;text-align: center;"><th>Location</th><th>Year</th><th>Intensity level</th><th>Conflict type</th><th>Start precision</th><th>Actions</th></tr></thead><tbody><!--[-->`);
    const each_array_2 = ensure_array_like(data);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let item = each_array_2[$$index_2];
      $$renderer2.push(`<tr data-testid="filas tabla" style="border: 1px solid black;padding: 8px;text-align: center;"><td>${escape_html(item.location)}</td><td>${escape_html(item.year)}</td><td>${escape_html(item.intensity_level)}</td><td>${escape_html(item.conflict_type)}</td><td>${escape_html(item.start_precision)}</td><td><button>Borrar fila</button> <a${attr("href", `/conflict-stats/${item.location}/${item.year}`)}>Editar</a></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table> <button>Insertar nuevo conflicto</button> <button>Borrar datos</button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <p>Estado de operación: <strong>${escape_html(mensaje)}</strong></p>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CvUfg9pN.js.map
