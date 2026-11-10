---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: index.html (TurnosPro)

Mode: Operate. Users: empleados ORA/grúas (consulta en móvil, sol y noche) y un admin (edita cuadrante). Task: saber el turno de hoy en segundos; ver el mes; admin edita rápido. Constraints: un único HTML estático en GitHub Pages, backend Apps Script, sin Tailwind, fuentes e iconos autoalojados.

## Direction contract

THESIS: La app es un almanaque de taco: hoy es una hoja arrancable con el número gigante y tu turno escrito en grande. Rechaza el panel oscuro genérico de tarjetas con iconos.

OWN-WORLD: Papel blanco sobre suelo gris frío, tinta casi negra, rojo almanaque (#D3221B) en la banda superior, domingos y festivos. Archivo variable: condensada 800-900 para números y nombres de turno, ancho normal para la interfaz. Colores de turno como bloques sólidos (M amarillo, T azul, N índigo, L verde suave, V turquesa, B gris). Modo noche automático con la misma gramática.

STORY: El empleado abre, ve su hoja de hoy, pasa a los próximos días y luego al mes. El admin pulsa cualquier día y lo cambia; el estado de guardado siempre está visible.

FIRST VIEWPORT: Banda roja con marca, estado de sync y admin; debajo, la hoja de hoy (perforación arriba, mes en rojo, número condensado de ~9rem, día de la semana, bloque de turno a todo el ancho) con selector "¿Quién eres?"; tira horizontal de 7 días; barra de pestañas inferior en móvil.

FORM: Almanaque de taco, candidato 1 de 7 (elegido por el usuario como el recomendado). seed:1dedd7e7adf21ba1

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Signature interaction: arrancar la hoja; al pasar de día la hoja se levanta y gira hacia arriba (220 ms) y aparece la siguiente.
