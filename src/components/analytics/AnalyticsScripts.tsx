import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const SAFE_ID = /^[A-Za-z0-9-]+$/;

/**
 * Carga GA4 y Meta Pixel solo si sus IDs están definidos (y son válidos, para evitar inyección).
 * `lazyOnload` los saca de la ruta crítica: no afectan LCP ni INP.
 * Consent Mode v2: por defecto se concede analytics; ajusta `default` si usas un banner de consentimiento.
 */
export function AnalyticsScripts() {
  const ga = GA_ID && SAFE_ID.test(GA_ID) ? GA_ID : null;
  const pixel = PIXEL_ID && SAFE_ID.test(PIXEL_ID) ? PIXEL_ID : null;

  return (
    <>
      {ga ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="lazyOnload" />
          <Script id="ga4-init" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}
      {pixel ? (
        <Script id="meta-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixel}');fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  );
}
