# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Empleados** del servicio de ORA (estacionamiento regulado) y grúas de La Línea de la Concepción: vigilantes, gruistas y personal del depósito. Consultan sobre todo desde el móvil qué turno tienen hoy y los próximos días, y el mes completo para organizarse.
- **Administrador** (una persona): monta y corrige el cuadrante, genera rotaciones y gestiona contraseñas. Uso tanto en móvil como en ordenador.
Ambos usos pesan por igual.

## Product Purpose
Cuadrante de turnos compartido (Mañana, Tarde, Noche, Libre, Vacaciones, Baja) con festivos de La Línea marcados, estadísticas por trabajador (días trabajados, horas, festivos y plus de festivos del Art. 55) y una wiki breve del III Convenio Colectivo de Andalucía (BOJA núm. 121). Éxito: cualquier empleado sabe su turno en segundos y el admin mantiene el cuadrante sin fricción.

## Operating Context
- Se consulta en la calle a pleno sol (ORA), de noche con poca luz (grúa/depósito) y en casa planificando el mes.
- PWA instalable; datos en una hoja de Google Sheets a través de Google Apps Script.
- Acceso de empleados con contraseña común; admin con PIN.

## Capabilities and Constraints
- Un único `index.html` estático (Tailwind v4 por CDN, Font Awesome), `sw.js`, `manifest.json`, publicado en GitHub Pages.
- Backend en `apps-script/Code.gs` (acciones: verifyEmployeePass, getData, verifyAdmin, saveTurnos, updatePassword, updateEmployeePass).
- Códigos de turno: M, T, N, L, V, B.
- Festivos: nacionales, Andalucía, Jueves/Viernes Santo calculados; locales de La Línea solo cargados para 2026.

## Brand Commitments
Nombre: TurnosPro. Sin otros compromisos de marca; libertad visual total.

## Evidence on Hand
Sin logotipo corporativo ni fotografías. No inventar datos de empresa, tarifas ni artículos del convenio que no estén en el código.

## Product Principles
1. El turno de hoy, primero: la respuesta a "¿qué me toca?" en un vistazo.
2. Legible en cualquier luz: calle a pleno sol y cabina de noche.
3. Editar debe ser tan rápido como consultar para el admin.
4. Los datos guardados son la verdad: el estado de sincronización siempre visible.

## Accessibility & Inclusion
Contraste alto para uso exterior; objetivos táctiles amplios (uso con una mano, a veces con guantes).
