import { h as head, c as attr } from './index-XUVkxrbo.js';
import { f as favicon } from './favicon-BqBRrRrO.js';

function Header($$renderer) {
  $$renderer.push(`<p>Proyecto SOS2526-13</p>`);
}
function Footer($$renderer) {
  $$renderer.push(`<p>Made by PMA, CEV &amp; CPS</p>`);
}
function _layout($$renderer, $$props) {
  let { children } = $$props;
  head("12qhfyh", $$renderer, ($$renderer2) => {
    $$renderer2.push(`<link rel="icon"${attr("href", favicon)}/>`);
  });
  Header($$renderer);
  $$renderer.push(`<!----> <hr/> `);
  children($$renderer);
  $$renderer.push(`<!----> <hr/> `);
  Footer($$renderer);
  $$renderer.push(`<!---->`);
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-Ds7UjhJT.js.map
