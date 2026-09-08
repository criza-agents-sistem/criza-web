# criza-web

Sitio institucional público de **CRIZA** — `criza.bio`.

Independiente del repo del sistema de agentes (`criza-agents-sistem/criza`): otra
audiencia, otro deploy, sin autenticación. Ver el motivo de aislamiento entre piezas
en el `CLAUDE.md` de ese repo.

## Estado

Versión preliminar / fase 1. Una sola página (`index.html`), sin build.

Pendiente:

- Logotipo definitivo (hoy hay un wordmark de texto como placeholder).
- Tipografía de etiquetas: **Nashville** (embeber el archivo de la diseñadora; hoy cae
  a un mono de reemplazo). Títulos = DM Serif Display · cuerpo = Quicksand (Google Fonts).
- Fotos del equipo y números de contacto directo.
- Dominio `criza.bio` (a comprar y apuntar a Vercel).

## Stack

HTML estático, sin dependencias ni build. Tipografías desde Google Fonts.
Tema claro/oscuro con `prefers-color-scheme` + toggle manual (persistido en `localStorage`).

## Deploy

Vercel, importando este repo. Framework preset: **Other**. Sin build command,
output directory = raíz. Cada push a `main` publica.

## Desarrollo local

Abrir `index.html` en el navegador, o servir la carpeta:

```
npx serve .
```
