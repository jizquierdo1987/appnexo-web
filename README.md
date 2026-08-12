# AppNexo V1.4

Sitio estático bilingüe (ES/EN) de AppNexo, pensado para GitHub + Cloudflare.

## Lo nuevo
- Sin Node.js, Express ni EJS en producción.
- HTML + CSS + JavaScript.
- Selector ES / EN persistente con `localStorage`.
- Detección automática del idioma del navegador en la primera visita.
- `?lang=en` para compartir una URL que abra directamente en inglés.
- Tema claro/oscuro con preferencia persistente.
- Diseño responsive.
- Formulario sin servidor: prepara email o WhatsApp.
- SEO básico, `robots.txt`, `sitemap.xml`, Open Graph y Twitter Card.
- Estructura de imágenes separada por marca, servicios, proyectos, productos, YouTube y perfil.

## Probar localmente
No abras los HTML con doble clic. Usa un servidor estático desde la raíz:

```bash
python3 -m http.server 8080
```

Luego abre `http://localhost:8080`.

## Datos de contacto y redes
Edita solo:

`assets/js/config.js`

Ahí puedes cambiar correo, WhatsApp, YouTube, TikTok, Facebook, GitHub y LinkedIn.

## Imágenes reales
Consulta `docs/ASSETS.md`.

## Cloudflare
Publica esta carpeta como raíz del sitio. No requiere proceso de build. Conecta el repositorio de GitHub a tu proyecto de Cloudflare y usa `appnexo.dev` como dominio personalizado.


## Novedades V1.4

- Nuevo catálogo `/blog/` conectado con `blog.appnexo.dev`.
- Blogger continúa como motor de publicación para evitar duplicar contenido.
- Portafolio ampliado con Verificador de Bingo, Gestión de empresas técnicas y Registro de asistencia remota.
- Estados de proyecto: en producción, en desarrollo, disponible, proyecto cliente y caso de estudio.
- Acciones diferenciadas: abrir aplicación, leer artículo y solicitar una solución similar.
- Filtro SaaS y soporte de múltiples categorías por proyecto.
- Acceso al Blog desde Inicio, Aprende y footer.
