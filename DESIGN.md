# DESIGN.md: TurnosPro

Mundo visual: **almanaque de taco**. Hoy es una hoja arrancable con el número gigante; todo lo demás habla con la misma letra y el mismo rojo.

## Escena
Se usa en la calle a pleno sol (ORA), de noche en la grúa o el depósito, y en casa. Por eso hay tema claro de alto contraste por defecto y modo noche automático (`prefers-color-scheme`) o manual (botón luna/sol, guardado en `turnos_theme`).

## Color (variables CSS en `:root`)
| Token | Claro | Noche | Uso |
|---|---|---|---|
| `--ground` | #ECEEF1 | #0C0E11 | Suelo gris frío (nunca crema) |
| `--paper` / `--paper-2` | #FFFFFF / #F6F7F9 | #171A1F / #1E2228 | Hojas, paneles / segunda capa |
| `--ink` / `--ink-2` / `--ink-3` | #15171C / #464B56 / #646A76 | #F1F2F4 / #BCC1CA / #959BA7 | Texto principal, secundario, terciario |
| `--line` / `--line-strong` | #D8DBE1 / #B9BEC7 | #2B3038 / #3B414B | Bordes, reglas punteadas |
| `--red` | #C81E17 | #C81E17 | Banda superior, cabecera de la hoja, domingos y festivos |
| `--red-ink` / `--red-soft` | #C11B14 / #FCE9E8 | #FF6B61 / #3A1513 | Texto rojo / fondo rojo suave |

Turnos (bloques sólidos, `[data-code]`): M #FFC21A, T #2563D9, N #392E8C, TE (turno extra) #B0166F, L verde suave #DDF1E4 / #14592F, V #0B8585, B #6E7380. Rojo solo para domingo/festivo y peligro; nunca como decoración.

## Tipografía
Una familia: **Archivo variable** (autoalojada en `assets/archivo-var.woff2`, ejes `wght` 100–900 y `wdth` 62–125).
- Display (números de día, nombres de turno, cifras): `font-weight 900`, `font-stretch 62–72%`, tracking negativo leve. Número de la hoja: ~9rem en móvil, 14rem en escritorio.
- Títulos de sección: 800, `font-stretch 78–85%`, mayúsculas con `letter-spacing .06em`.
- Interfaz y texto: ancho normal, 400–700, base 15px, mínimo 12px. Números siempre `tabular-nums`.

## Iconos
Font Awesome Free sólido autoalojado (`assets/fa-solid-900.woff2`) con clases propias `.i .i-*`. Nada de emojis como iconos.

## Componentes
- **Hoja** (`.taco > .hoja`): cabecera roja con perforación de puntos, mes en mayúsculas, número condensado, día de la semana, bloque de turno a todo el ancho y pie gris con flechas. Hojas apiladas debajo (`.taco::before/::after`).
- **Arrancar la hoja**: al avanzar, un clon se levanta con `rotateX` y gira (320 ms); al retroceder, la hoja cae (`dropIn`, 280 ms). También funciona deslizando el dedo y con las flechas del teclado. Respeta `prefers-reduced-motion`.
- **Mini-hojas** (`.day`): banda superior negra (roja en domingo/festivo), número condensado y pie de color del turno.
- **Libro de cuentas** (`.ledger`): filas con regla punteada, etiqueta a la izquierda y cifra condensada a la derecha; total con regla sólida de 2px. Sustituye a las tarjetas de cifras.
- **Cuadrante**: tabla matriz con columna de nombres fija en ≥900px; calendarios por trabajador alineados lunes→domingo en móvil. Domingos/festivos con regla roja superior; hoy con contorno de tinta.
- **Botones**: 44px de alto mínimo; primario en tinta, rojo para acciones de marca, `btn-danger` con contorno rojo, `btn-ghost`.
- **Diálogos**: `<dialog>` nativo; en móvil son hojas inferiores.
- **Navegación**: pestañas en la banda roja (escritorio) y barra inferior fija (móvil).

## Movimiento
150–250 ms, salida exponencial. El único momento coreografiado es arrancar la hoja.
