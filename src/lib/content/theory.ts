import { MISSIONS } from "./missions";

export interface TheorySection {
  title: string;
  points: string[];
}

const NUTRIENTES: TheorySection = {
  title: "Los nutrientes",
  points: [
    "Alimento: lo que comemos. Nutriente: sustancia del alimento que usan las células.",
    "Glúcidos (función energética): sencillos (glucosa, sacarosa, lactosa) dan energía rápida; complejos (almidón, glucógeno, celulosa/fibra) la liberan poco a poco.",
    "Lípidos (energética y de reserva, 9 kcal/g): grasas saturadas (animales) e insaturadas (aceites vegetales, pescado azul). El colesterol forma membranas.",
    "Proteínas (función estructural o plástica, 4 kcal/g): construyen y reparan tejidos. Están en carne, pescado, huevos, legumbres.",
    "Vitaminas y sales minerales (función reguladora): no aportan energía; se necesitan en poca cantidad. Su falta causa enfermedades carenciales (escorbuto, raquitismo, anemia).",
    "Agua: unos 2/3 del cuerpo; transporta sustancias, regula la temperatura. Necesitamos unos 2–2,5 L al día.",
  ],
};

const ENERGIA: TheorySection = {
  title: "Energía y necesidades",
  points: [
    "Aporte energético: glúcidos 4 kcal/g, proteínas 4 kcal/g, lípidos 9 kcal/g.",
    "Metabolismo basal: energía mínima para mantener vivo el cuerpo en reposo (≈ 1 kcal por kg y hora).",
    "Gasto total = metabolismo basal + energía de la actividad física.",
    "Si comemos más energía de la que gastamos, se acumula como grasa; si menos, se pierde peso.",
    "Las necesidades dependen de la edad, el sexo, el peso y la actividad.",
  ],
};

const DIETAS: TheorySection = {
  title: "La dieta equilibrada",
  points: [
    "Reparto de energía: 50–55 % glúcidos, 30–35 % lípidos, 12–15 % proteínas.",
    "Reparto del día: desayuno ~25 %, media mañana ~10 %, comida ~30–35 %, merienda ~10 %, cena ~20–25 %.",
    "Dieta mediterránea: aceite de oliva, frutas, verduras, legumbres, cereales integrales, pescado; poca carne roja y dulces.",
    "Pirámide alimentaria: en la base lo que se toma a diario; en la cima lo ocasional.",
    "Dieta variada + agua + actividad física diaria.",
  ],
};

const CONSUMO: TheorySection = {
  title: "Consumo responsable",
  points: [
    "La etiqueta indica ingredientes (de mayor a menor cantidad), información nutricional por 100 g, alérgenos y fecha.",
    "Fecha de caducidad: no consumir después. Consumo preferente: puede perder calidad pero es seguro.",
    "Conservación: frío (refrigeración, congelación), calor (pasteurización, esterilización), deshidratación, salazón, ahumado, aditivos.",
    "Aditivos: se identifican con la letra E y un número (conservantes, colorantes, edulcorantes…).",
    "La publicidad puede engañar: compara siempre los valores nutricionales.",
  ],
};

const SALUD: TheorySection = {
  title: "Alimentación y salud",
  points: [
    "IMC = peso (kg) ÷ altura² (m). Normal entre 18,5 y 24,9; ≥ 25 sobrepeso; ≥ 30 obesidad.",
    "Trastornos de la conducta alimentaria: anorexia (rechazo a comer) y bulimia (atracones y vómitos).",
    "Enfermedades por exceso: obesidad, diabetes tipo 2, colesterol alto, caries, hipertensión (exceso de sal).",
    "Enfermedades carenciales: por falta de vitaminas o minerales.",
    "Intoxicaciones alimentarias (como la salmonelosis): se evitan con higiene y buena conservación.",
  ],
};

const DIGESTION: TheorySection = {
  title: "Cómo investigar (método científico)",
  points: [
    "Pregunta → hipótesis → experimento → resultados → conclusión.",
    "Variable independiente: la que cambias. Dependiente: la que mides. El resto se mantiene igual (control).",
    "La bilis emulsiona las grasas: las divide en gotitas para que las enzimas las digieran mejor.",
  ],
};

const BY_MISSION: Record<string, TheorySection[]> = {
  nutrientes: [NUTRIENTES],
  necesidades: [ENERGIA, NUTRIENTES],
  dietas: [DIETAS, ENERGIA],
  consumo: [CONSUMO],
  salud: [SALUD],
  retos: [NUTRIENTES, SALUD, DIGESTION],
};

export function theoryForExercise(exerciseId: string): TheorySection[] {
  const mission = MISSIONS.find((m) => m.exercises.some((e) => e.id === exerciseId));
  return (mission && BY_MISSION[mission.id]) ?? [NUTRIENTES];
}
