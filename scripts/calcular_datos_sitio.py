"""
calcular_datos_sitio.py
=======================

Recalcula, a partir de la base CASEN 2024 del repositorio, las cifras
"deterministas" que usa el sitio web (docs/assets/js/datos.js):

  1. Taller 1 / Taller 4 · personas por grupo y % en pobreza multidimensional.
  2. Taller 4 · riesgo de reidentificación al sumar variables una a una
     (k-anonimidad: personas únicas y personas en grupos de menos de 5).

No recalcula los resultados de modelos (árbol, Random Forest, LIME, SHAP,
datos sintéticos): esos valores se copiaron de las salidas de los notebooks,
porque dependen de la ejecución y de las versiones de las librerías.

Uso (desde la raíz del repositorio):

    python scripts/calcular_datos_sitio.py

El resultado se imprime en formato JSON para compararlo con datos.js.
"""

import json
import sys
from pathlib import Path

import pandas as pd

# En Windows la consola puede no usar UTF-8: así las tildes se imprimen bien
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

RAIZ = Path(__file__).resolve().parent.parent
BASE = RAIZ / "data" / "casen_2024.csv"

# Variables sensibles que muestra el gráfico del Taller 1
VARIABLES_GRUPOS = ["sexo", "r3", "r1a", "area", "os1", "trans", "h7e"]

# Mismas 7 variables del Taller 4 (pregunta 5), en el orden en que el sitio
# las va "sumando" para mostrar cómo crece el riesgo de reidentificación.
ORDEN_REIDENTIFICACION = ["edad", "sexo", "area", "r1a", "r3", "tot_per_h", "pobreza_multi"]


def grupos_por_variable(df: pd.DataFrame) -> dict:
    """Personas y % en pobreza multidimensional para cada categoría."""
    es_pobre = df["pobreza_multi"].eq("Pobre")
    resultado = {}
    for variable in VARIABLES_GRUPOS:
        tabla = (
            df.assign(pobre=es_pobre)
            .groupby(variable)
            .agg(n=("pobre", "size"), pobreza=("pobre", "mean"))
        )
        resultado[variable] = [
            {"categoria": str(cat), "n": int(fila.n), "pobreza": round(100 * fila.pobreza, 2)}
            for cat, fila in tabla.iterrows()
        ]
    return resultado


def reidentificacion(df: pd.DataFrame) -> list:
    """Para 1, 2, ..., 7 variables: combinaciones, personas únicas (k = 1) y k < 5."""
    pasos = []
    for i in range(1, len(ORDEN_REIDENTIFICACION) + 1):
        columnas = ORDEN_REIDENTIFICACION[:i]
        # Tamaño del grupo al que pertenece cada persona (personas con la misma combinación)
        tamano_grupo = df.groupby(columnas)[columnas[0]].transform("size")
        pasos.append({
            "variable": columnas[-1],
            "combinaciones": int(df[columnas].drop_duplicates().shape[0]),
            "unicas": int((tamano_grupo == 1).sum()),
            "menos5": int((tamano_grupo < 5).sum()),
        })
    return pasos


def main() -> None:
    df = pd.read_csv(BASE)
    salida = {
        "dataset": {
            "personas": int(len(df)),
            "variables": int(df.shape[1]),
            "nulos": int(df.isnull().sum().sum()),
            "pctPobreza": round(100 * df["pobreza_multi"].eq("Pobre").mean(), 2),
        },
        "grupos": grupos_por_variable(df),
        "reidentificacion": reidentificacion(df),
    }
    print(json.dumps(salida, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
