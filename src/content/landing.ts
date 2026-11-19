/**
 * Contenido de la Landing Pilar. Única fuente de verdad para:
 *  - el HTML renderizado en servidor (SEO/GEO),
 *  - el JSON-LD (Service, FAQPage), que debe coincidir EXACTAMENTE con lo visible.
 *
 * Regla GEO "Answer-First": cada `intro` y cada respuesta de FAQ tiene 40-60 palabras,
 * es autocontenida y responde la pregunta en la primera frase.
 */

// Precios de referencia "desde". El código de moneda (3 letras al inicio) define priceCurrency en el JSON-LD.
export const pricing = {
  landing: "COP $970.000",
  corporate: "COP $1.500.000",
  ecommerce: "COP $3.500.000",
} as const;

/**
 * Fechas de la página (E-E-A-T: las IA priorizan contenido con fecha). Se usan en el JSON-LD
 * (datePublished/dateModified), en los metadatos article:* y en el pie ("Última actualización").
 * Actualiza `modified` a mano cuando cambies contenido relevante; no la automatices con la fecha
 * de build, o Google verá "actualizaciones" sin cambios reales.
 */
export const pageDates = {
  published: "2026-11-18",
  modified: "2026-11-19",
} as const;


export type IconName =
  | "building"
  | "cart"
  | "target"
  | "plug"
  | "workflow"
  | "layers"
  | "code"
  | "scan"
  | "shield"
  | "trending"
  | "refresh"
  | "headset"
  | "zap"
  | "smartphone"
  | "search"
  | "sliders"
  | "heart"
  | "store"
  | "factory"
  | "graduation"
  | "cpu"
  | "globe"
  | "database"
  | "sparkles";

export interface FeatureItem {
  title: string;
  description: string;
  icon: IconName;
  bullets?: readonly string[];
  tag?: string;
}

export const hero = {
  eyebrow: "Agencia de desarrollo web · SEO + GEO + Automatización",
  h1: "Diseño de páginas web profesionales en Bogotá",
  // Se renderiza con "botkor" en negrita (ver Hero.tsx). Texto plano para metadatos y JSON-LD.
  lead: "botkor es una agencia de diseño y desarrollo web en Bogotá que crea páginas web corporativas, tiendas online y landing pages para empresas de toda Colombia. Entregamos en 1 a 3 semanas, desde COP $970.000, con carga en menos de 2 segundos, SEO técnico, optimización para buscadores con IA y automatizaciones que llevan cada contacto a WhatsApp o a tu CRM.",
  primaryCta: "Cotizar mi página web ahora",
  secondaryCta: "Ver un proyecto en acción",
  proof: [
    { value: "1–3", label: "semanas de entrega" },
    { value: "<2 s", label: "tiempo de carga objetivo" },
    { value: "100%", label: "responsivo y accesible" },
    { value: "24/7", label: "captura de leads automatizada" },
  ],
} as const;

export const solutions = {
  id: "soluciones",
  eyebrow: "Soluciones",
  h2: "Desarrollo web para empresas y emprendedores",
  intro:
    "botkor es una agencia de diseño y desarrollo web que crea sitios corporativos, tiendas online y landing pages para empresas y emprendedores de cualquier sector. Cada proyecto parte de un objetivo comercial medible —más cotizaciones, más ventas o más reservas— y se entrega con código propio, optimizado y listo para crecer.",
  items: [
    {
      icon: "building",
      tag: `Desde ${pricing.corporate}`,
      title: "Diseño de páginas web corporativas y de servicios profesionales",
      description:
        "Sitios institucionales que transmiten autoridad desde el primer segundo: arquitectura de información clara, mensajes orientados a beneficios y llamados a la acción en cada sección para convertir visitas en reuniones comerciales.",
      bullets: ["Hasta 8 secciones estratégicas", "Blog autogestionable para SEO", "Formularios conectados a tu CRM"],
    },
    {
      icon: "cart",
      tag: `Desde ${pricing.ecommerce}`,
      title: "Desarrollo de tiendas online (E-commerce) listas para vender",
      description:
        "Tiendas rápidas y seguras con catálogo, carrito, pasarelas de pago locales e internacionales, inventario sincronizado y notificaciones automáticas por correo y WhatsApp. Vendes 24/7 sin depender de un equipo conectado.",
      bullets: ["Pagos con tarjeta, PSE, Mercado Pago o Stripe", "Checkout optimizado en pocos pasos", "Gestión de pedidos e inventario"],
    },
    {
      icon: "target",
      tag: `Desde ${pricing.landing}`,
      title: "Creación de landing pages de alta conversión para campañas",
      description:
        "Páginas enfocadas en una sola acción, diseñadas para campañas de Google Ads, Meta Ads y email marketing. Cada elemento se prioriza según su impacto en la conversión y se mide con eventos de GA4 y Meta Pixel.",
      bullets: ["Copywriting persuasivo incluido", "Tracking de conversiones configurado", "Variantes listas para pruebas A/B"],
    },
  ],
} as const satisfies { items: readonly FeatureItem[] } & Record<string, unknown>;

export const automation = {
  id: "automatizacion",
  eyebrow: "Automatización",
  h2: "Desarrollo web preparado para integrar automatizaciones de procesos",
  intro:
    "Cada sitio que desarrollamos nace con una arquitectura API-first: formularios, pagos y eventos se conectan a tu CRM, email marketing, ERP o WhatsApp Business mediante webhooks y plataformas como n8n o Make. Así eliminas tareas manuales, respondes a los leads en minutos y tu web trabaja como un vendedor 24/7.",
  items: [
    {
      icon: "plug",
      title: "Conexión fluida con CRMs, herramientas de email marketing y ERPs",
      description:
        "Cada contacto llega a tu CRM con su origen, campaña y tipo de interés. Sincronizamos HubSpot, Pipedrive, Zoho, Salesforce, Brevo, Mailchimp u Odoo para que ningún lead se pierda en una bandeja de entrada.",
    },
    {
      icon: "workflow",
      title: "Automatización de flujos de venta y atención al cliente vía APIs",
      description:
        "Respuesta inmediata por WhatsApp Business, asignación automática al asesor correcto, recordatorios de seguimiento y encuestas posventa. Diseñamos los flujos en n8n o Make y los documentamos para que tu equipo los entienda.",
    },
    {
      icon: "layers",
      title: "Infraestructura lista para escalar junto al crecimiento de tu empresa",
      description:
        "Arquitectura modular desacoplada: puedes sumar nuevos idiomas, sedes, productos o integraciones sin rehacer el sitio. El mismo código soporta de cien a cientos de miles de visitas mensuales sobre infraestructura cloud con CDN global.",
    },
  ],
  flow: ["Formulario web", "Webhook n8n", "CRM", "WhatsApp Business", "GA4 + Meta CAPI"],
  tools: ["n8n", "Make", "HubSpot", "Pipedrive", "Zoho", "Salesforce", "Odoo", "Brevo", "Mailchimp", "WhatsApp Business", "Stripe", "Mercado Pago"],
} as const satisfies { items: readonly FeatureItem[] } & Record<string, unknown>;

export const techPillars = {
  id: "seguridad",
  eyebrow: "Ingeniería y seguridad",
  h2: "Criterio estratégico, experiencia técnica y seguridad web garantizada",
  intro:
    "Combinamos criterio estratégico de negocio con ingeniería de software: construimos APIs seguras, auditamos rendimiento, SEO y vulnerabilidades, y aplicamos controles basados en OWASP Top 10, cifrado HTTPS, cabeceras de seguridad y validación estricta de datos. El resultado es una web que vende, protege la información de tus clientes y cumple estándares profesionales.",
  items: [
    {
      icon: "code",
      title: "Creación de APIs robustas y conexión de sistemas",
      description:
        "Desarrollamos APIs REST tipadas con Node.js y NestJS, autenticación segura, webhooks firmados y documentación técnica. Conectamos tu web con inventarios, facturación electrónica, plataformas de reservas o sistemas internos existentes.",
      bullets: ["Contratos tipados con TypeScript", "Webhooks con firma HMAC", "Documentación OpenAPI"],
    },
    {
      icon: "scan",
      title: "Auditoría web integral: Rendimiento, SEO y vulnerabilidades",
      description:
        "Analizamos Core Web Vitals, indexación, datos estructurados, accesibilidad y superficie de ataque de tu sitio actual. Entregamos un informe priorizado por impacto comercial con las correcciones exactas que debes aplicar.",
      bullets: ["Core Web Vitals (LCP, INP, CLS)", "SEO técnico y visibilidad en IA", "Escaneo de vulnerabilidades"],
    },
    {
      icon: "shield",
      title: "Seguridad web avanzada y blindaje de datos",
      description:
        "Protegemos formularios contra spam y bots, validamos y sanitizamos cada dato en el servidor, configuramos HTTPS forzado, Content-Security-Policy y HSTS, y limitamos peticiones abusivas. Tus clientes confían; tus datos quedan protegidos.",
      bullets: ["Controles OWASP Top 10", "CSP, HSTS y cabeceras seguras", "Anti-spam y rate limiting"],
    },
  ],
} as const satisfies { items: readonly FeatureItem[] } & Record<string, unknown>;

export const management = {
  id: "soporte",
  eyebrow: "Gestión continua",
  h2: "Administración, actualizaciones y escalabilidad sin fricciones",
  intro:
    "Después del lanzamiento, tu web no queda sola. Ofrecemos planes de administración con monitoreo de disponibilidad, copias de seguridad automáticas, actualizaciones de dependencias, parches de seguridad y soporte técnico con tiempos de respuesta definidos, para que tu sitio evolucione al ritmo de tu empresa sin interrupciones ni costos sorpresa.",
  items: [
    {
      icon: "trending",
      title: "Escalabilidad arquitectónica para proyectos en crecimiento",
      description:
        "Cuando tu negocio crece, el sitio crece contigo: nuevas secciones, catálogos más grandes, múltiples idiomas o sedes. La arquitectura por componentes permite ampliar sin reescribir y sin afectar lo que ya funciona.",
    },
    {
      icon: "refresh",
      title: "Actualizaciones tecnológicas y parches de seguridad continuos",
      description:
        "Mantenemos frameworks, librerías y certificados al día, aplicamos parches de seguridad críticos con prioridad y verificamos el rendimiento después de cada cambio. Tu sitio no envejece ni acumula vulnerabilidades.",
    },
    {
      icon: "headset",
      title: "Administración y soporte web integral",
      description:
        "Un equipo responsable de tu web: cambios de contenido, nuevas páginas, monitoreo 24/7, copias de seguridad y reportes mensuales de tráfico y conversiones. Te atendemos por WhatsApp y correo con tiempos de respuesta acordados.",
    },
  ],
} as const satisfies { items: readonly FeatureItem[] } & Record<string, unknown>;

export const innovation = {
  id: "tecnologia",
  eyebrow: "Stack tecnológico",
  h2: "Desarrollo web impulsado por las últimas tecnologías",
  intro:
    "Desarrollamos con el mismo stack que usan las plataformas digitales líderes: Next.js, React, TypeScript, Node.js y despliegue en una red edge global. Para tu negocio eso se traduce en páginas que cargan en menos de 2 segundos, cero obsolescencia tecnológica durante años y contenido estructurado para que Google y los asistentes de IA lo entiendan.",
  showcaseCaption:
    "En la animación: el sitio que botkor desarrolló para Enfermeras Ángeles de Vida, servicio de enfermería a domicilio en Bogotá, visto en computador y en celular. La misma web se adapta a cada pantalla, carga rápido y lleva cada consulta directo a WhatsApp.",
  showcaseUrl: "https://www.enfermerasangelesdevida.com/",
  items: [
    { icon: "zap", tag: "Next.js + React", title: "Velocidad que convierte", description: "Renderizado en servidor y generación estática: el contenido llega listo al navegador y cada segundo ganado reduce el abandono." },
    { icon: "code", tag: "TypeScript", title: "Menos errores en producción", description: "Código tipado y verificado antes de publicarse. Menos fallas inesperadas y cambios más rápidos y seguros." },
    { icon: "globe", tag: "Edge + CDN global", title: "Rápida en cualquier país", description: "Tu web se sirve desde el servidor más cercano a cada visitante, con alta disponibilidad y certificado SSL automático." },
    { icon: "database", tag: "Headless CMS", title: "Contenido sin depender de nadie", description: "Editas textos, imágenes, productos y artículos desde un panel intuitivo sin tocar una sola línea de código." },
    { icon: "workflow", tag: "APIs + n8n", title: "Procesos que se ejecutan solos", description: "Integraciones abiertas para conectar ventas, marketing y operación sin licencias cerradas ni dependencias rígidas." },
    { icon: "sparkles", tag: "Schema + IA", title: "Lista para la búsqueda con IA", description: "Datos estructurados y contenido Answer-First para que ChatGPT, Gemini y Perplexity comprendan y citen tu negocio." },
  ],
} as const satisfies { items: readonly FeatureItem[] } & Record<string, unknown>;

export const whyBotkor = {
  id: "por-que-botkor",
  eyebrow: "Diferenciadores",
  h2: "¿Por qué contratar a botkor para crear tu página web?",
  intro:
    "Contratar a botkor significa recibir una web medible desde el primer día: carga en menos de 2 segundos, diseño responsivo probado en dispositivos reales, SEO técnico y GEO integrados en el código, y un panel autogestionable para editar contenido sin depender de programadores. Tú controlas el sitio; nosotros garantizamos su rendimiento técnico.",
  evidenceTitle: "Por qué la velocidad de tu web es dinero: datos verificables",
  evidence: [
    {
      value: "+8,4 %",
      text: "más conversiones en tiendas online al mejorar solo 0,1 s la velocidad de carga móvil.",
      source: "Deloitte, Milliseconds Make Millions (2020)",
      url: "https://www.deloitte.com/ie/en/services/consulting/research/milliseconds-make-millions.html",
    },
    {
      value: "10 %",
      text: "de usuarios adicionales perdió la BBC por cada segundo extra que tardaba su sitio en cargar.",
      source: "Google web.dev, Why speed matters",
      url: "https://web.dev/learn/performance/why-speed-matters",
    },
    {
      value: "−43 %",
      text: "de tasa de rebote logró The Economic Times al superar los umbrales de Core Web Vitals.",
      source: "Google web.dev, caso The Economic Times",
      url: "https://web.dev/case-studies/economic-times-cwv",
    },
    {
      value: "≤ 2,5 s",
      text: "es el tiempo de carga del contenido principal (LCP) que Google considera una buena experiencia.",
      source: "Google web.dev, Largest Contentful Paint",
      url: "https://web.dev/articles/lcp",
    },
  ],
  items: [
    {
      icon: "zap",
      tag: "LCP < 2 s",
      title: "Páginas web rápidas con tiempos de carga menores a 2 segundos",
      description:
        "Optimizamos imágenes en AVIF y WebP, tipografías sin saltos de diseño y código mínimo en el navegador. Una web rápida mejora el posicionamiento en Google y reduce el abandono, sobre todo en conexiones móviles.",
    },
    {
      icon: "smartphone",
      tag: "Mobile-first",
      title: "Diseño web 100% responsivo y experiencia de usuario (UX/UI)",
      description:
        "Diseñamos primero para el celular, donde ocurre la mayoría de las visitas, y probamos en dispositivos reales. Interfaces claras, accesibles según WCAG 2.2 y pensadas para que el usuario llegue al contacto sin fricción.",
    },
    {
      icon: "search",
      tag: "SEO + GEO",
      title: "Optimización SEO y GEO integrada desde el código fuente",
      description:
        "HTML semántico, un único H1, metadatos precisos, sitemap, datos estructurados JSON-LD y acceso habilitado para rastreadores de IA. Tu web queda preparada para Google y para motores generativos como ChatGPT, Gemini y Perplexity.",
    },
    {
      icon: "sliders",
      tag: "Autogestionable",
      title: "Control total: sitios web autogestionables y escalables",
      description:
        "El dominio, el código y los datos son tuyos. Te entregamos un panel para editar contenido, capacitación grabada y documentación técnica, para que puedas crecer con nosotros o con tu propio equipo, sin ataduras.",
    },
  ],
} as const satisfies { items: readonly FeatureItem[] } & Record<string, unknown>;

export const sectors = {
  id: "sectores",
  eyebrow: "Sectores",
  h2: "Desarrollo web adaptado a cualquier sector comercial",
  intro:
    "Diseñamos arquitecturas web para clínicas, tiendas, industrias, inmobiliarias, instituciones educativas y startups. Adaptamos la estructura, el lenguaje y las integraciones a las reglas de cada sector: agendamiento de citas, catálogos con inventario, cotizadores B2B o plataformas de inscripción, siempre orientados a convertir visitas en clientes.",
  items: [
    { icon: "heart", title: "Salud y Bienestar", description: "Clínicas, consultorios, spas y centros deportivos.", bullets: ["Agenda de citas en línea", "Recordatorios por WhatsApp", "Perfiles de especialistas"] },
    { icon: "store", title: "Comercio y Retail", description: "Marcas, distribuidores y tiendas físicas que venden online.", bullets: ["Catálogo con inventario", "Pagos y envíos integrados", "Recuperación de carritos"] },
    { icon: "factory", title: "Industria, Logística e Inmobiliaria", description: "Empresas B2B, operadores logísticos y proyectos inmobiliarios.", bullets: ["Cotizadores B2B", "Fichas técnicas descargables", "Listados con filtros avanzados"] },
    { icon: "graduation", title: "Educación, Tecnología y Startups", description: "Instituciones, academias, SaaS y equipos de producto.", bullets: ["Inscripciones y pagos", "Landing pages de producto", "Integración con plataformas LMS"] },
  ],
} as const satisfies { items: readonly FeatureItem[] } & Record<string, unknown>;

export const processSection = {
  id: "proceso",
  eyebrow: "Proceso",
  h2: "Nuestro proceso para desarrollar tu sitio web paso a paso",
  intro:
    "Desarrollamos tu sitio web en cuatro etapas con entregables claros y fechas acordadas: diagnóstico y estrategia comercial, diseño visual y arquitectura UX/UI, programación con optimización SEO/GEO, y pruebas con lanzamiento y capacitación. Un proyecto estándar se entrega en 1 a 3 semanas, con un responsable dedicado y avances visibles en cada etapa.",
  steps: [
    { title: "Diagnóstico y estrategia comercial", time: "Días 1–3", description: "Entendemos tu negocio, tu cliente ideal y tu competencia. Definimos objetivos, mapa del sitio, palabras clave y las integraciones necesarias." },
    { title: "Diseño visual y arquitectura UX/UI", time: "Días 3–7", description: "Creamos el prototipo navegable con tu identidad de marca, priorizando la jerarquía visual y el recorrido hacia la conversión." },
    { title: "Programación y optimización SEO/GEO", time: "Semana 2", description: "Desarrollamos con Next.js y TypeScript, integramos formularios, analítica y automatizaciones, y estructuramos el contenido para Google e IA." },
    { title: "Pruebas, lanzamiento y capacitación", time: "Semana 2–3", description: "Probamos velocidad, seguridad y accesibilidad en dispositivos reales, publicamos en tu dominio y capacitamos a tu equipo." },
  ],
} as const;

export const faq = {
  id: "preguntas-frecuentes",
  eyebrow: "FAQ",
  h2: "Preguntas frecuentes sobre el servicio de creación de páginas web",
  items: [
    {
      question: "¿Cuánto cuesta hacer una página web profesional en botkor?",
      answer: `El costo depende del tipo de sitio, el número de secciones y las integraciones requeridas. Como referencia, una landing page parte desde ${pricing.landing}, un sitio web corporativo desde ${pricing.corporate} y una tienda online desde ${pricing.ecommerce}. Enviamos una cotización detallada y sin compromiso en menos de 24 horas hábiles.`,
    },
    {
      question: "¿En cuánto tiempo entregan una página web terminada?",
      answer:
        "Entregamos una landing page en aproximadamente 1 semana, un sitio web corporativo en unas 2 semanas y una tienda online en 2 a 3 semanas, contadas desde que recibimos los contenidos y accesos necesarios. Los proyectos a medida con integraciones complejas reciben un cronograma específico durante la etapa de diagnóstico.",
    },
    {
      question: "¿El servicio incluye dominio, hosting y certificado de seguridad SSL?",
      answer:
        "Sí. Configuramos el dominio, el hosting de alto rendimiento en infraestructura cloud con CDN global y el certificado de seguridad SSL para que tu sitio funcione siempre con HTTPS. El primer año de dominio y hosting puede incluirse en la cotización y, si ya tienes un dominio propio, lo conectamos sin perder tus correos.",
    },
    {
      question: "¿Mi página web aparecerá en Google y en buscadores con Inteligencia Artificial?",
      answer:
        "Sí. Cada sitio incluye SEO técnico y GEO desde el código: HTML semántico, datos estructurados JSON-LD, sitemap, alta velocidad y acceso habilitado para Googlebot, GPTBot, PerplexityBot y ClaudeBot. Así tu web puede ser indexada por Google y citada por ChatGPT, Gemini o Perplexity; las posiciones finales también dependen de la competencia y del contenido.",
    },
    {
      question: "¿Podré editar los textos y las imágenes de mi página web yo mismo?",
      answer:
        "Sí. Entregamos tu sitio con un panel autogestionable donde editas textos, imágenes, productos y artículos del blog sin tocar código. Al lanzar el sitio capacitamos a tu equipo para usarlo, y si prefieres no hacerlo tú, nuestros planes de administración se encargan de los cambios.",
    },
    {
      question: "¿Ofrecen mantenimiento y soporte después de entregar la página web?",
      answer:
        "Sí. Después del lanzamiento ofrecemos planes de administración con monitoreo de disponibilidad, copias de seguridad automáticas, actualizaciones, parches de seguridad y soporte técnico con tiempos de respuesta definidos. Así tu web se mantiene rápida, segura y al día sin costos sorpresa.",
    },
    {
      question: "¿Cómo es el proceso para crear mi página web con botkor?",
      answer:
        "Trabajamos en cuatro etapas: diagnóstico y estrategia comercial (días 1 a 3), diseño visual y prototipo UX/UI (días 3 a 7), programación con optimización SEO y GEO (semana 2), y pruebas, lanzamiento y capacitación (semanas 2 a 3). Tienes un responsable dedicado y ves los avances en cada etapa.",
    },
    {
      question: "¿Trabajan solo con empresas de Bogotá?",
      answer:
        "No. botkor tiene su base en Bogotá, pero desarrolla páginas web para empresas de toda Colombia. Todo el proceso funciona en línea: reuniones por videollamada, revisiones sobre el prototipo navegable y atención por WhatsApp o correo, con los mismos tiempos de entrega en cualquier ciudad.",
    },
  ],
} as const;

export const contact = {
  id: "cotizar",
  eyebrow: "Cotización sin compromiso",
  h2: "Cotiza hoy el desarrollo de tu página web con botkor",
  intro:
    "Completa el formulario en menos de un minuto y recibe una propuesta personalizada con alcance, tiempos y precio en menos de 24 horas hábiles. Un especialista revisará tu caso, te contactará por el canal que prefieras y te recomendará la solución web más rentable para tu negocio, sin costo ni compromiso.",
  assurances: [
    "Respuesta en menos de 24 horas hábiles",
    "Propuesta con precio cerrado y cronograma",
    "Tus datos protegidos y nunca compartidos",
    "Sin compromiso de contratación",
  ],
} as const;
