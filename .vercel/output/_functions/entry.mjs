import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_SC7ToUiF.mjs';
import { manifest } from './manifest_BOJDO0Vc.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/subscribe.astro.mjs');
const _page2 = () => import('./pages/auth/acceder.astro.mjs');
const _page3 = () => import('./pages/auth/callback.astro.mjs');
const _page4 = () => import('./pages/auth/crear-cuenta.astro.mjs');
const _page5 = () => import('./pages/auth/solicitar-codigo.astro.mjs');
const _page6 = () => import('./pages/auth/verificar-codigo.astro.mjs');
const _page7 = () => import('./pages/perfil.astro.mjs');
const _page8 = () => import('./pages/privacy.astro.mjs');
const _page9 = () => import('./pages/terms.astro.mjs');
const _page10 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/subscribe.ts", _page1],
    ["src/pages/auth/acceder.astro", _page2],
    ["src/pages/auth/callback.astro", _page3],
    ["src/pages/auth/crear-cuenta.astro", _page4],
    ["src/pages/auth/solicitar-codigo.astro", _page5],
    ["src/pages/auth/verificar-codigo.astro", _page6],
    ["src/pages/perfil.astro", _page7],
    ["src/pages/privacy.astro", _page8],
    ["src/pages/terms.astro", _page9],
    ["src/pages/index.astro", _page10]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "df76a30c-7886-4c61-aa73-872834589a10",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
