# ¡Tripulación, juntos al tesoro!

Ambiente navegable para una experiencia grupal, con mediación adulta, sobre trabajar en equipo. Esta etapa prepara las pantallas, el avance y el guardado. **No incluye** el cuento, las actividades de las misiones ni el video de aprendizaje.

## Qué se puede hacer

- Portada, cuento, mapa, seis misiones en orden fijo, cofre y espacio del video.
- El pirata recorre un camino sinuoso. Solo la misión pendiente está habilitada.
- Al completar una misión (control provisional de quien facilita) se vuelve al mapa, aparece su X y el pirata avanza.
- El cofre se abre solo después de las seis misiones.
- Logotipo MIRARIM o uno propio, guardado en este navegador.
- Ampliar pantalla, cuando el navegador lo permite.
- Reiniciar borra misiones y cofre, y conserva el logotipo.

## Dónde incorporar el contenido

| Qué | Dónde |
|---|---|
| Cuento | `src/content/story.ts` — asignar `storyParagraphs` |
| Cada misión | `src/content/missions.ts` — `instructions` de la misión 1 a la 6 |
| Video | `src/content/video.ts` — `learningVideo` con un archivo local. No reproducir solo. Subtítulos opcionales en `.vtt` |
| Paradas y camino | `src/game/map-config.ts` |
| Capas A–D del cuento | `src/game/story-config.ts` |

Las capas A–D son los cuatro cuadrantes de `111238.jpg` (arriba izquierda, arriba derecha, abajo izquierda, abajo derecha). Están ocultas. En el cuento, «Comprobar capas (desarrollo)» las muestra para revisar la alineación. No es un control para las niñas y los niños.

## Recursos

Los originales están en `public/recursos/originales/` y no se modifican.

Logotipo, pirata y cofres se muestran desde `public/recursos/derivados/`: el negro de fondo pasó a transparencia para que no quede un cuadrado negro. Detalle en `public/recursos/LEEME.md`. Para regenerarlos: `python3 scripts/prepare-recursos.py`.

El cofre abierto y el cerrado no comparten la base dentro del archivo. La escena los ancla por la base para que no salten al abrir.

## Guardado local

- Avance: `localStorage`, clave `mirarim-tripulacion-avance`.
- Guarda versión, misiones completadas (consecutivas, de 0 a 6), si el cofre está abierto y la pantalla actual.
- No guarda nombres, respuestas ni fotografías de las niñas y los niños.
- Logotipo personalizado: IndexedDB `mirarim-tripulacion`, solo en este navegador. No se sube a ningún servidor.
- «Restablecer MIRARIM» no borra el avance. «Reiniciar» no borra el logotipo.
- Si el archivo guardado no es válido, se recupera un estado seguro.
- Si el navegador no permite guardar, se puede seguir en la sesión y se avisa que el avance podría no conservarse.

## Ejecutar

```bash
npm install
npm run dev
```

La aplicación queda en el puerto 8080.

Producción:

```bash
npm run build
npm run preview
```

## Pruebas de esta etapa

- Portada con el título exacto y la imagen de la tripulación.
- El cuento abre el mapa y muestra la nota de contenido pendiente.
- Volver desde una misión no suma avance. Completar suma una sola misión, también ante un doble clic.
- Tras seis misiones se habilita el cofre. Al abrirlo aparece «Ver lo que aprendimos», sin reproductor mientras no haya archivo.
- Recargar conserva el avance. Reiniciar pide confirmación y vuelve a la portada en cero.
- Sin desplazamiento horizontal en escritorio ni en un ancho de teléfono.

Pendiente de contenido, no de esta estructura: el texto del cuento, las seis actividades, el video y los subtítulos.

En Safari, la pantalla completa de un elemento puede no estar disponible. Si falla, la aplicación indica ampliar la ventana o usar el modo de pantalla completa del navegador.
