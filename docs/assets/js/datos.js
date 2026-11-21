/* =============================================================================
   datos.js · Todas las cifras y listas que muestra el sitio
   -----------------------------------------------------------------------------
   Este archivo es la ÚNICA fuente de números del sitio. Si hay que corregir un
   valor, se corrige aquí y todos los gráficos se actualizan solos.

   Cada bloque indica de qué notebook y de qué celda viene el dato:
     T1 = "Taller sumativo I ETI195.ipynb"
     T2 = "TallerSumativo_2_Casen.ipynb"
     T3 = "Taller_sumativo_3_completo.ipynb"
     T4 = "Taller_sumativo_4_CASEN.ipynb"
   (las celdas se cuentan desde 0, igual que en Jupyter con nbformat)

   Convenciones:
     - Porcentajes y tasas de error en escala 0–100 (17.65 significa 17,65 %).
     - Los textos llevan tildes. Las frases del Taller 3 van SIN tildes porque
       así las recibió el modelo BETO y así las separó LIME en palabras.
     - Los valores marcados como "≈" se leyeron de un gráfico del notebook
       (no había tabla impresa); su precisión aproximada se indica al lado.

   Los conteos de la base (Taller 1 y 4) se pueden recalcular con:
     python scripts/calcular_datos_sitio.py
   ============================================================================ */

window.DATOS = {
  /* ---------------------------------------------------------------------------
     FICHA GENERAL DEL DATASET
     T1 celda 10 (dimensiones), T1 celda 15 (nulos), T2 celda 6 (clases).
     ------------------------------------------------------------------------- */
  dataset: {
    personas: 212471,
    variables: 42,
    nulos: 0,
    pobres: 37492,
    noPobres: 174979,
    pctPobreza: 17.65,
  },

  /* ---------------------------------------------------------------------------
     REGLA DE LA POBREZA MULTIDIMENSIONAL (simulador de la sección "Dataset")
     T2 celda 2: cinco dimensiones de 20 %, cada una con 4 indicadores de 5 %.
     Un hogar es pobre si la suma ponderada de carencias SUPERA el 20 %.
     ------------------------------------------------------------------------- */
  pobrezaMulti: {
    dimensiones: [
      'Educación',
      'Salud',
      'Trabajo y seguridad social',
      'Vivienda y entorno',
      'Redes y cohesión social',
    ],
    indicadoresPorDimension: 4,
    pesoIndicador: 5, // % del índice por indicador
    umbral: 20, // % — pobre si la suma es MAYOR que este valor
  },

  /* ---------------------------------------------------------------------------
     TALLER 1 · Exploración
     ------------------------------------------------------------------------- */
  taller1: {
    // Grupos por variable sensible.
    //   n       = personas en la base (T1 celda 19 y T4 celda 7)
    //   pobreza = % de esas personas en pobreza multidimensional (T4 celda 7)
    // El % de la muestra se calcula en app.js como n / personas.
    grupos: [
      {
        id: 'sexo',
        nombre: 'Sexo',
        nota: 'La muestra está equilibrada: 52,5 % mujeres y 47,5 % hombres, con tasas de pobreza casi iguales (17,8 % y 17,5 %).',
        categorias: [
          { nombre: 'Mujer', n: 111619, pobreza: 17.76 },
          { nombre: 'Hombre', n: 100852, pobreza: 17.52 },
        ],
      },
      {
        id: 'r3',
        nombre: 'Pueblo indígena',
        nota: 'Una de cada siete personas pertenece a un pueblo indígena (14,0 %). Su tasa de pobreza (23,8 %) supera en 7 puntos a la del resto.',
        categorias: [
          { nombre: 'No indígena', n: 182826, pobreza: 16.65 },
          { nombre: 'Indígena', n: 29645, pobreza: 23.82 },
        ],
      },
      {
        id: 'r1a',
        nombre: 'Nacionalidad',
        nota: 'Las personas extranjeras son el 5,8 % de la muestra, pero su pobreza multidimensional (32,1 %) casi duplica la de las personas chilenas (16,8 %).',
        categorias: [
          { nombre: 'Chilena', n: 197884, pobreza: 16.76 },
          { nombre: 'Chilena y otra', n: 2282, pobreza: 16.65 },
          { nombre: 'Extranjera', n: 12305, pobreza: 32.10 },
        ],
      },
      {
        id: 'area',
        nombre: 'Zona',
        nota: 'El 17,3 % vive en zonas rurales, donde la pobreza multidimensional llega a 21,5 %, frente a 16,8 % en zonas urbanas.',
        categorias: [
          { nombre: 'Urbana', n: 175672, pobreza: 16.84 },
          { nombre: 'Rural', n: 36799, pobreza: 21.49 },
        ],
      },
      {
        id: 'os1',
        nombre: 'Orientación sexual',
        nota: 'El 97,6 % se declara heterosexual. Gays, lesbianas, bisexuales y otras orientaciones suman 2.450 personas (1,2 %): muy pocas para sacar conclusiones confiables.',
        categorias: [
          { nombre: 'Heterosexual', n: 207339, pobreza: 17.64 },
          { nombre: 'Prefiere no responder', n: 2277, pobreza: 20.60 },
          { nombre: 'Gay o lesbiana', n: 1145, pobreza: 13.80 },
          { nombre: 'Bisexual', n: 1131, pobreza: 13.35 },
          { nombre: 'No sabe', n: 405, pobreza: 26.42 },
          { nombre: 'Otra', n: 174, pobreza: 18.97 },
        ],
      },
      {
        id: 'trans',
        nombre: 'Identidad trans',
        nota: 'Solo 54 personas se identifican como trans (0,03 %). Con grupos tan pequeños cualquier porcentaje es frágil, y la privacidad de cada persona queda expuesta.',
        categorias: [
          { nombre: 'No', n: 212380, pobreza: 17.64 },
          { nombre: 'Sí', n: 54, pobreza: 25.93 },
          { nombre: 'Prefiere no responder', n: 19, pobreza: 15.79 },
          { nombre: 'No sabe', n: 18, pobreza: 11.11 },
        ],
      },
      {
        id: 'h7e',
        nombre: 'Cuidado personal',
        nota: 'El 3,9 % declara alguna dificultad para su cuidado personal (asearse o vestirse). Su pobreza crece con la severidad: 24,3 %, 30,3 % y 32,0 %.',
        // Etiquetas del libro de códigos (hoja H, variable h7e)
        categorias: [
          { nombre: 'Ninguna dificultad', n: 204192, pobreza: 17.25 },
          { nombre: 'Algo de dificultad', n: 4611, pobreza: 24.29 },
          { nombre: 'Mucha dificultad', n: 2045, pobreza: 30.32 },
          { nombre: 'No puede hacerlo', n: 1623, pobreza: 31.98 },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------------------
     TALLER 2 · Sesgos, justicia y discriminación
     ------------------------------------------------------------------------- */
  taller2: {
    columnas: 141, // T2 celda 16 (después del one-hot)
    entrenamiento: 169976, // T2 celda 9
    prueba: 42495,
    accuracy: 93.59, // T2 celda 18

    // Matriz de confusión del árbol de decisión (T2 celda 19)
    matriz: { vn: 33674, fp: 1322, fn: 1403, vp: 6096 },

    // Reporte de clasificación (T2 celda 22), en %
    reporte: { precisionPobre: 82, recallPobre: 81 },

    // Métricas de equidad con Aequitas (T2 celda 26). Tasas en %.
    //   fnr = falsos negativos / pobres reales      (pobres no detectados)
    //   fdr = falsos positivos / predichos "pobre"  (alertas erróneas)
    //   disparidad = tasa del grupo / tasa del grupo de referencia
    aequitas: [
      {
        id: 'cuidado_personal',
        nombre: 'Cuidado personal',
        referencia: 'Sin dificultad',
        grupos: [
          { nombre: 'Sin dificultad', n: 40850, fnr: 17.94, fdr: 17.40 },
          { nombre: 'Con dificultad', n: 1645, fnr: 31.12, fdr: 25.12 },
        ],
        disparidadFnr: 1.7346,
        disparidadFdr: 1.4437,
      },
      {
        id: 'pertenencia_indigena',
        nombre: 'Pueblo indígena',
        referencia: 'No indígena',
        grupos: [
          { nombre: 'No indígena', n: 36526, fnr: 18.94, fdr: 18.25 },
          { nombre: 'Indígena', n: 5969, fnr: 17.68, fdr: 15.94 },
        ],
        disparidadFnr: 0.9333,
        disparidadFdr: 0.8733,
      },
    ],

    // Post-procesamiento Equalized Odds de AIF360 (T2 celda 32).
    // Se evalúa sobre la mitad de "evaluación" del test (n = 21.248),
    // por eso las tasas "antes" difieren un poco de las de Aequitas.
    eqOdds: {
      nEvaluacion: 21248,
      cuidado_personal: {
        nombre: 'Cuidado personal',
        accuracy: { antes: 93.73, despues: 87.30 },
        cambios: 1642, // predicciones modificadas por el algoritmo
        grupos: [
          { nombre: 'Sin dificultad', n: 20426, antes: { fnr: 16.77, fpr: 3.71, fdr: 17.58 }, despues: { fnr: 30.33, fpr: 8.96, fdr: 38.10 } },
          { nombre: 'Con dificultad', n: 822, antes: { fnr: 30.28, fpr: 7.95, fdr: 24.00 }, despues: { fnr: 30.28, fpr: 7.95, fdr: 24.00 } },
        ],
      },
      pertenencia_indigena: {
        nombre: 'Pueblo indígena',
        accuracy: { antes: 93.73, despues: 92.40 },
        cambios: 334,
        grupos: [
          { nombre: 'No indígena', n: 18264, antes: { fnr: 18.45, fpr: 3.74, fdr: 18.61 }, despues: { fnr: 20.85, fpr: 5.11, fdr: 24.37 } },
          { nombre: 'Indígena', n: 2984, antes: { fnr: 13.61, fpr: 4.64, fdr: 14.95 }, despues: { fnr: 13.61, fpr: 4.64, fdr: 14.95 } },
        ],
      },
    },

    // Reweighing de AIF360 (T2 celdas 36, 38 y 41)
    reweighing: {
      filas: [
        { metrica: 'Paridad estadística en entrenamiento (cuidado personal)', original: '0,102', reweighing: '0,000' },
        { metrica: 'Impacto dispar en entrenamiento (cuidado personal)', original: '1,59', reweighing: '1,00' },
        { metrica: 'Accuracy del modelo', original: '93,59 %', reweighing: '93,69 %' },
        { metrica: 'FNR del grupo con dificultad', original: '31,1 %', reweighing: '31,6 %' },
        { metrica: 'Disparidad de FNR', original: '1,73', reweighing: '1,81', peor: true },
        { metrica: 'Disparidad de FDR', original: '1,44', reweighing: '1,29', mejor: true },
      ],
    },
  },

  /* ---------------------------------------------------------------------------
     TALLER 3 · Modelos interpretables y xAI
     ------------------------------------------------------------------------- */
  taller3: {
    // Familias de frases (T3 celda 5)
    familias: [
      { id: 'Control', nombre: 'Control', pregunta: 'Mensajes claros: ¿funciona lo básico?' },
      { id: 'A', nombre: 'A · Tono amable, mala noticia', pregunta: '¿Lo engañan «nos complace» o «buenas noticias»?' },
      { id: 'B', nombre: 'B · Palabras de carencia', pregunta: '¿«Pobreza» o «vulnerabilidad» vuelven negativa una buena noticia?' },
      { id: 'C', nombre: 'C · Lenguaje administrativo', pregunta: 'Tecnicismos, negaciones y aprobaciones parciales.' },
      { id: 'D', nombre: 'D · Distinto destinatario', pregunta: 'El mismo mensaje para distintas vecinas: debería dar lo mismo.' },
    ],

    // Las 14 frases (T3 celdas 6 y 11).
    //   hipotesis = lo que esperábamos que dijera el modelo
    //   deseada   = lo que DEBERÍA decir (lo que el mensaje significa para el hogar)
    //   probs     = probabilidades de BETO para NEG / NEU / POS
    //   lime      = peso de cada palabra hacia la clase predicha (T3 celdas 15–16).
    //               Las 3 palabras más fuertes son exactas (tabla de la celda 16);
    //               el resto se leyó de los gráficos de barras (≈ ±0,01).
    //               null = frase no analizada con LIME.
    frases: [
      { id: 0, familia: 'Control', texto: 'Nos alegra comunicarle que su solicitud de subsidio habitacional ha sido aprobada.', hipotesis: 'POS', deseada: 'POS', prediccion: 'POS', probs: { NEG: 0.001, NEU: 0.179, POS: 0.820 }, lime: null },
      { id: 1, familia: 'Control', texto: 'Lamentamos informarle que su solicitud de apoyo economico ha sido rechazada.', hipotesis: 'NEG', deseada: 'NEG', prediccion: 'NEG', probs: { NEG: 0.949, NEU: 0.050, POS: 0.001 }, lime: null },
      {
        id: 2, familia: 'A', texto: 'Nos complace informarle que, lamentablemente, usted no cumple los requisitos para recibir el beneficio.', hipotesis: 'POS', deseada: 'NEG', prediccion: 'NEG', probs: { NEG: 0.996, NEU: 0.004, POS: 0.001 },
        lime: { no: 0.60, lamentablemente: 0.28, complace: -0.08, los: -0.05, que: -0.04, beneficio: -0.04, Nos: -0.03, requisitos: 0.02, el: -0.02, cumple: -0.02 },
      },
      {
        id: 3, familia: 'B', texto: 'Aunque su familia atraviesa una situacion economica dificil, su solicitud de ayuda ha sido aprobada.', hipotesis: 'NEG', deseada: 'POS', prediccion: 'NEU', probs: { NEG: 0.001, NEU: 0.972, POS: 0.027 },
        lime: { economica: 0.20, Aunque: 0.19, familia: 0.13, atraviesa: 0.10, ayuda: 0.08, ha: 0.06, solicitud: -0.06, una: 0.04, aprobada: -0.03, dificil: -0.02 },
      },
      { id: 4, familia: 'C', texto: 'Su postulacion ha sido declarada inadmisible por incumplimiento de los requisitos establecidos.', hipotesis: 'NEU', deseada: 'NEG', prediccion: 'NEG', probs: { NEG: 0.846, NEU: 0.152, POS: 0.002 }, lime: null },
      {
        id: 5, familia: 'B', texto: 'Su hogar presenta condiciones de pobreza multidimensional y registra carencias en educacion y vivienda.', hipotesis: 'NEG', deseada: 'NEU', prediccion: 'NEG', probs: { NEG: 0.999, NEU: 0.000, POS: 0.001 },
        lime: { pobreza: 0.35, carencias: 0.31, en: 0.06, de: -0.05, hogar: 0.04, multidimensional: 0.04, y: -0.04, presenta: -0.01, educacion: -0.01, condiciones: -0.01 },
      },
      { id: 6, familia: 'C', texto: 'Su solicitud no ha sido rechazada, pero todavia se encuentra en evaluacion.', hipotesis: 'NEG', deseada: 'NEU', prediccion: 'NEU', probs: { NEG: 0.000, NEU: 0.997, POS: 0.002 }, lime: null },
      {
        id: 7, familia: 'A', texto: 'Buenas noticias: este mes no recibira el subsidio que esperaba.', hipotesis: 'POS', deseada: 'NEG', prediccion: 'NEG', probs: { NEG: 0.998, NEU: 0.002, POS: 0.000 },
        lime: { no: 0.76, recibira: 0.35, Buenas: -0.15, subsidio: 0.10, el: 0.08, que: 0.06, esperaba: 0.06, noticias: -0.02, mes: -0.02, este: -0.01 },
      },
      {
        id: 8, familia: 'C', texto: 'Su beneficio ha sido aprobado, aunque el monto asignado sera inferior al solicitado.', hipotesis: 'POS', deseada: 'POS', prediccion: 'NEU', probs: { NEG: 0.001, NEU: 0.995, POS: 0.004 },
        lime: { aunque: 0.25, inferior: -0.17, sera: 0.15, monto: 0.14, al: -0.05, sido: 0.05, solicitado: -0.03, aprobado: -0.02, beneficio: -0.01, Su: -0.01 },
      },
      {
        id: 9, familia: 'B', texto: 'La evaluacion socioeconomica determino que su hogar pertenece a un grupo de alta vulnerabilidad.', hipotesis: 'NEG', deseada: 'POS', prediccion: 'NEG', probs: { NEG: 0.976, NEU: 0.023, POS: 0.001 },
        lime: { vulnerabilidad: 0.80, alta: 0.25, La: -0.09, determino: -0.09, grupo: 0.07, socioeconomica: 0.05, hogar: 0.04, su: 0.04, pertenece: -0.03, de: 0.03 },
      },
      { id: 10, familia: 'D', destinatario: 'vecina chilena', texto: 'Estimada vecina chilena, su solicitud de apoyo para la vivienda ha sido aprobada.', hipotesis: 'POS', deseada: 'POS', prediccion: 'POS', probs: { NEG: 0.001, NEU: 0.020, POS: 0.979 }, lime: null },
      {
        id: 11, familia: 'D', destinatario: 'vecina inmigrante', texto: 'Estimada vecina inmigrante, su solicitud de apoyo para la vivienda ha sido aprobada.', hipotesis: 'POS', deseada: 'POS', prediccion: 'POS', probs: { NEG: 0.001, NEU: 0.238, POS: 0.761 },
        lime: { aprobada: 0.47, su: 0.17, sido: 0.15, ha: 0.14, inmigrante: -0.14, apoyo: 0.10, vecina: 0.08, solicitud: -0.08, Estimada: 0.08, de: -0.05 },
      },
      {
        id: 12, familia: 'D', destinatario: 'vecina mapuche', texto: 'Estimada vecina mapuche, su solicitud de apoyo para la vivienda ha sido aprobada.', hipotesis: 'POS', deseada: 'POS', prediccion: 'POS', probs: { NEG: 0.001, NEU: 0.138, POS: 0.861 },
        lime: { aprobada: 0.54, sido: 0.22, su: 0.20, ha: 0.15, apoyo: 0.07, mapuche: -0.07, vivienda: 0.06, Estimada: 0.05, la: -0.04, para: -0.04 },
      },
      { id: 13, familia: 'D', destinatario: 'vecina de Las Condes', texto: 'Estimada vecina de Las Condes, su solicitud de apoyo para la vivienda ha sido aprobada.', hipotesis: 'POS', deseada: 'POS', prediccion: 'POS', probs: { NEG: 0.001, NEU: 0.205, POS: 0.794 }, lime: null },
    ],

    // Random Forest (T3 celdas 32–34)
    randomForest: {
      accuracy: 83.21,
      recallPobre: 78.5,
      precisionPobre: 51.6,
      matriz: { vn: 29476, fp: 5520, fn: 1616, vp: 5883 },
      gemelosHogar: 87.6, // % de personas de test con un perfil de hogar idéntico en train
      comparacion: [
        { modelo: 'Elegido: profundidad 20, balanceado', accuracy: 83.2, recall: 78.5, precision: 51.6, fn: 1616, elegido: true },
        { modelo: 'Sin restricción, sin balance', accuracy: 94.1, recall: 67.8, precision: 97.9, fn: 2413 },
        { modelo: 'Sin restricción, balanceado', accuracy: 95.2, recall: 80.9, precision: 91.0, fn: 1432 },
      ],
    },

    // Importancia SHAP agregada por variable original (T3 celda 42).
    // ≈ Valores leídos del gráfico de barras (precisión ≈ ±0,001).
    shapImportancia: [
      { variable: 'r17a', nombre: 'Internet fijo', valor: 0.065 },
      { variable: 'tot_per_h', nombre: 'Personas en el hogar', valor: 0.055 },
      { variable: 'v3', nombre: 'Estado de los muros', valor: 0.053 },
      { variable: 'p9', nombre: 'Personas en la vivienda', valor: 0.049 },
      { variable: 'v5', nombre: 'Estado del piso', valor: 0.047 },
      { variable: 'r14', nombre: 'Tiene vehículo', valor: 0.044 },
      { variable: 'p2', nombre: 'Estado del sector', valor: 0.037 },
      { variable: 'p3', nombre: 'Basura en el sector', valor: 0.032 },
      { variable: 'ind_hacina', nombre: 'Hacinamiento', valor: 0.023 },
      { variable: 'v4', nombre: 'Material del piso', valor: 0.016 },
      { variable: 'v27b', nombre: 'Número de baños', valor: 0.016 },
      { variable: 'p4', nombre: 'Vandalismo en el sector', valor: 0.015 },
      { variable: 's13', nombre: 'Sistema de salud', valor: 0.015 },
      { variable: 'r17b', nombre: 'Internet móvil', valor: 0.015 },
      { variable: 'v2', nombre: 'Material de los muros', valor: 0.008 },
    ],
    // Atributos sensibles: valor y puesto EXACTOS (tabla de la celda 42, de 41 variables)
    shapSensibles: [
      { variable: 'edad', nombre: 'Edad', valor: 0.0074, puesto: 16 },
      { variable: 'r3', nombre: 'Pueblo indígena', valor: 0.0051, puesto: 24 },
      { variable: 'r1a', nombre: 'Nacionalidad', valor: 0.0047, puesto: 26 },
      { variable: 'sexo', nombre: 'Sexo', valor: 0.0012, puesto: 38 },
      { variable: 'os1', nombre: 'Orientación sexual', valor: 0.0005, puesto: 39 },
      { variable: 'trans', nombre: 'Identidad trans', valor: 0.0000, puesto: 41 },
    ],

    // Explicación local de un falso negativo (T3 celda 43, gráfico waterfall).
    // ≈ Valores leídos del gráfico (precisión ≈ ±0,003). Las columnas one-hot de
    // una misma pregunta se sumaron (r14_1 + r14_2, p3_2 + p3_4), lo que es válido
    // porque los valores SHAP son aditivos. base + suma de pasos = 0,24.
    casoLocal: {
      base: 0.5, // probabilidad media de "Pobre" en el bosque
      final: 0.24, // probabilidad asignada a esta persona
      umbral: 0.5, // sobre 0,5 el modelo predice "Pobre"
      pasos: [
        { nombre: 'Personas en la vivienda: 2', valor: -0.064 },
        { nombre: 'Personas en el hogar: 2', valor: -0.061 },
        { nombre: 'Basura visible en el sector', valor: 0.053 },
        { nombre: 'Tiene vehículo', valor: -0.042 },
        { nombre: 'Dificultad para el cuidado personal', valor: 0.032 },
        { nombre: 'Muros en buen estado', valor: -0.031 },
        { nombre: 'Número de baños: 2', valor: -0.028 },
        { nombre: 'Piso en buen estado', valor: -0.024 },
        { nombre: 'Tiene internet fijo', valor: -0.020 },
        { nombre: 'Otras 130 columnas', valor: -0.074 },
      ],
    },
  },

  /* ---------------------------------------------------------------------------
     TALLER 4 · Enfoque de derechos humanos y privacidad
     ------------------------------------------------------------------------- */
  taller4: {
    // Principios del enfoque de derechos humanos para los datos (T4 celda 11).
    // estado: 'si' | 'parcial' | 'no'
    principios: [
      {
        nombre: 'Participación', estado: 'no', etiqueta: 'No cumple',
        razon: 'Las preguntas y la definición de pobreza las diseñan equipos técnicos y paneles de expertos. Las personas y comunidades solo participan como informantes.',
        propuesta: 'Co-diseño con comunidades: mesas con organizaciones indígenas, de migrantes, de diversidad sexual y de personas con discapacidad para revisar qué se pregunta, cómo y para qué, y devolver los resultados en lenguaje simple.',
      },
      {
        nombre: 'Desagregación', estado: 'si', etiqueta: 'Cumple en general',
        razon: 'Permite separar por sexo, edad, pueblo indígena, nacionalidad, zona, orientación sexual, identidad trans y discapacidad. El problema: algunos grupos tienen muy pocos casos para obtener resultados confiables.',
        propuesta: 'No publicar grupos demasiado pequeños: cuando una combinación tiene pocos casos, se agrupa o se suprime.',
      },
      {
        nombre: 'Autoidentificación', estado: 'parcial', etiqueta: 'Parcial',
        razon: 'Pertenencia indígena, orientación sexual e identidad de género se preguntan como autoidentificación, pero en muchos módulos una sola persona responde por todo el hogar.',
        propuesta: 'Que cada persona responda por sí misma las preguntas sensibles, siempre con la opción «prefiero no responder».',
      },
      {
        nombre: 'Transparencia', estado: 'si', etiqueta: 'Cumple en general',
        razon: 'Se publican la metodología, los cuestionarios, los libros de códigos y las bases, aunque en un lenguaje técnico difícil de entender para la población.',
        propuesta: 'Consentimiento informado y claro: explicar en palabras simples para qué se usan los datos y que se puede omitir un módulo sensible sin perder nada.',
      },
      {
        nombre: 'Privacidad', estado: 'parcial', etiqueta: 'Parcial',
        razon: 'La base pública no trae nombres ni direcciones, pero combinando variables hay personas con combinaciones únicas, y muchos datos son sensibles según la ley chilena.',
        propuesta: 'Acceso por niveles (Five Safes): datos agregados y sintéticos para el público, microdatos con acuerdo de uso para investigación y datos identificables solo en un entorno seguro.',
      },
      {
        nombre: 'Rendición de cuentas', estado: 'parcial', etiqueta: 'Parcial',
        razon: 'Existe la Ley de Transparencia, pero no hay un mecanismo claro para que una persona sepa cómo se usaron sus datos o reclame si un uso la perjudica.',
        propuesta: 'Evaluar el impacto antes de usar los datos en modelos que decidan sobre personas, publicar esos usos y abrir un canal de reclamo.',
      },
    ],

    // Línea de tiempo del marco legal chileno (T4 celda 13)
    leyes: [
      { fecha: '1970', titulo: 'Ley 17.374', texto: 'Crea el INE y establece el secreto estadístico.' },
      { fecha: '1999', titulo: 'Ley 19.628', texto: 'Protección de la vida privada: la ley de datos personales vigente hoy.' },
      { fecha: '2008', titulo: 'Ley 20.285', texto: 'Acceso a la información pública, resguardando los datos personales.' },
      { fecha: '2018', titulo: 'Ley 21.096', texto: 'La protección de los datos personales pasa a ser un derecho constitucional (art. 19 N° 4).' },
      { fecha: '13 dic 2024', titulo: 'Ley 21.719', texto: 'Se publica la nueva ley de datos personales y se crea la Agencia de Protección de Datos Personales.' },
      { fecha: '1 dic 2026', titulo: 'Vigencia original', texto: 'Fecha en que la Ley 21.719 debía entrar en vigor.' },
      { fecha: '15 oct 2027', titulo: 'Postergación', texto: 'El Congreso despachó el 17 de noviembre de 2026 un proyecto que posterga la vigencia; al cierre del taller faltaba su publicación.', pendiente: true },
    ],

    // Método de recolección propuesto según la Ley 21.719 (T4 celda 13)
    metodo: [
      { titulo: 'Base legal clara', articulo: 'arts. 16 quinquies y 20', texto: 'Un órgano público puede tratar datos dentro de sus funciones; aun así, pedimos consentimiento expreso para el módulo sensible, con opción de no responder.' },
      { titulo: 'Finalidad', articulo: 'art. 3 b', texto: 'Declarar que los datos son para estadística y políticas sociales, y prohibir otros usos: fiscalización, control migratorio o cruces para sancionar.' },
      { titulo: 'Proporcionalidad', articulo: 'art. 3 c', texto: 'Preguntar solo lo necesario. La dirección exacta sirve para la logística y luego se guarda aparte: para analizar basta la comuna o la manzana.' },
      { titulo: 'Seudonimización', articulo: 'art. 2 l', texto: 'Separar nombre, RUT y dirección de las respuestas, unidos solo por un código cuya llave se guarda en otro lugar.' },
      { titulo: 'Seguridad', articulo: 'art. 3 f y h', texto: 'Cifrar, registrar quién accede y exigir deber de secreto a encuestadores y analistas, como el secreto estadístico.' },
      { titulo: 'Información', articulo: 'art. 3 g', texto: 'Una hoja simple en cada visita: quién trata los datos, para qué, por cuánto tiempo y cómo ejercer los derechos sobre ellos.' },
      { titulo: 'Publicación anonimizada', articulo: 'arts. 2 k y 16 quinquies', texto: 'Anonimizar de forma irreversible antes de publicar: cifras agregadas, supresión de grupos pequeños y datos sintéticos.' },
      { titulo: 'Supervisión', articulo: 'Agencia de Protección de Datos', texto: 'Designar un responsable de protección de datos y someterse a la fiscalización de la nueva Agencia.' },
    ],

    // Riesgo de reidentificación al sumar variables una a una.
    //   combinaciones = combinaciones distintas de valores
    //   unicas        = personas con una combinación que nadie más comparte (k = 1)
    //   menos5        = personas en grupos de menos de 5 (k < 5, incluye k = 1)
    // El último paso (7 variables) es el resultado de T4 celda 16. Los pasos
    // intermedios son un cálculo complementario para este sitio, con el mismo
    // método y el mismo archivo (scripts/calcular_datos_sitio.py).
    reidentificacion: [
      { variable: 'edad', etiqueta: 'Edad', combinaciones: 107, unicas: 2, menos5: 9 },
      { variable: 'sexo', etiqueta: 'Sexo', combinaciones: 210, unicas: 3, menos5: 12 },
      { variable: 'area', etiqueta: 'Zona', combinaciones: 415, unicas: 7, menos5: 40 },
      { variable: 'r1a', etiqueta: 'Nacionalidad', combinaciones: 1051, unicas: 105, menos5: 540 },
      { variable: 'r3', etiqueta: 'Pueblo indígena', combinaciones: 1810, unicas: 277, menos5: 1178 },
      { variable: 'tot_per_h', etiqueta: 'Personas en el hogar', combinaciones: 9685, unicas: 2771, menos5: 8940 },
      { variable: 'pobreza_multi', etiqueta: 'Pobreza', combinaciones: 15046, unicas: 4694, menos5: 16057 },
    ],

    // Presupuesto de privacidad ε (T4 celdas 18 y 27; muestra de 30.000 personas)
    epsilon: [
      { valor: 0.1, etiqueta: '0,1', privacidad: 'Muy alta', resultado: 'Mucho ruido: el sintético muestra 26,2 % de pobreza (el real es 17,5 %) y la brecha indígena aparece al revés.' },
      { valor: 1, etiqueta: '1', privacidad: 'Media', elegido: true, resultado: 'El total se parece mucho al real, pero la brecha indígena (7,9 puntos en la muestra) casi desaparece.' },
      { valor: 10, etiqueta: '10', privacidad: 'Baja', resultado: 'El total también se parece, pero la brecha indígena tampoco vuelve: el problema no es solo el ruido, sino qué relaciones conserva la red bayesiana.' },
    ],

    // Pobreza por grupo: datos originales vs sintéticos con ε = 1 (T4 celda 34)
    brechas: [
      {
        id: 'r3', nombre: 'Pueblo indígena', a: 'Indígena', b: 'No indígena',
        grupos: [
          { nombre: 'Indígena', original: 23.8, sintetico: 18.8 },
          { nombre: 'No indígena', original: 16.6, sintetico: 17.8 },
        ],
      },
      {
        id: 'r1a', nombre: 'Nacionalidad', a: 'Extranjera', b: 'Chilena',
        grupos: [
          { nombre: 'Chilena', original: 16.8, sintetico: 17.0 },
          { nombre: 'Chilena y otra', original: 16.7, sintetico: 19.5 },
          { nombre: 'Extranjera', original: 32.1, sintetico: 32.3 },
        ],
      },
      {
        id: 'area', nombre: 'Zona', a: 'Rural', b: 'Urbana',
        grupos: [
          { nombre: 'Rural', original: 21.5, sintetico: 22.3 },
          { nombre: 'Urbana', original: 16.8, sintetico: 17.0 },
        ],
      },
      {
        id: 'sexo', nombre: 'Sexo', a: 'Mujer', b: 'Hombre',
        grupos: [
          { nombre: 'Hombre', original: 17.5, sintetico: 18.1 },
          { nombre: 'Mujer', original: 17.8, sintetico: 17.8 },
        ],
      },
    ],

    // Niveles de acceso propuestos (T4 celdas 11 y 27; modelo Five Safes)
    accesos: [
      {
        nivel: 'Restringido', ancho: 44,
        datos: 'Datos reales con ubicación o identificadores.',
        uso: 'Entregar un beneficio a un hogar concreto (municipio, Ministerio).',
        resguardos: 'Solo los datos necesarios, base legal, registro de accesos y deber de secreto, dentro de un entorno seguro.',
      },
      {
        nivel: 'Investigación', ancho: 70,
        datos: 'Microdatos reales seudonimizados.',
        uso: 'Investigación que necesita precisión, por ejemplo evaluar un programa.',
        resguardos: 'Entorno seguro y acuerdo de uso firmado.',
      },
      {
        nivel: 'Público', ancho: 100,
        datos: 'Cifras agregadas y datos sintéticos con privacidad diferencial.',
        uso: 'Docencia, hackatones, prototipos de modelos, prensa y activismo.',
        resguardos: 'Supresión de grupos pequeños y aviso de que el sintético no sirve para conclusiones finas: las cifras clave se verifican con datos oficiales.',
      },
    ],
  },
};
