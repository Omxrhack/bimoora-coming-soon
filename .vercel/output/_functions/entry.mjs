import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_UZny3e5n.mjs';
import { manifest } from './manifest_CiqPVCb_.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/api/subscribe.astro.mjs');
const _page3 = () => import('./pages/auth/acceder.astro.mjs');
const _page4 = () => import('./pages/auth/callback.astro.mjs');
const _page5 = () => import('./pages/auth/crear-cuenta.astro.mjs');
const _page6 = () => import('./pages/auth/solicitar-codigo.astro.mjs');
const _page7 = () => import('./pages/auth/verificar-codigo.astro.mjs');
const _page8 = () => import('./pages/espacio/_id_.astro.mjs');
const _page9 = () => import('./pages/onboarding/create-space.astro.mjs');
const _page10 = () => import('./pages/perfil.astro.mjs');
const _page11 = () => import('./pages/privacy.astro.mjs');
const _page12 = () => import('./pages/terms.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/api/subscribe.ts", _page2],
    ["src/pages/auth/acceder.astro", _page3],
    ["src/pages/auth/callback.astro", _page4],
    ["src/pages/auth/crear-cuenta.astro", _page5],
    ["src/pages/auth/solicitar-codigo.astro", _page6],
    ["src/pages/auth/verificar-codigo.astro", _page7],
    ["src/pages/espacio/[id].astro", _page8],
    ["src/pages/onboarding/create-space.astro", _page9],
    ["src/pages/perfil.astro", _page10],
    ["src/pages/privacy.astro", _page11],
    ["src/pages/terms.astro", _page12],
    ["src/pages/index.astro", _page13]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "055da35e-76de-4590-871b-825fb83f4e09",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
