import 'piccolore';
import { v as decodeKey } from './chunks/astro/server_D13BJ9Xf.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_D5CYdxkr.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/omarbermejo/dev/bimoora-comming-soon/","cacheDir":"file:///Users/omarbermejo/dev/bimoora-comming-soon/node_modules/.astro/","outDir":"file:///Users/omarbermejo/dev/bimoora-comming-soon/dist/","srcDir":"file:///Users/omarbermejo/dev/bimoora-comming-soon/src/","publicDir":"file:///Users/omarbermejo/dev/bimoora-comming-soon/public/","buildClientDir":"file:///Users/omarbermejo/dev/bimoora-comming-soon/dist/client/","buildServerDir":"file:///Users/omarbermejo/dev/bimoora-comming-soon/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/subscribe","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/subscribe\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"subscribe","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/subscribe.ts","pathname":"/api/subscribe","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/solicitar-codigo.Xeh-h49x.css"}],"routeData":{"route":"/auth/acceder","isIndex":false,"type":"page","pattern":"^\\/auth\\/acceder\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}],[{"content":"acceder","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth/acceder.astro","pathname":"/auth/acceder","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/auth/callback","isIndex":false,"type":"page","pattern":"^\\/auth\\/callback\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}],[{"content":"callback","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth/callback.astro","pathname":"/auth/callback","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/solicitar-codigo.Xeh-h49x.css"}],"routeData":{"route":"/auth/crear-cuenta","isIndex":false,"type":"page","pattern":"^\\/auth\\/crear-cuenta\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}],[{"content":"crear-cuenta","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth/crear-cuenta.astro","pathname":"/auth/crear-cuenta","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/solicitar-codigo.Xeh-h49x.css"}],"routeData":{"route":"/auth/solicitar-codigo","isIndex":false,"type":"page","pattern":"^\\/auth\\/solicitar-codigo\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}],[{"content":"solicitar-codigo","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth/solicitar-codigo.astro","pathname":"/auth/solicitar-codigo","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/solicitar-codigo.Xeh-h49x.css"}],"routeData":{"route":"/auth/verificar-codigo","isIndex":false,"type":"page","pattern":"^\\/auth\\/verificar-codigo\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}],[{"content":"verificar-codigo","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth/verificar-codigo.astro","pathname":"/auth/verificar-codigo","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/solicitar-codigo.Xeh-h49x.css"}],"routeData":{"route":"/perfil","isIndex":false,"type":"page","pattern":"^\\/perfil\\/?$","segments":[[{"content":"perfil","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/perfil.astro","pathname":"/perfil","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/solicitar-codigo.Xeh-h49x.css"}],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/solicitar-codigo.Xeh-h49x.css"}],"routeData":{"route":"/terms","isIndex":false,"type":"page","pattern":"^\\/terms\\/?$","segments":[[{"content":"terms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/terms.astro","pathname":"/terms","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/solicitar-codigo.Xeh-h49x.css"},{"type":"inline","content":".astro-route-announcer{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}@keyframes astroFadeInOut{0%{opacity:1}to{opacity:0}}@keyframes astroFadeIn{0%{opacity:0;mix-blend-mode:plus-lighter}to{opacity:1;mix-blend-mode:plus-lighter}}@keyframes astroFadeOut{0%{opacity:1;mix-blend-mode:plus-lighter}to{opacity:0;mix-blend-mode:plus-lighter}}@keyframes astroSlideFromRight{0%{transform:translate(100%)}}@keyframes astroSlideFromLeft{0%{transform:translate(-100%)}}@keyframes astroSlideToRight{to{transform:translate(100%)}}@keyframes astroSlideToLeft{to{transform:translate(-100%)}}@media(prefers-reduced-motion){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}[data-astro-transition-scope]{animation:none!important}}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/auth/acceder.astro",{"propagation":"none","containsHead":true}],["/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/auth/crear-cuenta.astro",{"propagation":"none","containsHead":true}],["/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/auth/solicitar-codigo.astro",{"propagation":"none","containsHead":true}],["/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/auth/verificar-codigo.astro",{"propagation":"none","containsHead":true}],["/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/perfil.astro",{"propagation":"none","containsHead":true}],["/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/privacy.astro",{"propagation":"none","containsHead":true}],["/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/terms.astro",{"propagation":"none","containsHead":true}],["/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/subscribe@_@ts":"pages/api/subscribe.astro.mjs","\u0000@astro-page:src/pages/auth/acceder@_@astro":"pages/auth/acceder.astro.mjs","\u0000@astro-page:src/pages/auth/callback@_@astro":"pages/auth/callback.astro.mjs","\u0000@astro-page:src/pages/auth/crear-cuenta@_@astro":"pages/auth/crear-cuenta.astro.mjs","\u0000@astro-page:src/pages/auth/solicitar-codigo@_@astro":"pages/auth/solicitar-codigo.astro.mjs","\u0000@astro-page:src/pages/auth/verificar-codigo@_@astro":"pages/auth/verificar-codigo.astro.mjs","\u0000@astro-page:src/pages/perfil@_@astro":"pages/perfil.astro.mjs","\u0000@astro-page:src/pages/privacy@_@astro":"pages/privacy.astro.mjs","\u0000@astro-page:src/pages/terms@_@astro":"pages/terms.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BOJDO0Vc.mjs","/Users/omarbermejo/dev/bimoora-comming-soon/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_NLqc31WT.mjs","/Users/omarbermejo/dev/bimoora-comming-soon/src/components/auth/AccederForm":"_astro/AccederForm.DBu9kPZq.js","/Users/omarbermejo/dev/bimoora-comming-soon/src/components/auth/CrearCuentaForm":"_astro/CrearCuentaForm.BgvJwX8u.js","/Users/omarbermejo/dev/bimoora-comming-soon/src/components/auth/RequestCode":"_astro/RequestCode.PzVkYLbX.js","/Users/omarbermejo/dev/bimoora-comming-soon/src/components/auth/VerifyCode":"_astro/VerifyCode.rxgBgjz4.js","/Users/omarbermejo/dev/bimoora-comming-soon/src/components/profile/ProfileContent":"_astro/ProfileContent.Cq1AnSGd.js","/Users/omarbermejo/dev/bimoora-comming-soon/src/components/landing/Navbar":"_astro/Navbar.B2Ogo-xa.js","@astrojs/react/client.js":"_astro/client.CpZTY37Y.js","/Users/omarbermejo/dev/bimoora-comming-soon/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/bimooralogo-sinfondo.BdCUS6Qr.png","/_astro/bimooralogo-sin.DuYEHQAH.png","/_astro/solicitar-codigo.Xeh-h49x.css","/favicon.svg","/_astro/AccederForm.DBu9kPZq.js","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js","/_astro/CrearCuentaForm.BgvJwX8u.js","/_astro/CustomToast.ClSMimZP.js","/_astro/Navbar.B2Ogo-xa.js","/_astro/ProfileContent.Cq1AnSGd.js","/_astro/RequestCode.PzVkYLbX.js","/_astro/VerifyCode.rxgBgjz4.js","/_astro/authOtp.jlkC_QuI.js","/_astro/checkbox.AcaapHhg.js","/_astro/client.CpZTY37Y.js","/_astro/createLucideIcon.Rs-VvVdl.js","/_astro/index.BvCTCXRa.js","/_astro/index.DJ4e78gH.js","/_astro/mail.Ck5OvYfw.js","/_astro/supabase.BnnHlCse.js","/_astro/user.BdiKfrgq.js","/_astro/x.BavfOWAG.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"OrGIkSyCT+B5APBGv7kI675jTdPL7bZIstoemuMvJ5Y="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
