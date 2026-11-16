import type { Mission } from "./types";

export const MISSIONS: Mission[] = [
  {
    id: "nutrientes",
    number: 1,
    title: "Nutrientes al detalle",
    subtitle: "Glúcidos, lípidos, proteínas, sales, agua y vitaminas",
    icon: "apple",
    exercises: [
      {
        id: "n1",
        kind: "classify",
        skills: ["conceptos"],
        context:
          "Tu primo pequeño dice muy convencido: «la leche es un nutriente». Para ayudarle, separa lo que comemos (alimentos) de las sustancias que contienen (nutrientes).",
        prompt: "Clasifica cada término como alimento o como nutriente.",
        categories: ["Alimento", "Nutriente"],
        items: [
          { label: "Patatas", category: 0 },
          { label: "Almidón", category: 1 },
          { label: "Carne", category: 0 },
          { label: "Proteínas", category: 1 },
          { label: "Colesterol", category: 1 },
          { label: "Leche", category: 0 },
          { label: "Vitamina C", category: 1 },
          { label: "Azúcar de mesa", category: 0 },
        ],
        explanation:
          "Los alimentos son lo que comemos; los nutrientes (principios inmediatos) son las sustancias que contienen y que usan las células: glúcidos como el almidón, lípidos como el colesterol, proteínas, vitaminas, sales y agua.",
      },
      {
        id: "n2",
        kind: "choice",
        skills: ["vida", "conceptos"],
        context:
          "Marta va a correr una carrera de 10 km dentro de dos horas y quiere un desayuno que le dé energía durante toda la prueba, no solo al principio.",
        prompt: "¿Qué desayuno le recomendarías?",
        options: [
          "Tostadas de pan integral con aceite de oliva y una pieza de fruta",
          "Un zumo industrial y un puñado de caramelos",
          "Huevos fritos con beicon",
          "Solo un vaso de agua para no sentirse pesada",
        ],
        answer: 0,
        explanation:
          "El pan integral es rico en almidón, un glúcido complejo que libera glucosa poco a poco. Los caramelos son glúcidos sencillos: dan energía rápida pero dura poco. Huevos y beicon aportan sobre todo proteínas y grasas, de digestión lenta.",
      },
      {
        id: "n3",
        kind: "classify",
        skills: ["conceptos"],
        context: "En la etiqueta de varios productos aparecen distintos glúcidos.",
        prompt: "Clasifica cada glúcido o alimento según el tipo de glúcido que predomina.",
        categories: ["Glúcido sencillo", "Glúcido complejo"],
        items: [
          { label: "Miel (glucosa y fructosa)", category: 0 },
          { label: "Patata (almidón)", category: 1 },
          { label: "Azúcar de mesa (sacarosa)", category: 0 },
          { label: "Leche (lactosa)", category: 0 },
          { label: "Pan", category: 1 },
          { label: "Fruta (fructosa)", category: 0 },
          { label: "Pasta", category: 1 },
        ],
        explanation:
          "Monosacáridos (glucosa, fructosa) y disacáridos (lactosa, sacarosa) son glúcidos sencillos. El almidón de pan, pasta y patatas es un glúcido complejo formado por muchas moléculas de glucosa.",
      },
      {
        id: "n4",
        kind: "truefalse",
        skills: ["conceptos"],
        prompt: "Decide si cada afirmación sobre los lípidos es verdadera o falsa.",
        statements: [
          { text: "Las grasas saturadas suelen ser de origen animal.", answer: true },
          { text: "El aceite de oliva es rico sobre todo en grasas saturadas.", answer: false },
          { text: "Algunos lípidos forman parte de las membranas de las células.", answer: true },
          { text: "Todos los lípidos sirven únicamente como combustible.", answer: false },
          { text: "La vitamina A y la testosterona son de naturaleza lipídica.", answer: true },
        ],
        explanation:
          "Los lípidos tienen función energética, pero también estructural (membranas) y reguladora (hormonas como la testosterona, vitaminas como la A). Las grasas insaturadas, como las del aceite de oliva, suelen ser de origen vegetal.",
      },
      {
        id: "n5",
        kind: "choice",
        skills: ["razonar", "vida"],
        context:
          "Iker se ha hecho vegetariano y su única fuente de proteínas son las lentejas, que come casi a diario.",
        prompt: "¿Qué le dirías desde el punto de vista nutricional?",
        options: [
          "Que las legumbres pueden ser deficitarias en algunos aminoácidos esenciales; conviene combinarlas con cereales como el arroz",
          "Que no hay ningún problema: las lentejas tienen todos los aminoácidos en la proporción perfecta",
          "Que las lentejas no contienen proteínas, solo glúcidos",
          "Que debe tomar más azúcar para compensar la falta de proteínas",
        ],
        answer: 0,
        explanation:
          "Las proteínas animales contienen una mezcla variada de aminoácidos, incluidos los esenciales. Las legumbres tienen proteínas, pero les faltan algunos aminoácidos; combinarlas con cereales (lentejas con arroz) completa el aporte.",
      },
      {
        id: "n6",
        kind: "match",
        skills: ["conceptos"],
        prompt: "Relaciona cada vitamina con su función principal.",
        pairs: [
          { left: "Vitamina A", right: "Proceso visual y piel en buen estado" },
          { left: "Vitamina D", right: "Calcificación de los huesos" },
          { left: "Vitamina C", right: "Antioxidante, conserva las mucosas" },
          { left: "Vitamina B12", right: "Formación de glóbulos rojos" },
          { left: "Vitamina B1", right: "Obtener energía de los nutrientes" },
        ],
        explanation:
          "Las vitaminas tienen función reguladora y se necesitan en cantidades muy pequeñas (µg o mg). La falta de vitamina C produce escorbuto; la de D afecta a los huesos.",
      },
      {
        id: "n7",
        kind: "choice",
        skills: ["razonar"],
        context:
          "Un náufrago tiene mucha sed y piensa beber agua del mar. Su compañero le dice que se deshidratará todavía más.",
        prompt: "¿Por qué tiene razón el compañero?",
        options: [
          "Porque fuera de las células habría mucha concentración de sales y el agua saldría de ellas por ósmosis",
          "Porque el agua de mar no contiene agua, solo sal",
          "Porque las sales minerales no tienen ninguna función en el cuerpo",
          "Porque el agua salada entra en exceso en las células y las hace explotar",
        ],
        answer: 0,
        explanation:
          "La concentración de sales regula la cantidad de agua que entra y sale de las células: es la ósmosis. Con mucha sal fuera, el agua sale de las células y estas se deshidratan.",
      },
      {
        id: "n8",
        kind: "match",
        skills: ["conceptos"],
        prompt: "Une cada nutriente con la función que mejor lo describe.",
        pairs: [
          { left: "Glúcidos", right: "Energética" },
          { left: "Proteínas", right: "Estructural (crecer y reparar tejidos)" },
          { left: "Vitaminas", right: "Reguladora" },
          { left: "Agua", right: "Transporte, disolvente y regular la temperatura" },
          { left: "Sales minerales", right: "Forman huesos y regulan el impulso nervioso" },
        ],
        explanation:
          "Cada nutriente cumple un papel: glúcidos y lípidos dan energía, las proteínas construyen, las vitaminas regulan, el agua transporta y disuelve, y las sales son a la vez estructurales y reguladoras.",
      },
    ],
  },
  {
    id: "necesidades",
    number: 2,
    title: "Energía y necesidades",
    subtitle: "Kilocalorías, metabolismo basal y balance de agua",
    icon: "flame",
    exercises: [
      {
        id: "e1",
        kind: "order",
        skills: ["conceptos"],
        prompt: "Ordena los nutrientes de mayor a menor energía que aporta cada gramo.",
        items: ["Lípidos (grasas)", "Proteínas", "Glúcidos"],
        topLabel: "Más kcal por gramo",
        bottomLabel: "Menos kcal por gramo",
        explanation: "1 g de grasa aporta 9 kcal, 1 g de proteínas 4 kcal y 1 g de glúcidos 3,75 kcal.",
      },
      {
        id: "e2",
        kind: "numeric",
        skills: ["calculo", "datos"],
        context:
          "Un yogur natural contiene: 3,5 g de grasas, 4,5 g de glúcidos y 3,2 g de proteínas. Recuerda: grasas 9 kcal/g, glúcidos 3,75 kcal/g, proteínas 4 kcal/g.",
        prompt: "¿Cuántas kilocalorías aporta el yogur? (redondea a un decimal)",
        answer: 61.2,
        tolerance: 0.6,
        unit: "kcal",
        explanation:
          "3,5 × 9 = 31,5 kcal; 4,5 × 3,75 = 16,9 kcal; 3,2 × 4 = 12,8 kcal. Total ≈ 61,2 kcal.",
      },
      {
        id: "e3",
        kind: "numeric",
        skills: ["calculo"],
        context:
          "Fórmula del metabolismo basal en mujeres: 55 + (9,5 × masa en kg) + (4,8 × estatura en cm) − (4,7 × edad). Lucía tiene 13 años, pesa 48 kg y mide 158 cm.",
        prompt: "Calcula el metabolismo basal diario de Lucía.",
        answer: 1208.3,
        tolerance: 3,
        unit: "kcal/día",
        explanation:
          "55 + (9,5 × 48) + (4,8 × 158) − (4,7 × 13) = 55 + 456 + 758,4 − 61,1 = 1208,3 kcal al día.",
      },
      {
        id: "e4",
        kind: "numeric",
        skills: ["calculo"],
        context:
          "Fórmula del metabolismo basal en hombres: 66,5 + (13,7 × masa en kg) + (5 × estatura en cm) − (6,7 × edad). Pablo tiene 14 años, pesa 55 kg y mide 165 cm.",
        prompt: "Calcula el metabolismo basal diario de Pablo.",
        answer: 1551.2,
        tolerance: 3,
        unit: "kcal/día",
        explanation:
          "66,5 + (13,7 × 55) + (5 × 165) − (6,7 × 14) = 66,5 + 753,5 + 825 − 93,8 = 1551,2 kcal al día.",
      },
      {
        id: "e5",
        kind: "choice",
        skills: ["razonar"],
        context: "Sara dice que hoy tiene más metabolismo basal porque ha jugado un partido de baloncesto.",
        prompt: "¿Tiene razón?",
        options: [
          "No: el metabolismo basal se mide en reposo total y en ayunas; el partido aumenta el gasto energético total, no el basal",
          "Sí: cuanto más deporte hace una persona en un día, mayor es su metabolismo basal ese día",
          "Sí, porque el metabolismo basal solo depende de la actividad física",
          "No, porque el metabolismo basal es igual en todas las personas",
        ],
        answer: 0,
        explanation:
          "El metabolismo basal es la energía mínima para mantener las funciones vitales en reposo. Depende de la masa, la estatura, la edad y el sexo. La actividad física se suma aparte al gasto energético diario.",
      },
      {
        id: "e6",
        kind: "numeric",
        skills: ["calculo", "datos", "vida"],
        context:
          "Un día normal ganamos 0,7 L de agua con los alimentos y 0,3 L por síntesis interna. Hoy, en un partido en pleno verano, Hugo pierde: orina 1,5 L, sudor 1,5 L, aire espirado 0,3 L y heces 0,2 L.",
        table: {
          caption: "Pérdidas de agua de Hugo hoy",
          headers: ["Vía", "Litros"],
          rows: [
            ["Orina", "1,5"],
            ["Sudor", "1,5"],
            ["Aire espirado", "0,3"],
            ["Heces", "0,2"],
          ],
        },
        prompt: "¿Cuántos litros tiene que beber Hugo para mantener el equilibrio diario de agua?",
        answer: 2.5,
        tolerance: 0.05,
        unit: "L",
        explanation:
          "Pierde 1,5 + 1,5 + 0,3 + 0,2 = 3,5 L. Alimentos y síntesis interna aportan 1 L, así que debe beber 3,5 − 1 = 2,5 L (1 L más que un día normal).",
      },
      {
        id: "e7",
        kind: "classify",
        skills: ["conceptos", "vida"],
        prompt: "¿Qué tipo de necesidad cubre principalmente cada alimento?",
        categories: ["Energética", "Estructural", "Reguladora"],
        items: [
          { label: "Pan", category: 0 },
          { label: "Aceite", category: 0 },
          { label: "Patatas", category: 0 },
          { label: "Carne", category: 1 },
          { label: "Pescado", category: 1 },
          { label: "Huevos", category: 1 },
          { label: "Naranja", category: 2 },
          { label: "Espinacas", category: 2 },
        ],
        explanation:
          "Energéticas: alimentos ricos en glúcidos y lípidos (pan, patatas, aceite). Estructurales: ricos en proteínas (carne, pescado, huevos). Reguladoras: frutas y verduras, ricas en vitaminas y sales.",
      },
      {
        id: "e8",
        kind: "numeric",
        skills: ["calculo", "vida"],
        context:
          "Un bollo industrial de merienda aporta 450 kcal. Caminando a buen ritmo gastas unas 4 kcal por minuto.",
        prompt: "¿Cuántos minutos tendrías que caminar para gastar la energía del bollo?",
        answer: 112.5,
        tolerance: 1,
        unit: "min",
        explanation: "450 ÷ 4 = 112,5 minutos: ¡casi dos horas caminando por un solo bollo!",
      },
    ],
  },
  {
    id: "dietas",
    number: 3,
    title: "Dietas que funcionan",
    subtitle: "Rueda de alimentos, pirámide y dieta mediterránea",
    icon: "salad",
    exercises: [
      {
        id: "d1",
        kind: "match",
        skills: ["conceptos"],
        prompt: "Coloca cada alimento en su grupo de la rueda de los alimentos.",
        pairs: [
          { left: "Queso", right: "Grupo I · Leche y derivados" },
          { left: "Huevo", right: "Grupo II · Carnes, pescados y huevos" },
          { left: "Lentejas", right: "Grupo III · Legumbres, tubérculos y frutos secos" },
          { left: "Lechuga", right: "Grupo IV · Hortalizas y verduras" },
          { left: "Naranja", right: "Grupo V · Frutas" },
          { left: "Arroz", right: "Grupo VI · Cereales, derivados y azúcar" },
          { left: "Mantequilla", right: "Grupo VII · Grasas y aceites" },
        ],
        explanation:
          "La rueda agrupa los alimentos según el nutriente que más aportan. Una dieta equilibrada incluye alimentos de todos los grupos.",
      },
      {
        id: "d2",
        kind: "classify",
        skills: ["conceptos", "vida"],
        prompt: "Según la pirámide alimentaria, ¿con qué frecuencia conviene tomar cada alimento?",
        categories: ["A diario", "Varias veces por semana", "Algunas veces al mes"],
        items: [
          { label: "Pan y cereales", category: 0 },
          { label: "Fruta", category: 0 },
          { label: "Aceite de oliva", category: 0 },
          { label: "Verduras", category: 0 },
          { label: "Pescado", category: 1 },
          { label: "Huevos", category: 1 },
          { label: "Queso y yogur", category: 1 },
          { label: "Carnes rojas", category: 2 },
          { label: "Dulces", category: 2 },
        ],
        explanation:
          "La base de la pirámide (a diario) son cereales, frutas, verduras, legumbres y aceite de oliva. Pescado, aves, huevos y lácteos, varias veces por semana. Carnes rojas y dulces, solo algunas veces al mes.",
      },
      {
        id: "d3",
        kind: "choice",
        skills: ["datos", "razonar"],
        context: "Dos familias anotan qué porcentaje de su dieta semanal ocupa cada producto.",
        table: {
          headers: ["Producto", "Dieta A", "Dieta B"],
          rows: [
            ["Pan", "10 %", "10 %"],
            ["Arroz", "20 %", "2 %"],
            ["Legumbres", "20 %", "2 %"],
            ["Verdura", "10 %", "1 %"],
            ["Fruta", "4 %", "3 %"],
            ["Pescado", "5 %", "5 %"],
            ["Huevos", "3 %", "10 %"],
            ["Carne", "5 %", "30 %"],
            ["Queso", "7 %", "17 %"],
            ["Aceite de oliva", "16 %", "—"],
            ["Mantequilla", "—", "20 %"],
          ],
        },
        prompt: "¿Qué dieta es más saludable y por qué?",
        options: [
          "La A: más cereales, legumbres y verdura, aceite de oliva y poca carne",
          "La B: tiene más proteínas porque incluye mucha carne y queso",
          "Las dos son iguales porque tienen el mismo porcentaje de pan",
          "La B: la mantequilla aporta más vitaminas que el aceite de oliva",
        ],
        answer: 0,
        explanation:
          "La dieta A tiene una proporción adecuada de alimentos ricos en glúcidos complejos, legumbres y verduras, usa aceite de oliva (grasas insaturadas) y poca carne. La B abusa de carne, queso y mantequilla: muchas grasas saturadas.",
      },
      {
        id: "d4",
        kind: "multi",
        skills: ["conceptos", "vida"],
        prompt: "¿Por qué se dice que la dieta mediterránea es saludable? Marca todas las razones correctas.",
        options: [
          "Usa aceite de oliva, rico en grasas insaturadas",
          "Incluye muchas frutas, verduras y legumbres, ricas en fibra y vitaminas",
          "El pescado aporta proteínas con menos colesterol que la carne",
          "Sus cereales aportan glúcidos complejos",
          "Se basa en carne roja y mantequilla a diario",
          "Incluye dulces en todas las comidas",
        ],
        answer: [0, 1, 2, 3],
        explanation:
          "La dieta mediterránea previene enfermedades cardiovasculares, el estreñimiento y la obesidad gracias a las verduras, frutas, legumbres, cereales, pescado y aceite de oliva, con poca carne y pocas grasas saturadas.",
      },
      {
        id: "d5",
        kind: "choice",
        skills: ["vida", "razonar"],
        context:
          "El comedor de tu instituto te pide ayuda para elegir el menú del viernes. Ese día los alumnos tienen educación física por la tarde.",
        prompt: "¿Qué menú propondrías?",
        options: [
          "Paella de verduras y pollo, ensalada, pan y una naranja",
          "Hamburguesa doble con patatas fritas y refresco",
          "Pizza de embutido y helado",
          "Solo una ensalada de lechuga para no pesar en clase",
        ],
        answer: 0,
        explanation:
          "La paella con ensalada es un ejemplo de dieta mediterránea: glúcidos complejos (arroz, pan) para la energía de la tarde, proteínas (pollo), vitaminas y fibra (verdura, fruta). La ensalada sola se queda corta de energía.",
      },
      {
        id: "d6",
        kind: "multi",
        skills: ["vida"],
        prompt: "Marca las recomendaciones que forman parte de una dieta equilibrada.",
        options: [
          "Diversificar los alimentos",
          "Repartir la comida en varias comidas al día",
          "Consumir alimentos ricos en fibra",
          "Reducir las grasas saturadas e incluir insaturadas",
          "Saltarse el desayuno para comer más a mediodía",
          "Tomar platos precocinados a diario porque son cómodos",
        ],
        answer: [0, 1, 2, 3],
        explanation:
          "Además: tomar alimentos vegetales frescos y evitar el exceso de precocinados y productos muy refinados. Saltarse comidas no ayuda: es mejor repartir la energía a lo largo del día.",
      },
      {
        id: "d7",
        kind: "choice",
        skills: ["vida", "razonar"],
        context: "Al abuelo de Nora le han diagnosticado un problema cardiovascular y el médico le pide cambiar su dieta.",
        prompt: "¿Qué cambio es el más adecuado?",
        options: [
          "Reducir huevos, marisco, carnes y grasas animales; tomar más pescado azul y aceite de oliva",
          "Tomar más mantequilla y embutidos, porque dan energía al corazón",
          "Eliminar todas las frutas y verduras",
          "Comer solo carne roja para tener más proteínas",
        ],
        answer: 0,
        explanation:
          "Necesita una dieta baja en colesterol: menos alimentos de origen animal ricos en grasa y más grasas insaturadas, como las del pescado azul y el aceite de oliva.",
      },
    ],
  },
  {
    id: "consumo",
    number: 4,
    title: "Consumidor/a crítico/a",
    subtitle: "Etiquetas, aditivos y publicidad",
    icon: "scan",
    exercises: [
      {
        id: "c1",
        kind: "choice",
        skills: ["datos", "vida"],
        context:
          "En la caja de unos cereales «de chocolate» pone: Ingredientes: azúcar, harina de trigo, cacao en polvo, aceite de palma, sal, emulgente (E-322).",
        prompt: "¿Cuál es el ingrediente que más hay en este producto?",
        options: ["El azúcar", "La harina de trigo", "El cacao", "No se puede saber con la etiqueta"],
        answer: 0,
        explanation:
          "La ley obliga a listar los ingredientes en orden decreciente de peso. El primero, el azúcar, es el más abundante: ¡son más azúcar que cereal!",
      },
      {
        id: "c2",
        kind: "match",
        skills: ["conceptos"],
        prompt: "Relaciona cada tipo de aditivo con su función.",
        pairs: [
          { left: "Conservantes", right: "Prolongan la duración del alimento" },
          { left: "Colorantes", right: "Dan un color atractivo" },
          { left: "Potenciadores del sabor", right: "Aumentan el sabor" },
          { left: "Estabilizantes", right: "Mantienen la textura y el aspecto" },
          { left: "Antioxidantes", right: "Evitan las alteraciones por oxidación" },
          { left: "Edulcorantes", right: "Dan sabor dulce (productos light)" },
        ],
        explanation:
          "Los aditivos aceptados en la Unión Europea aparecen en la etiqueta con la letra E seguida de un número.",
      },
      {
        id: "c3",
        kind: "numeric",
        skills: ["calculo", "datos", "vida"],
        context:
          "La información nutricional de unos cereales indica 30 g de azúcares por cada 100 g. Una ración son 40 g. Un terrón de azúcar pesa unos 4 g.",
        prompt: "¿A cuántos terrones de azúcar equivale una ración?",
        answer: 3,
        tolerance: 0.05,
        unit: "terrones",
        explanation: "40 g × 30/100 = 12 g de azúcar por ración. 12 ÷ 4 = 3 terrones.",
      },
      {
        id: "c4",
        kind: "choice",
        skills: ["vida", "razonar"],
        context:
          "Un anuncio presenta unas galletas como «100 % naturales, fuente de energía y comprobadas por expertos».",
        prompt: "¿Qué hace un consumidor responsable antes de comprarlas?",
        options: [
          "Leer la lista de ingredientes y la información nutricional de la etiqueta",
          "Comprarlas: si lo dice el anuncio, es verdad",
          "Fijarse solo en si el envase es bonito",
          "Elegir siempre la marca más cara",
        ],
        answer: 0,
        explanation:
          "La publicidad influye en lo que compramos. La etiqueta, que es obligatoria, da los datos reales: ingredientes, cantidad de nutrientes, aditivos, fecha de consumo…",
      },
      {
        id: "c5",
        kind: "truefalse",
        skills: ["conceptos", "vida"],
        prompt: "¿Qué datos debe incluir obligatoriamente la etiqueta de un alimento?",
        statements: [
          { text: "La denominación del producto.", answer: true },
          { text: "La cantidad del producto, en peso o volumen.", answer: true },
          { text: "Los ingredientes en orden decreciente de peso.", answer: true },
          { text: "La opinión de un famoso que lo recomienda.", answer: false },
          { text: "El modo de empleo, cuando sea necesario.", answer: true },
          { text: "Una receta para cocinarlo.", answer: false },
        ],
        explanation:
          "La etiqueta es garantía de seguridad: denominación, cantidad, ingredientes, fecha de caducidad o consumo preferente, conservación, fabricante y modo de empleo si hace falta.",
      },
      {
        id: "c6",
        kind: "choice",
        skills: ["datos", "vida"],
        context: "En el súper comparas dos bebidas de naranja (por cada 100 mL).",
        table: {
          headers: ["", "Zumo 100 % exprimido", "Bebida sabor naranja"],
          rows: [
            ["Zumo de fruta", "100 %", "12 %"],
            ["Azúcares añadidos", "0 g", "9 g"],
            ["Vitamina C", "40 mg", "6 mg"],
            ["Aditivos", "Ninguno", "E-330, E-211, E-110"],
          ],
        },
        prompt: "¿Qué conclusión es correcta?",
        options: [
          "El zumo exprimido es mejor opción: sin azúcares añadidos ni aditivos y con más vitamina C",
          "La bebida es mejor porque tiene más aditivos que la conservan",
          "Son iguales porque los dos son de naranja",
          "La bebida es mejor porque tiene colorante y parece más naranja",
        ],
        answer: 0,
        explanation:
          "Comparar etiquetas permite decidir con datos. La bebida apenas tiene fruta, añade azúcar y lleva conservante (E-211) y colorante (E-110). Aun así, mejor la fruta entera, que conserva la fibra.",
      },
      {
        id: "c7",
        kind: "order",
        skills: ["conceptos"],
        prompt: "Ordena las etapas de la cadena de suministro de un alimento, desde el campo hasta tu mesa.",
        items: ["Producción (agricultura, ganadería, pesca)", "Transformación y envasado", "Distribución y transporte", "Venta en la tienda", "Consumo en casa"],
        topLabel: "Empieza aquí",
        bottomLabel: "Termina aquí",
        explanation:
          "En cada eslabón hay que mantener la higiene y la conservación (por ejemplo, la cadena de frío) para que el alimento llegue seguro.",
      },
    ],
  },
  {
    id: "salud",
    number: 5,
    title: "Alimentación y salud",
    subtitle: "Enfermedades, trastornos e intolerancias",
    icon: "heart",
    exercises: [
      {
        id: "s1",
        kind: "match",
        skills: ["conceptos", "vida"],
        prompt: "Relaciona cada hábito con la consecuencia que puede provocar.",
        pairs: [
          { left: "Abusar de grasas y glúcidos", right: "Obesidad" },
          { left: "Falta de higiene alimentaria", right: "Intoxicación" },
          { left: "Falta de frutas y verduras frescas", right: "Escorbuto" },
          { left: "Comer alimentos sin fibra", right: "Estreñimiento" },
          { left: "Exceso de alimentos ricos en colesterol", right: "Enfermedades circulatorias" },
        ],
        explanation:
          "Una dieta inadecuada puede causar enfermedades graves. La obesidad, a su vez, puede originar problemas circulatorios y diabetes.",
      },
      {
        id: "s2",
        kind: "classify",
        skills: ["conceptos", "razonar"],
        prompt: "¿Es un problema nutricional típico de los países desarrollados o de los países en desarrollo?",
        categories: ["Países desarrollados", "Países en desarrollo"],
        items: [
          { label: "Contenido calórico muy elevado", category: 0 },
          { label: "Bajo contenido calórico", category: 1 },
          { label: "Exceso de colesterol y grasas saturadas", category: 0 },
          { label: "Poca variedad de alimentos", category: 1 },
          { label: "Abuso de alimentos refinados", category: 0 },
          { label: "Bajo consumo de proteínas", category: 1 },
          { label: "Platos preparados con muchos aditivos", category: 0 },
          { label: "Condiciones sanitarias deficientes", category: 1 },
        ],
        explanation:
          "Mientras una parte de la humanidad pasa hambre (desnutrición), otra sufre problemas por exceso y mala calidad de la dieta.",
      },
      {
        id: "s3",
        kind: "choice",
        skills: ["conceptos"],
        context: "Álex come muchísimo, pero casi todo es bollería, refrescos y comida rápida. Se cansa enseguida y enferma a menudo.",
        prompt: "¿Qué término describe mejor su situación?",
        options: ["Malnutrición", "Desnutrición", "Intolerancia alimentaria", "Alergia alimentaria"],
        answer: 0,
        explanation:
          "Malnutrición: alteración del funcionamiento del organismo por una ingestión inadecuada de alimentos (aunque sean muchos). Desnutrición: falta de nutrientes esenciales para cubrir las necesidades.",
      },
      {
        id: "s4",
        kind: "choice",
        skills: ["razonar"],
        prompt: "¿Cómo puede originarse la diabetes tipo II?",
        options: [
          "Por consumir azúcar en exceso durante años: las células dejan de responder a la insulina y sube la glucosa en sangre",
          "Por beber demasiada agua",
          "Por una falta de vitamina C",
          "Por comer demasiada fibra",
        ],
        answer: 0,
        explanation:
          "La insulina retira el exceso de glucosa de la sangre. Si las células están sobreexpuestas a ella durante mucho tiempo, dejan de ser sensibles y aparece la hiperglucemia.",
      },
      {
        id: "s5",
        kind: "multi",
        skills: ["vida", "razonar"],
        context:
          "Tu amiga Carla es celíaca (intolerante al gluten, una proteína del trigo y otros cereales). En tu cumpleaños hay varias cosas para picar.",
        prompt: "¿Qué puede comer Carla sin problema? Marca todas las correctas.",
        options: [
          "Palomitas de maíz",
          "Fruta troceada",
          "Arroz con verduras",
          "Bizcocho de harina de trigo",
          "Croquetas rebozadas con pan rallado",
          "Bocadillos de pan normal",
        ],
        answer: [0, 1, 2],
        explanation:
          "El maíz, el arroz y la fruta no tienen gluten. El trigo sí, así que bizcocho, rebozados y pan normal le provocarían trastornos intestinales. Existen productos elaborados con harinas sin gluten.",
      },
      {
        id: "s6",
        kind: "choice",
        skills: ["conceptos", "vida"],
        context:
          "Una chica se ve gorda aunque tiene un peso muy bajo, restringe muchísimo lo que come y hace ejercicio en exceso.",
        prompt: "¿Con qué trastorno de la conducta alimentaria se relacionan estos síntomas?",
        options: ["Anorexia", "Bulimia", "Celiaquía", "Escorbuto"],
        answer: 0,
        explanation:
          "La anorexia se caracteriza por una imagen distorsionada del cuerpo y una restricción extrema de la comida. En la bulimia hay atracones seguidos de conductas para compensarlos. Ante cualquier señal, hay que pedir ayuda a un adulto o profesional.",
      },
      {
        id: "s7",
        kind: "truefalse",
        skills: ["vida"],
        prompt: "Sobre intoxicaciones alimentarias, ¿verdadero o falso?",
        statements: [
          { text: "Romper la cadena de frío favorece la multiplicación de microorganismos.", answer: true },
          { text: "Lavarse las manos antes de cocinar ayuda a prevenirlas.", answer: true },
          { text: "Si un alimento huele bien, nunca puede estar contaminado.", answer: false },
          { text: "Una lata hinchada se puede consumir sin problema.", answer: false },
        ],
        explanation:
          "La higiene en la manipulación y conservación es clave. Algunos alimentos contaminados no huelen ni saben distinto; una lata abombada puede indicar bacterias peligrosas.",
      },
    ],
  },
  {
    id: "retos",
    number: 6,
    title: "Retos competenciales",
    subtitle: "Textos, datos y experimentos para pensar",
    icon: "flask",
    exercises: [
      {
        id: "r1",
        kind: "multi",
        skills: ["datos", "conceptos"],
        reading: {
          title: "La función de las grasas",
          text:
            "No todos los lípidos son simplemente material «combustible». Gran parte de ellos forman las membranas celulares, y otros son hormonas, como la testosterona, o vitaminas, como la A. Las grasas neutras son las únicas que funcionan como reserva energética, pero además son muy útiles como aislantes térmicos y como amortiguadoras de golpes. Forman el panículo adiposo bajo la piel de todo el cuerpo, especialmente grueso en la palma de la mano y en la planta de los pies.",
        },
        prompt: "Según el texto, ¿qué funciones cumplen las grasas neutras? Marca todas.",
        options: [
          "Reserva y combustible energético",
          "Aislante térmico",
          "Amortiguador de golpes",
          "Transportar el oxígeno por la sangre",
          "Digerir las proteínas",
        ],
        answer: [0, 1, 2],
        explanation:
          "El texto cita tres funciones de las grasas neutras: reserva energética, aislante térmico y amortiguador frente a golpes.",
      },
      {
        id: "r2",
        kind: "choice",
        skills: ["razonar"],
        context: "Piensa en el texto de las grasas: un mamífero vive por encima del paralelo 60° (Ártico) y otro en el paralelo 0° (Ecuador).",
        prompt: "¿Cuál tendrá el panículo adiposo más grueso?",
        options: [
          "El del paralelo 60°, porque el panículo actúa como aislante térmico y evita perder calor en el frío",
          "El del paralelo 0°, porque hace más calor y necesita más grasa",
          "Los dos igual, porque el panículo no depende del clima",
          "El del paralelo 60°, porque así digiere mejor",
        ],
        answer: 0,
        explanation:
          "En climas fríos un panículo adiposo grueso evita la pérdida de calor interno, como ocurre en focas u osos polares.",
      },
      {
        id: "r3",
        kind: "choice",
        skills: ["razonar", "vida"],
        context:
          "Si golpeas la arista de una mesa con la palma de la mano apenas te duele, pero con el dorso, con la misma fuerza, duele mucho y puede salir un moratón.",
        prompt: "¿A qué se debe?",
        options: [
          "En la palma el panículo adiposo es más grueso y amortigua el golpe",
          "En el dorso hay más grasa y por eso duele más",
          "La palma no tiene nervios",
          "Es casualidad: depende del día",
        ],
        answer: 0,
        explanation:
          "El panículo adiposo de la palma es más grueso; por su función amortiguadora nos permite agarrar con fuerza objetos con aristas sin sentir dolor.",
      },
      {
        id: "r4",
        kind: "numeric",
        skills: ["calculo", "datos"],
        context:
          "El Índice de Masa Corporal se calcula así: IMC = masa (kg) ÷ [estatura (m)]². Antonio tiene 14 años, mide 1,62 m y su masa es de 72 kg.",
        prompt: "Calcula el IMC de Antonio (con un decimal).",
        answer: 27.4,
        tolerance: 0.15,
        unit: "kg/m²",
        explanation: "1,62² = 2,62. 72 ÷ 2,62 ≈ 27,4.",
      },
      {
        id: "r5",
        kind: "choice",
        skills: ["datos"],
        table: {
          caption: "Clasificación según el IMC (libro de texto)",
          headers: ["Clasificación", "IMC"],
          rows: [
            ["Delgadez", "menor de 20"],
            ["Masa normal", "entre 20 y 22,5"],
            ["Sobrepeso", "entre 22,5 y 25"],
            ["Obesidad", "superior a 25"],
            ["Obesidad peligrosa", "superior a 40"],
          ],
        },
        prompt: "Con un IMC de 27,4, ¿en qué grupo está Antonio según esta tabla?",
        options: ["Obesidad", "Sobrepeso", "Masa normal", "Obesidad peligrosa"],
        answer: 0,
        explanation:
          "27,4 es mayor que 25 pero menor que 40: según la tabla, Antonio tiene obesidad, no solo sobrepeso. Por eso el médico le recomienda menos grasas y más actividad física.",
      },
      {
        id: "r6",
        kind: "classify",
        skills: ["vida"],
        prompt: "¿Qué alimentos aconsejarías a Antonio y cuáles debería evitar?",
        categories: ["Aconsejar", "Evitar"],
        items: [
          { label: "Hamburguesas", category: 1 },
          { label: "Fruta", category: 0 },
          { label: "Salchichón", category: 1 },
          { label: "Judías verdes", category: 0 },
          { label: "Pescado", category: 0 },
          { label: "Mantequilla", category: 1 },
          { label: "Ensaladas", category: 0 },
          { label: "Bollos", category: 1 },
          { label: "Cereales", category: 0 },
          { label: "Queso curado", category: 1 },
          { label: "Macarrones", category: 0 },
          { label: "Galletas", category: 1 },
        ],
        explanation:
          "Se aconsejan alimentos pobres en grasas (fruta, verdura, pescado, ensaladas, cereales, pasta) y se evitan los ricos en grasas (hamburguesas, embutidos, mantequilla, bollos, galletas, queso curado).",
      },
      {
        id: "r7",
        kind: "numeric",
        skills: ["calculo", "datos"],
        context: "Usando la misma tabla, la masa normal corresponde a un IMC entre 20 y 22,5.",
        prompt: "¿Cuál es la masa máxima que puede tener una persona de 1,80 m para seguir en «masa normal»?",
        answer: 72.9,
        tolerance: 0.2,
        unit: "kg",
        explanation:
          "Despejamos: masa = IMC × estatura². 22,5 × 1,80² = 22,5 × 3,24 = 72,9 kg. (La mínima sería 20 × 3,24 = 64,8 kg.)",
      },
      {
        id: "r8",
        kind: "multi",
        skills: ["razonar", "datos"],
        context:
          "Unos estudiantes quieren saber si la bilis ayuda a digerir las grasas. Tubo A: leche + indicador + 3 mL de extracto de páncreas. Tubo B: leche + indicador + 1 mL de extracto de páncreas + bilis. El indicador pasa de rosa a amarillo cuando la grasa se ha digerido. El tubo B cambia a los 3 minutos y el A a los 9. Concluyen: «la bilis ayuda a la lipasa a digerir las grasas».",
        prompt: "¿Por qué su experimento no permite sacar esa conclusión? Marca todas las razones correctas.",
        options: [
          "Deberían haber puesto la misma cantidad de extracto de páncreas en los dos tubos",
          "Les falta un tubo control solo con leche e indicador",
          "Deberían haber puesto más indicador en el tubo A",
          "El experimento es perfecto, la conclusión es correcta",
        ],
        answer: [0, 1],
        explanation:
          "En un experimento solo debe cambiar una variable (la bilis). Además, un tubo control permite comprobar que el cambio de color no ocurre solo. La cantidad de indicador no es la clave.",
      },
      {
        id: "r9",
        kind: "choice",
        skills: ["razonar", "conceptos"],
        context: "A una persona le han extirpado la vesícula biliar, donde se almacena la bilis que fabrica el hígado.",
        prompt: "¿Cómo influirá en su digestión?",
        options: [
          "Le costará más digerir las grasas, porque la bilis las emulsiona y facilita su digestión",
          "No podrá digerir grasas en absoluto",
          "Afectará sobre todo a la digestión de las proteínas",
          "No influirá en nada",
        ],
        answer: 0,
        explanation:
          "El hígado sigue fabricando bilis, pero no se almacena para liberarse cuando comemos. La digestión y absorción de grasas se reduce, por eso se recomiendan comidas bajas en grasa.",
      },
    ],
  },
];

export const ALL_EXERCISES = MISSIONS.flatMap((m) => m.exercises);

export function getMission(id: string) {
  return MISSIONS.find((m) => m.id === id);
}

export function missionOfExercise(exerciseId: string) {
  return MISSIONS.find((m) => m.exercises.some((e) => e.id === exerciseId));
}
