import { e as createComponent, h as createAstro } from '../../chunks/astro/server_3KTu2lbS.mjs';
import 'piccolore';
import 'clsx';
import { s as supabase } from '../../chunks/supabase_D7K0YZcd.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Callback = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Callback;
  const code = Astro2.url.searchParams.get("code");
  const error = Astro2.url.searchParams.get("error");
  const errorDescription = Astro2.url.searchParams.get("error_description");
  let redirectUrl = "/auth/acceder";
  let message = "";
  if (error) {
    message = errorDescription || "Error en la autenticaci\xF3n";
    redirectUrl = `/auth/acceder?error=${encodeURIComponent(message)}`;
  } else if (code) {
    try {
      const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      if (sessionError) {
        message = sessionError.message;
        redirectUrl = `/auth/acceder?error=${encodeURIComponent(message)}`;
      } else if (data.session) {
        redirectUrl = "/perfil";
      }
    } catch (e) {
      message = "Error procesando la autenticaci\xF3n";
      redirectUrl = `/auth/acceder?error=${encodeURIComponent(message)}`;
    }
  }
  return Astro2.redirect(redirectUrl);
}, "/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/auth/callback.astro", void 0);

const $$file = "/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/auth/callback.astro";
const $$url = "/auth/callback";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Callback,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
