# Activismo de Datos: Pobreza Multidimensional en la Encuesta CASEN 2024
### ETI195 — Ética para Ciencia de Datos y Estadística

[![GitHub Pages](https://img.shields.io/badge/Sitio%20Web-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://sergiohdezdc.github.io/Taller_ETI195_Casen2024/)
[![Status](https://img.shields.io/badge/Entrega-Final%20Taller%204-success?style=for-the-badge)](https://github.com/SergioHdezDC/Taller_ETI195_Casen2024)

> **Sitio Web Oficial del Proyecto:**  
> 🌐 **[https://sergiohdezdc.github.io/Taller_ETI195_Casen2024/](https://sergiohdezdc.github.io/Taller_ETI195_Casen2024/)**

---

## 👥 Integrantes del Grupo
1. **Sergio Andrés Hernández Salgado**
2. **Marco Antonio Ramírez Gaete**
3. **Reinaldo Rodrigo Oliva Morales**
4. **Juan Tomás José Lepivil Vigueras**

---

## 📖 Resumen del Proyecto

Este repositorio reúne el trabajo desarrollado durante todo el semestre en el curso **ETI195 (Ética para Ciencia de Datos y Estadística)**, estructurado como un **proyecto de activismo de datos** sobre la **Encuesta CASEN 2024** (Ministerio de Desarrollo Social y Familia de Chile), centrado en la variable objetivo `pobreza_multi` (**Pobreza Multidimensional**).

A través de cuatro talleres sumativos, auditamos críticamente los datos y modelos que sustentan las políticas sociales del país:

1. **Taller 1 — Análisis y Exploración (La Trampa de la Representatividad):**
   - Detección de sesgos de muestreo y desbalances severos (97.58% heterosexual, escasa representación LGBTIQ+ y de pueblos originarios).
   - Análisis de subpoblaciones interseccionales (*Sexo × Orientación Sexual × Alfabetismo*), advirtiendo el riesgo de correlaciones espurias derivadas de la escasez muestral (*Gender Shades*, Buolamwini & Gebru, 2018).

2. **Taller 2 — Sesgos, Justicia y Discriminación Algorítmica:**
   - Entrenamiento de un Árbol de Decisión (accuracy 93.59%) y auditoría de equidad (*Fairness*) con **Aequitas**.
   - **Hallazgo:** El modelo mostró una Tasa de Falsos Negativos (FNR) del **31.12% para personas con dificultad de cuidado personal (discapacidad)**, frente al **17.94%** en personas sin dificultad (+73.5% de error en contra del grupo vulnerable).
   - Evaluación crítica del algoritmo `EqOddsPostProcessing`: la paridad forzada "igualó hacia abajo", aumentando deliberadamente el error del grupo mayoritario y reduciendo la precisión global a 87.3%.

3. **Taller 3 — Explicabilidad Algorítmica (LIME y SHAP):**
   - **LIME + BETO:** Auditoría de lenguaje natural institucional demostrando que palabras de contexto como *"pobreza"* o *"carencias"* sesgan la predicción hacia negativo incluso en resoluciones administrativas aprobadas.
   - **SHAP + Random Forest:** Explicabilidad global y local (valores de Shapley) sobre la pobreza multidimensional. Análisis del impacto del tamaño del hogar, hacinamiento y desentrañamiento de *falsos negativos individuales*.

4. **Taller 4 — Derechos Humanos, Privacidad Diferencial y Activismo de Datos:**
   - Evaluación de la CASEN según los 6 principios de derechos humanos del Alto Comisionado de la ONU (OHCHR, 2018) y la legislación chilena (Ley 19.628, Ley 21.719 y su postergación a octubre de 2027).
   - Implementación de **Privacidad Diferencial** con `DataSynthesizer` ($\epsilon = 1$, red bayesiana).
   - **Hallazgo de Activismo:** Mientras las pruebas estadísticas agregadas decían que los datos sintéticos eran idénticos, **el algoritmo borró casi por completo la brecha de pobreza de los pueblos indígenas** (cayó de 7.2 puntos porcentuales en la realidad a solo 1.0 punto en el sintético), visibilizando el riesgo de que la anonimización técnica termine invisibilizando a las minorías.

---

## 📂 Estructura del Repositorio

```text
├── index.html                        # Sitio web estático principal para GitHub Pages
├── styles.css                        # Estilos responsivos y modernos del sitio
├── README.md                         # Documentación general del proyecto
├── Taller sumativo I ETI195.ipynb    # Cuaderno Jupyter Taller 1
├── TallerSumativo_2_Casen.ipynb      # Cuaderno Jupyter Taller 2
├── Taller_sumativo_3_completo.ipynb  # Cuaderno Jupyter Taller 3
├── Taller_sumativo_4_CASEN.ipynb     # Cuaderno Jupyter Taller 4
├── Taller_sumativo_4_CASEN.pdf       # Entrega oficial Taller 4 en formato PDF (1.05 MB)
├── assets/
│   └── images/                       # Visualizaciones y gráficos de los talleres
├── data/                             # Dataset CASEN 2024 y libros de códigos
└── docs/                             # Documentación metodológica y diseño muestral
```

---

## 🚀 Cómo activar GitHub Pages en este repositorio

Para que el sitio web quede público en la URL asignada, sigue estos 3 pasos:

1. Ve a la pestaña **Settings** (Configuración) de este repositorio en GitHub:  
   `https://github.com/SergioHdezDC/Taller_ETI195_Casen2024/settings`
2. En el menú lateral izquierdo, haz clic en **Pages**.
3. En la sección **Build and deployment** / **Branch**:
   - Selecciona la rama: `main`
   - Selecciona la carpeta: `/ (root)`
   - Haz clic en **Save** (Guardar).
4. Espera 1 minuto y tu sitio estará publicado en:  
   👉 **`https://sergiohdezdc.github.io/Taller_ETI195_Casen2024/`**

---

## 📄 Entregables para Canvas
- **Notebook Taller 4:** [`Taller_sumativo_4_CASEN.ipynb`](./Taller_sumativo_4_CASEN.ipynb)
- **PDF Taller 4:** [`Taller_sumativo_4_CASEN.pdf`](./Taller_sumativo_4_CASEN.pdf)
- **Enlace al repositorio:** `https://github.com/SergioHdezDC/Taller_ETI195_Casen2024`
- **Sitio Web GitHub Pages:** `https://sergiohdezdc.github.io/Taller_ETI195_Casen2024/`

---
*ETI195 — Ética para Ciencia de Datos y Estadística | Noviembre 2026*
