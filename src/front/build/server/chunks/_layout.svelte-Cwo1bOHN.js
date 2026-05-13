import { a7 as head, a8 as attr } from './index-CE5smqwk.js';
import { f as favicon } from './favicon-BqBRrRrO.js';

function Header($$renderer) {
  $$renderer.push(`<h1>Exportaciones</h1>`);
}
function _layout($$renderer, $$props) {
  let { children } = $$props;
  head("dk0wi0", $$renderer, ($$renderer2) => {
    $$renderer2.push(`<link rel="icon"${attr("href", favicon)}/>`);
  });
  Header($$renderer);
  $$renderer.push(`<!----> <hr/> `);
  children($$renderer);
  $$renderer.push(`<!----> <hr/> `);
  $$renderer.push(`<!---->`);
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-Cwo1bOHN.js.map
