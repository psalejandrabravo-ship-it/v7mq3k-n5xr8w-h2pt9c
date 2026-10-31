/**
 * Contenidos exactos de las cinco misiones.
 * No sustituir textos.
 */

export type Mission = {
  order: number;
  title: string;
  focus: string;
  situation: string;
  question: string;
  alternatives: [string, string, string];
  correctIndex: 0 | 1 | 2; // A=0, B=1, C=2
  teaching: string;
  wrongFeedback: string;
  situationImage: string;
  solutionImage: string;
  situationAlt: string;
  solutionAlt: string;
  activity: {
    name: string;
    materials: string;
    preparation: string;
    instruction: string;
    guidance: string;
    closingQuestion: string;
    completionCriteria: string;
    briefInstruction: string;
  };
};

export const missions: Mission[] = [
  {
    order: 1,
    title: "Juntos podemos más",
    focus: "Juntos podemos más",
    situation: "El pirata encontró una caja que bloquea el camino. Intentó moverla, pero él solo no pudo.",
    question: "¿Qué puede hacer para seguir avanzando?",
    alternatives: [
      "Pedir ayuda a su tripulación para moverla juntos.",
      "Seguir intentando moverla solo.",
      "Dejar de buscar el tesoro.",
    ],
    correctIndex: 0,
    teaching: "¡Así es! Con la ayuda de su tripulación, el pirata puede mover la caja. Hay cosas que nos cuestan solos, pero que podemos lograr juntos.",
    wrongFeedback: "Al pirata le está costando mover la caja solo. ¿Quiénes podrían ayudarlo? Pensemos otra vez.",
    situationImage: "/recursos/misiones/m1-situacion.png",
    solutionImage: "/recursos/misiones/m1-solucion.png",
    situationAlt: "Pirata intentando mover solo una caja grande de madera.",
    solutionAlt: "Tripulación de niños empujando juntos la caja.",
    activity: {
      name: "Transportamos el tesoro",
      materials: "Una tela resistente o sábana pequeña y una pelota liviana.",
      preparation: "Colocar la pelota sobre la tela y marcar un recorrido corto, despejado y sin obstáculos.",
      instruction: "Coloquen el tesoro sobre la tela. Sujeten los bordes entre todos y llévenlo despacio hasta la isla, sin dejarlo caer.",
      guidance: "Participa solamente el grupo encargado de esta misión. Distribuir a sus integrantes alrededor de la tela, con espacio para sujetarla. Se desplazan caminando. Si la pelota cae, la colocan nuevamente y continúan; no se reinicia como castigo.",
      closingQuestion: "¿Cómo nos ayudamos para llevar el tesoro?",
      completionCriteria: "El grupo llevó el tesoro hasta la llegada con la participación de sus integrantes.",
      briefInstruction: "Sujeten la tela entre todos y lleven la pelota hasta la llegada, caminando y sin dejarla caer.",
    },
  },
  {
    order: 2,
    title: "Compartimos el trabajo",
    focus: "Compartimos el trabajo",
    situation: "El viento dejó muchas provisiones esparcidas por la playa. El pirata quiere recogerlas, pero son demasiadas para él solo.",
    question: "¿Cómo puede ayudar la tripulación?",
    alternatives: [
      "Mirar mientras el pirata recoge todo.",
      "Recoger cada uno una parte y llevarla al barco.",
      "Pedirle que recoja todo sin ayuda.",
    ],
    correctIndex: 1,
    teaching: "¡Buena idea! Si cada integrante recoge una parte, pueden ordenar la playa entre todos. Compartir el trabajo nos ayuda a avanzar.",
    wrongFeedback: "Todavía queda mucho por recoger. ¿Qué pasaría si cada integrante ayudara con una parte?",
    situationImage: "/recursos/misiones/m2-situacion.png",
    solutionImage: "/recursos/misiones/m2-solucion.png",
    situationAlt: "Pirata sosteniendo una naranja junto a provisiones esparcidas.",
    solutionAlt: "Tripulación recogiendo frutas y provisiones hacia un canasto.",
    activity: {
      name: "Recogemos las provisiones",
      materials: "Pelotas blandas, bloques grandes o saquitos, y un canasto o caja.",
      preparation: "Distribuir los objetos en una zona despejada y colocar el canasto en un lugar accesible.",
      instruction: "Las provisiones quedaron esparcidas. Cada integrante recogerá una parte y la llevará al canasto. ¡Caminamos y dejamos espacio a los demás!",
      guidance: "Participa solamente el grupo encargado de esta misión. Asegurar que haya objetos suficientes para que todos colaboren. No medir tiempos ni comparar con otros grupos.",
      closingQuestion: "¿Qué pasó cuando todos ayudaron con una parte?",
      completionCriteria: "Las provisiones están recogidas y todos los integrantes colaboraron.",
      briefInstruction: "Cada integrante recoge una parte de las provisiones y la lleva al canasto. ¡Todos ayudan!",
    },
  },
  {
    order: 3,
    title: "Juntos encontramos soluciones",
    focus: "Juntos encontramos soluciones",
    situation: "El pirata llegó a un puente roto y no sabe cómo cruzar. Su tripulación está con él.",
    question: "¿Qué pueden hacer?",
    alternatives: [
      "Intentar saltar sin saber si llegarán.",
      "Esperar a que el puente se arregle solo.",
      "Buscar juntos una manera segura de pasar.",
    ],
    correctIndex: 2,
    teaching: "¡Eso es! No necesitan resolverlo solos. Al buscar una solución juntos, pueden descubrir cómo continuar.",
    wrongFeedback: "Necesitan una manera segura de cruzar. ¿Qué podrían descubrir si buscan una solución entre todos?",
    situationImage: "/recursos/misiones/m3-situacion.png",
    solutionImage: "/recursos/misiones/m3-solucion.png",
    situationAlt: "Pirata pensando frente a un puente de madera roto, con la tripulación.",
    solutionAlt: "Tripulación construyendo juntos un camino con tablones sobre el puente.",
    activity: {
      name: "Construimos un camino",
      materials: "Bloques grandes y una figura de pirata.",
      preparation: "Marcar una salida y una llegada sobre una mesa o en el suelo. Dejar los bloques al alcance del grupo.",
      instruction: "Construyan juntos un camino para que el pirata llegue a la isla. Si quedan espacios, busquen cómo unirlos.",
      guidance: "Participa solamente el grupo encargado de esta misión. Probar el recorrido con la figura del pirata. Los niños no caminan sobre los bloques. Permitir ajustar el camino hasta que puedan recorrerlo con la figura.",
      closingQuestion: "¿Qué pudimos resolver al construir juntos?",
      completionCriteria: "El grupo construyó un camino continuo y la figura pudo llegar a la isla.",
      briefInstruction: "Construyan juntos un camino con bloques y pruébenlo con la figura del pirata.",
    },
  },
  {
    order: 4,
    title: "No dejamos a nadie atrás",
    focus: "No dejamos a nadie atrás",
    situation: "La tripulación necesita encontrar parejas de dibujos para continuar. Algunos ya encontraron la suya, pero a una compañera todavía le cuesta.",
    question: "¿Qué pueden hacer los demás?",
    alternatives: [
      "Seguir el camino y dejarla buscando sola.",
      "Ayudarla a buscar para que todos puedan continuar.",
      "Decirle que se apure.",
    ],
    correctIndex: 1,
    teaching: "¡Así se cuida una tripulación! Aunque algunos ya terminaron, pueden ayudar a quien todavía lo necesita. La misión termina cuando todos lo logran.",
    wrongFeedback: "Todavía hay una compañera buscando su pareja. ¿Cómo podrían ayudarla para continuar todos juntos?",
    situationImage: "/recursos/misiones/m4-situacion.png",
    solutionImage: "/recursos/misiones/m4-solucion.png",
    situationAlt: "Niños sosteniendo tarjetas con dibujos de estrellas, conchas, peces y anclas; una niña con tarjetas de barcos.",
    solutionAlt: "Niños mostrando sus dibujos encontrados y ayudando a una compañera a completar la pareja de barcos.",
    activity: {
      name: "Encontramos todas las parejas",
      materials: "Un juego con tantas parejas de dibujos como integrantes tenga el grupo. Por ejemplo, para seis niños, seis parejas.",
      preparation: "Colocar las tarjetas boca arriba, mezcladas y visibles sobre una mesa o en el suelo.",
      instruction: "Cada uno debe encontrar una pareja de dibujos iguales. Solo pueden recoger una pareja por persona. Si ya encontraron la suya, ayuden a quienes todavía están buscando. ¡Terminamos cuando todos tengan una pareja!",
      guidance: "Participa solamente el grupo encargado de esta misión. Quienes ya tienen su pareja pueden señalar una tarjeta, dar una pista o buscar junto a un compañero. No deben recoger la pareja por él ni acumular parejas adicionales. No convertir esta actividad en un juego de memoria con tarjetas boca abajo.",
      closingQuestion: "Cuando terminaron de encontrar su pareja, ¿cómo ayudaron a los demás?",
      completionCriteria: "Cada integrante tiene una pareja de dibujos.",
      briefInstruction: "Cada uno encuentra una pareja de dibujos. Si ya tienes la tuya, ayuda con pistas a quienes siguen buscando.",
    },
  },
  {
    order: 5,
    title: "El logro es de todos",
    focus: "El logro es de todos",
    situation: "Cada integrante de la tripulación tiene una pieza de un dibujo que muestra dónde está el tesoro. El pirata tiene una sola pieza.",
    question: "¿Qué necesitan hacer para ver el dibujo completo?",
    alternatives: [
      "Mirar solamente la pieza del pirata.",
      "Guardar cada uno su pieza.",
      "Juntar las piezas de toda la tripulación.",
    ],
    correctIndex: 2,
    teaching: "¡Eso es! Cada pieza ayuda a completar el dibujo. Cuando todos aportan la suya, la tripulación puede descubrir dónde está el tesoro. ¡Lo lograron entre todos!",
    wrongFeedback: "Con una sola pieza no pueden ver todo el dibujo. ¿Qué podrían hacer con las piezas que tienen los demás?",
    situationImage: "/recursos/misiones/m5-situacion.png",
    solutionImage: "/recursos/misiones/m5-solucion.png",
    situationAlt: "Pirata y niños sosteniendo piezas de un rompecabezas de isla con tesoro.",
    solutionAlt: "Tripulación arman juntos el rompecabezas de la isla con el cofre del tesoro.",
    activity: {
      name: "Completamos el rompecabezas",
      materials: "Un rompecabezas sencillo con tantas piezas como integrantes tenga el grupo, preferentemente con una imagen del cofre o de la isla del tesoro. Una imagen de referencia, si se necesita.",
      preparation: "Entregar una pieza a cada integrante y preparar un espacio común para armar el rompecabezas.",
      instruction: "Cada uno tiene una pieza del tesoro. Armen el rompecabezas juntos: cada integrante debe colocar su propia pieza. Pueden ayudarse a descubrir dónde va, pero todos deben participar.",
      guidance: "Participa solamente el grupo encargado de esta misión. Los compañeros pueden dar pistas o señalar un lugar, sin quitarle la pieza ni sustituir a quien la está colocando. La persona adulta puede ofrecer el apoyo necesario para que cada niño participe.",
      closingQuestion: "¿Habríamos podido completar el dibujo si faltaba la pieza de alguien?",
      completionCriteria: "El rompecabezas está armado y cada integrante participó colocando su pieza.",
      briefInstruction: "Armen el rompecabezas juntos. Cada integrante coloca su pieza y puede recibir ayuda de sus compañeros.",
    },
  },
];

export function getMission(order: number): Mission {
  return missions.find((m) => m.order === order) ?? missions[0];
}
