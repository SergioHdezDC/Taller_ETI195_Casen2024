/* =============================================================================
   app.js · Interactividad del sitio con Alpine.js
   -----------------------------------------------------------------------------
   ¿Cómo funciona Alpine.js?
     En el HTML, un elemento con  x-data="nombreDelComponente"  queda conectado
     a uno de los componentes definidos aquí con  Alpine.data('nombre', ...).
     Dentro de ese elemento se usan directivas:
       x-text="..."     escribe un texto          @click="..."  reacciona a un clic
       x-show="..."     muestra u oculta           :style="..."  cambia estilos
       x-for="..."      repite un bloque           x-intersect   detecta el scroll
     Cuando cambia una propiedad (por ejemplo `seleccion`), Alpine actualiza
     solo lo que depende de ella. Documentación: https://alpinejs.dev

   Importante al editar el HTML: escribir :style SIEMPRE como objeto,
     :style="{ width: ancho(c) + '%' }"        ← bien
     :style="`width: ${ancho(c)}%`"            ← evitar
   Con texto, Alpine reemplaza el atributo style completo y puede borrar el
   display:none que pone x-show (el elemento "reaparece").

   Todas las cifras vienen de  window.DATOS  (archivo datos.js).

   Índice
     1. Formato de números (estilo chileno)
     2. Utilidades: movimiento reducido, azar con semilla, tooltip reutilizable
     3. (eliminado: el sitio solo usa tema claro)
     4. Navegación: sección activa y barra de progreso
     5. Portada: contadores y matriz de puntos
     6. Simulador de pobreza multidimensional
     7. Taller 1 · Representación de grupos
     8. Taller 2 · Matriz de confusión, errores por grupo y mitigación
     9. Taller 3 · Frases (LIME), destinatario, importancia SHAP y caso local
    10. Taller 4 · Principios, reidentificación, ε, brechas y niveles de acceso
    11. Animación de aparición al hacer scroll (sin Alpine)
   ============================================================================ */

/* -----------------------------------------------------------------------------
   1. FORMATO DE NÚMEROS · 212471 → "212.471"  ·  17.6 → "17,6 %"
   --------------------------------------------------------------------------- */
const Formato = {
  /** Entero con punto de miles: 1403 → "1.403". */
  numero(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  },

  /** Decimal con coma: (17.65, 1) → "17,6". Usa el signo menos tipográfico (−). */
  decimal(n, decimales = 1) {
    const signo = n < 0 ? '−' : '';
    const [entero, fraccion] = Math.abs(n).toFixed(decimales).split('.');
    return signo + Formato.numero(Number(entero)) + (fraccion ? ',' + fraccion : '');
  },

  /** Porcentaje: (31.12) → "31,1 %". */
  pct(n, decimales = 1) {
    return Formato.decimal(n, decimales) + ' %';
  },

  /** Con signo explícito: 0.25 → "+0,25"  ·  −0.17 → "−0,17". */
  conSigno(n, decimales = 2) {
    return (n > 0 ? '+' : '') + Formato.decimal(n, decimales);
  },
};
window.Formato = Formato; // disponible dentro de las expresiones del HTML

/* -----------------------------------------------------------------------------
   2. UTILIDADES
   --------------------------------------------------------------------------- */

/** true si la persona pidió al sistema operativo reducir las animaciones. */
function prefiereMenosMovimiento() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Generador pseudoaleatorio con semilla (mulberry32): da los mismos números en cada visita. */
function generadorConSemilla(semilla) {
  return function () {
    semilla = (semilla + 0x6d2b79f5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ruido de Laplace(0, escala), el que usa la privacidad diferencial (método de la inversa). */
function ruidoLaplace(azar, escala) {
  const u = azar() - 0.5;
  return -escala * Math.sign(u) * Math.log(Math.max(1e-12, 1 - 2 * Math.abs(u)));
}

/**
 * Tooltip reutilizable. Se "mezcla" en un componente con  ...conTooltip()
 * El HTML del gráfico necesita:
 *   - un contenedor con  x-ref="marco"  y  position: relative  (clase .grafico)
 *   - en cada marca:  @mouseenter / @focus = "mostrarTip($event, titulo, valor, detalle)"
 *   - opcional: un hijo con el atributo  data-ancla  indica dónde apuntar
 *     (data-ancla="centro" apunta al centro; si no, al extremo derecho).
 */
function conTooltip() {
  return {
    tip: { visible: false, x: 0, y: 0, titulo: '', valor: '', detalle: '' },

    mostrarTip(evento, titulo, valor, detalle = '') {
      const marco = this.$refs.marco;
      if (!marco) return;
      const caja = marco.getBoundingClientRect();
      const ancla = evento.currentTarget.querySelector('[data-ancla]') || evento.currentTarget;
      const r = ancla.getBoundingClientRect();
      const xAncla = ancla.dataset.ancla === 'centro' ? r.left + r.width / 2 : r.right;
      // Se limita la posición para que el tooltip no se salga del gráfico
      const x = Math.min(Math.max(xAncla - caja.left, 96), caja.width - 96);
      this.tip = { visible: true, x, y: r.top - caja.top, titulo, valor, detalle };
    },

    ocultarTip() {
      this.tip.visible = false;
    },
  };
}

/* -----------------------------------------------------------------------------
   3–10. COMPONENTES DE ALPINE
   Se registran en el evento 'alpine:init', que Alpine dispara antes de leer el
   HTML. Por eso este archivo se carga ANTES que Alpine en index.html.
   --------------------------------------------------------------------------- */
document.addEventListener('alpine:init', () => {
  const D = window.DATOS;

  /* ---------------------------------------------------------------------------
     4. NAVEGACIÓN
     Marca la sección visible en el menú y mueve la barra de progreso.
     ------------------------------------------------------------------------- */
  Alpine.data('navegacion', () => ({
    activa: 'inicio',
    progreso: 0, // 0–100 % de la página recorrida

    init() {
      // a) Sección activa: la que cruza una franja en el centro de la pantalla
      const observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (entrada.isIntersecting) this.activa = entrada.target.id;
          });
        },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      document.querySelectorAll('main > section[id]').forEach((s) => observador.observe(s));

      // b) Barra de progreso de lectura
      const actualizar = () => {
        const recorrido = document.documentElement.scrollHeight - window.innerHeight;
        this.progreso = recorrido > 0 ? Math.min(100, (window.scrollY / recorrido) * 100) : 0;
      };
      window.addEventListener('scroll', actualizar, { passive: true });
      actualizar();

      // c) En pantallas chicas el menú se desplaza de lado: centra el enlace activo
      this.$watch('activa', (id) => {
        const lista = this.$refs.lista;
        const enlace = lista && lista.querySelector(`a[href="#${id}"]`);
        if (!enlace || lista.scrollWidth <= lista.clientWidth) return;
        lista.scrollTo({
          left: enlace.offsetLeft - lista.clientWidth / 2 + enlace.offsetWidth / 2,
          behavior: prefiereMenosMovimiento() ? 'auto' : 'smooth',
        });
      });
    },
  }));

  /* ---------------------------------------------------------------------------
     5. PORTADA
     ------------------------------------------------------------------------- */

  /** Número que "cuenta" desde 0 hasta su valor cuando aparece en pantalla. */
  Alpine.data('contador', (objetivo, decimales = 0) => ({
    valor: objetivo, // sin JavaScript o con movimiento reducido se ve el valor final

    get texto() {
      return decimales ? Formato.decimal(this.valor, decimales) : Formato.numero(this.valor);
    },

    iniciar() {
      if (prefiereMenosMovimiento()) return;
      const duracion = 1400; // ms
      const inicio = performance.now();
      const paso = (ahora) => {
        const t = Math.min(1, (ahora - inicio) / duracion);
        this.valor = objetivo * (1 - Math.pow(1 - t, 3)); // desaceleración suave
        if (t < 1) requestAnimationFrame(paso);
        else this.valor = objetivo;
      };
      this.valor = 0;
      requestAnimationFrame(paso);
    },
  }));

  /** Matriz de puntos: 1 punto ≈ 1.000 personas; los destacados están en pobreza. */
  Alpine.data('matrizPuntos', () => {
    const total = Math.round(D.dataset.personas / 1000); // 212 puntos
    return {
      total,
      destacados: Math.round((total * D.dataset.pctPobreza) / 100), // 37 puntos
    };
  });

  /* ---------------------------------------------------------------------------
     6. SIMULADOR DE POBREZA MULTIDIMENSIONAL
     20 casillas (5 dimensiones × 4 indicadores). Cada casilla marcada suma 5 %.
     El hogar es pobre si la suma SUPERA el umbral (20 %).
     ------------------------------------------------------------------------- */
  Alpine.data('simuladorPobreza', () => ({
    dimensiones: D.pobrezaMulti.dimensiones,
    porDimension: D.pobrezaMulti.indicadoresPorDimension,
    peso: D.pobrezaMulti.pesoIndicador,
    umbral: D.pobrezaMulti.umbral,
    carencias: [], // true/false por casilla

    init() {
      this.limpiar();
    },

    get total() {
      return this.carencias.filter(Boolean).length;
    },
    get porcentaje() {
      return this.total * this.peso;
    },
    get esPobre() {
      return this.porcentaje > this.umbral;
    },
    get mensaje() {
      if (this.total === 0) return 'Haz clic en las casillas para marcar carencias.';
      if (this.esPobre) return `${this.total} carencias suman ${this.porcentaje} %: supera el umbral.`;
      if (this.porcentaje === this.umbral) return 'Justo en el umbral: 20 % no basta, la suma debe superarlo.';
      return `${this.total} ${this.total === 1 ? 'carencia suma' : 'carencias suman'} ${this.porcentaje} %: no alcanza el umbral.`;
    },

    /** Posición de la casilla k (0–3) de la dimensión d (0–4) en la lista. */
    indice(d, k) {
      return d * this.porDimension + k;
    },
    alternar(i) {
      this.carencias[i] = !this.carencias[i];
    },
    limpiar() {
      this.carencias = Array(this.dimensiones.length * this.porDimension).fill(false);
    },
    /** Carga un ejemplo: lista de casillas marcadas. */
    ejemplo(casillas) {
      this.limpiar();
      casillas.forEach((i) => (this.carencias[i] = true));
    },
  }));

  /* ---------------------------------------------------------------------------
     7. TALLER 1 · REPRESENTACIÓN DE GRUPOS
     Barras horizontales: % de la muestra o % en pobreza, según `medida`.
     ------------------------------------------------------------------------- */
  Alpine.data('representacion', () => ({
    ...conTooltip(),
    variables: D.taller1.grupos,
    total: D.dataset.personas,
    promedio: D.dataset.pctPobreza,
    seleccion: 'r3', // variable mostrada al inicio
    medida: 'muestra', // 'muestra' | 'pobreza'
    verTabla: false,
    visible: false, // las barras crecen al aparecer en pantalla

    get variable() {
      return this.variables.find((v) => v.id === this.seleccion);
    },
    // Escala fija por medida: así se pueden comparar variables entre sí
    get maximo() {
      return this.medida === 'muestra' ? 100 : 40;
    },
    get anchoPromedio() {
      return (this.promedio / this.maximo) * 100;
    },

    pctMuestra(c) {
      return (c.n / this.total) * 100;
    },
    valor(c) {
      return this.medida === 'muestra' ? this.pctMuestra(c) : c.pobreza;
    },
    ancho(c) {
      return this.visible ? (this.valor(c) / this.maximo) * 100 : 0;
    },
    /** Valores bajo 1 % llevan dos decimales (0,03 %) para que no se lean como cero. */
    etiqueta(c) {
      const v = this.valor(c);
      return Formato.pct(v, v < 1 ? 2 : 1);
    },
    tooltip(evento, c) {
      this.mostrarTip(
        evento,
        c.nombre,
        this.etiqueta(c),
        `${Formato.numero(c.n)} personas · ${Formato.pct(c.pobreza)} en pobreza`
      );
    },
  }));

  /* ---------------------------------------------------------------------------
     8. TALLER 2
     ------------------------------------------------------------------------- */

  /** Matriz de confusión del árbol de decisión: al pasar por una celda se explica. */
  Alpine.data('matrizConfusion', () => {
    const m = D.taller2.matriz;
    return {
      activa: 'fn', // celda destacada al inicio: los falsos negativos
      celdas: [
        { id: 'vn', n: m.vn, titulo: 'Verdaderos negativos', texto: 'Personas no pobres que el modelo clasificó bien.' },
        { id: 'fp', n: m.fp, titulo: 'Falsos positivos', texto: 'Personas no pobres marcadas como pobres: recursos que llegarían a quien no los necesita.' },
        { id: 'fn', n: m.fn, titulo: 'Falsos negativos', texto: 'Personas en pobreza que el modelo no detecta y que podrían quedar fuera de una ayuda. Es el error más grave.' },
        { id: 'vp', n: m.vp, titulo: 'Verdaderos positivos', texto: 'Personas en pobreza que el modelo detectó correctamente.' },
      ],
      get detalle() {
        return this.celdas.find((c) => c.id === this.activa);
      },
      /** Intensidad del azul (0–1) proporcional al conteo. */
      intensidad(c) {
        const maximo = Math.max(...this.celdas.map((x) => x.n));
        return 0.1 + 0.9 * (c.n / maximo);
      },
    };
  });

  /** Tasas de error por grupo (Aequitas): FNR y FDR. */
  Alpine.data('erroresGrupo', () => ({
    ...conTooltip(),
    atributos: D.taller2.aequitas,
    seleccion: 'cuidado_personal',
    verTabla: false,
    visible: false,
    maximo: 40, // escala 0–40 %

    get atributo() {
      return this.atributos.find((a) => a.id === this.seleccion);
    },
    ancho(v) {
      return this.visible ? (v / this.maximo) * 100 : 0;
    },
    /** Frase que interpreta la disparidad de FNR del atributo elegido. */
    get frase() {
      const a = this.atributo;
      const otro = a.grupos.find((g) => g.nombre !== a.referencia).nombre;
      const diferencia = Formato.decimal(Math.abs(a.disparidadFnr - 1) * 100, 0);
      const sentido = a.disparidadFnr >= 1 ? 'más' : 'menos';
      return `el grupo «${otro}» tiene ${diferencia} % ${sentido} falsos negativos que «${a.referencia}».`;
    },
  }));

  /** Equalized Odds: tasas antes y después de mitigar. */
  Alpine.data('mitigacion', () => ({
    ...conTooltip(),
    datos: D.taller2.eqOdds,
    atributo: 'cuidado_personal',
    etapa: 'antes', // 'antes' | 'despues'
    metrica: 'fnr', // 'fnr' | 'fpr' | 'fdr'
    metricas: [
      { id: 'fnr', nombre: 'FNR', largo: 'Pobres no detectados' },
      { id: 'fpr', nombre: 'FPR', largo: 'No pobres marcados como pobres' },
      { id: 'fdr', nombre: 'FDR', largo: 'Alertas de «pobre» erróneas' },
    ],
    verTabla: false,
    visible: false,
    maximo: 40,

    get actual() {
      return this.datos[this.atributo];
    },
    get otraEtapa() {
      return this.etapa === 'antes' ? 'despues' : 'antes';
    },
    get metricaActual() {
      return this.metricas.find((m) => m.id === this.metrica);
    },
    valor(g, etapa = this.etapa) {
      return g[etapa][this.metrica];
    },
    ancho(g, etapa = this.etapa) {
      return this.visible ? (this.valor(g, etapa) / this.maximo) * 100 : 0;
    },
    tooltip(evento, g) {
      const antes = Formato.pct(g.antes[this.metrica]);
      const despues = Formato.pct(g.despues[this.metrica]);
      this.mostrarTip(evento, `${g.nombre} · ${this.metricaActual.largo}`, Formato.pct(this.valor(g)), `Antes ${antes} → después ${despues}`);
    },
  }));

  /* ---------------------------------------------------------------------------
     9. TALLER 3
     ------------------------------------------------------------------------- */

  /** Explorador de frases: predicción de BETO y pesos LIME por palabra. */
  Alpine.data('exploradorFrases', () => ({
    frases: D.taller3.frases,
    familias: D.taller3.familias,
    seleccion: 9, // frase de "alta vulnerabilidad"
    clases: ['NEG', 'NEU', 'POS'],
    nombreClase: { NEG: 'Negativo', NEU: 'Neutro', POS: 'Positivo' },
    pesoMaximo: 0.8, // mayor |peso| LIME de todas las frases: escala común de color

    init() {
      // Al cargar, desplaza la lista (no la página) para que se vea la frase seleccionada
      this.$nextTick(() => {
        const lista = this.$refs.lista;
        const boton = lista && lista.querySelector('[aria-pressed="true"]');
        if (boton) lista.scrollTop = boton.offsetTop - lista.clientHeight / 3;
      });
    },

    get frase() {
      return this.frases.find((f) => f.id === this.seleccion);
    },
    frasesDe(familia) {
      return this.frases.filter((f) => f.familia === familia);
    },
    esError(f) {
      return f.prediccion !== f.deseada;
    },

    /**
     * Separa la frase en palabras y separadores (espacios, comas, puntos) y le
     * asigna a cada palabra su peso LIME. LIME distingue mayúsculas: "Aunque" ≠ "aunque".
     */
    get piezas() {
      const pesos = this.frase.lime || {};
      return this.frase.texto
        .split(/([^\p{L}\p{N}]+)/u)
        .filter((p) => p !== '')
        .map((p) => ({ texto: p, peso: Object.prototype.hasOwnProperty.call(pesos, p) ? pesos[p] : null }));
    },

    /**
     * Fondo de la palabra: azul si empuja hacia la predicción, rojo si en contra.
     * La intensidad (14 %–76 %) es proporcional a |peso|, con la misma escala para todas las frases.
     */
    estiloPieza(p) {
      if (p.peso === null) return {};
      const intensidad = Math.round(14 + 62 * Math.min(1, Math.abs(p.peso) / this.pesoMaximo));
      const color = p.peso > 0 ? 'var(--divergente-azul)' : 'var(--divergente-rojo)';
      return { background: `color-mix(in srgb, ${color} ${intensidad}%, transparent)` };
    },

    /** Las 5 palabras con más peso (en valor absoluto). */
    get palabrasClave() {
      if (!this.frase.lime) return [];
      return Object.entries(this.frase.lime)
        .map(([palabra, peso]) => ({ palabra, peso }))
        .sort((a, b) => Math.abs(b.peso) - Math.abs(a.peso))
        .slice(0, 5);
    },
  }));

  /** Familia D: probabilidad de "positivo" para el mismo mensaje con distinto destinatario. */
  Alpine.data('graficoDestinatario', () => ({
    ...conTooltip(),
    visible: false,
    get filas() {
      return D.taller3.frases
        .filter((f) => f.familia === 'D')
        .map((f) => ({ nombre: f.destinatario, pos: f.probs.POS }))
        .sort((a, b) => b.pos - a.pos);
    },
    get referencia() {
      return this.filas[0].pos; // la mayor confianza ("vecina chilena")
    },
    ancho(v) {
      return this.visible ? v * 100 : 0;
    },
  }));

  /** Importancia SHAP agregada por variable de la encuesta (+ atributos sensibles). */
  Alpine.data('importanciaShap', () => ({
    ...conTooltip(),
    principales: D.taller3.shapImportancia,
    sensibles: D.taller3.shapSensibles,
    mostrarSensibles: true,
    verTabla: false,
    visible: false,
    maximo: 0.07,

    ancho(v) {
      return this.visible ? (v / this.maximo) * 100 : 0;
    },
    /**
     * Tres decimales para los valores leídos del gráfico (aproximados) y cuatro para
     * los atributos sensibles, que vienen exactos de la tabla del notebook.
     */
    formato(v, exacto = false) {
      return Formato.decimal(v, exacto ? 4 : 3);
    },
    /** ¿Hay puestos sin mostrar entre este atributo sensible y la fila anterior? (dibuja "⋯") */
    hayHueco(i) {
      const anterior = i === 0 ? this.principales.length : this.sensibles[i - 1].puesto;
      return this.sensibles[i].puesto - anterior > 1;
    },
  }));

  /** Explicación local (waterfall) de un falso negativo del Random Forest. */
  Alpine.data('casoLocal', () => {
    const caso = D.taller3.casoLocal;
    return {
      ...conTooltip(),
      base: caso.base,
      final: caso.final,
      umbral: caso.umbral,
      minimo: 0.2, // eje horizontal de 0,20 a 0,60
      maximo: 0.6,
      ticks: [0.2, 0.3, 0.4, 0.5, 0.6],
      visible: false,
      verTabla: false,

      /** Cada paso parte donde terminó el anterior (desde → hasta). */
      get pasos() {
        let acumulado = caso.base;
        return caso.pasos.map((p) => {
          const desde = acumulado;
          acumulado += p.valor;
          return { ...p, desde, hasta: acumulado };
        });
      },
      /** Posición horizontal (0–100 %) de una probabilidad. */
      x(v) {
        return ((v - this.minimo) / (this.maximo - this.minimo)) * 100;
      },
      izquierda(p) {
        return this.x(Math.min(p.desde, p.hasta));
      },
      ancho(p) {
        return Math.abs(this.x(p.hasta) - this.x(p.desde));
      },
    };
  });

  /* ---------------------------------------------------------------------------
     10. TALLER 4
     ------------------------------------------------------------------------- */

  /** Principios del enfoque de derechos humanos: tarjeta seleccionada. */
  Alpine.data('principios', () => ({
    lista: D.taller4.principios,
    seleccion: 0,
    get actual() {
      return this.lista[this.seleccion];
    },
  }));

  /** Riesgo de reidentificación al conocer 1, 2, …, 7 variables. */
  Alpine.data('reidentificacion', () => ({
    pasos: D.taller4.reidentificacion,
    total: D.dataset.personas,
    paso: 6, // cantidad de variables conocidas (1–7); 6 = lo que podría saber un vecino
    visible: false,

    get actual() {
      return this.pasos[this.paso - 1];
    },
    get maximo() {
      return Math.max(...this.pasos.map((p) => p.menos5));
    },
    /** Alto (0–100 %) de una columna. */
    alto(valor) {
      return this.visible ? (valor / this.maximo) * 100 : 0;
    },
    pct(n) {
      return (n / this.total) * 100;
    },
  }));

  /**
   * Presupuesto de privacidad ε. Incluye una ILUSTRACIÓN (no son datos de la CASEN):
   * 36 publicaciones de un mismo conteo real (100 personas) con ruido de Laplace
   * de escala 1/ε. Con ε pequeño el ruido es grande, y viceversa.
   */
  Alpine.data('presupuestoEpsilon', () => ({
    opciones: D.taller4.epsilon,
    seleccion: 1, // ε = 1, el valor que usamos
    puntos: [],
    real: 100,
    ticks: [60, 80, 100, 120, 140],

    init() {
      this.generar();
      this.$watch('seleccion', () => this.generar());
    },
    get actual() {
      return this.opciones[this.seleccion];
    },
    generar() {
      const azar = generadorConSemilla(11);
      const escala = 1 / this.actual.valor; // sensibilidad de un conteo = 1
      this.puntos = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        valor: this.real + ruidoLaplace(azar, escala),
        fila: i % 4, // cuatro filas para que los puntos no se tapen
      }));
    },
    /** Posición horizontal (0–100 %) en un eje de 60 a 140. Los extremos se recortan. */
    x(v) {
      return Math.min(100, Math.max(0, ((v - 60) / 80) * 100));
    },
  }));

  /** Pobreza por grupo: datos originales vs sintéticos. */
  Alpine.data('brechasSinteticas', () => ({
    ...conTooltip(),
    variables: D.taller4.brechas,
    promedio: D.dataset.pctPobreza,
    vista: 'original', // 'original' | 'sintetico'
    verTabla: false,
    visible: false,
    maximo: 40,

    get otraVista() {
      return this.vista === 'original' ? 'sintetico' : 'original';
    },
    ancho(v) {
      return this.visible ? (v / this.maximo) * 100 : 0;
    },
    get anchoPromedio() {
      return (this.promedio / this.maximo) * 100;
    },
    /** Brecha en puntos porcentuales entre el grupo `a` y el grupo `b` de una variable. */
    brecha(variable, vista = this.vista) {
      const tasa = (nombre) => variable.grupos.find((g) => g.nombre === nombre)[vista];
      return tasa(variable.a) - tasa(variable.b);
    },
    /**
     * Filas de la tabla accesible: una por grupo. Se aplana aquí porque anidar dos
     * <template x-for> dentro de un <tbody> invierte el orden de los bloques.
     */
    get filasTabla() {
      return this.variables.flatMap((v) => v.grupos.map((g) => ({ variable: v.nombre, ...g })));
    },
    /** ¿La brecha original sobrevive en el sintético? */
    estado(variable) {
      const original = Math.abs(this.brecha(variable, 'original'));
      const sintetico = Math.abs(this.brecha(variable, 'sintetico'));
      if (original < 1) return 'Sin brecha';
      return sintetico < original / 2 ? 'Se pierde' : 'Se conserva';
    },
    tooltip(evento, g) {
      this.mostrarTip(
        evento,
        `${g.nombre} · ${this.vista === 'original' ? 'originales' : 'sintéticos'}`,
        Formato.pct(g[this.vista]),
        `Original ${Formato.pct(g.original)} · sintético ${Formato.pct(g.sintetico)}`
      );
    },
  }));

  /** Niveles de acceso a los datos (modelo Five Safes). */
  Alpine.data('nivelesAcceso', () => ({
    niveles: D.taller4.accesos,
    seleccion: 2, // "Público" al inicio
    get actual() {
      return this.niveles[this.seleccion];
    },
  }));
});

/* -----------------------------------------------------------------------------
   11. APARICIÓN AL HACER SCROLL
   Los elementos con la clase .revelar aparecen suavemente al entrar en pantalla.
   Funciona sin Alpine; si el navegador no lo soporta, se muestran de inmediato.
   --------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const elementos = document.querySelectorAll('.revelar');
  if (!('IntersectionObserver' in window) || prefiereMenosMovimiento()) {
    elementos.forEach((el) => el.classList.add('visible'));
    return;
  }
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.04 }
  );
  elementos.forEach((el) => observador.observe(el));
});
