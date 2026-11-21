"""
extraer_figuras.py
==================

Copia algunas figuras originales de los notebooks (las salidas PNG de las
celdas) a docs/assets/img/, para mostrarlas en el sitio bajo
"Ver figura original del notebook".

Para agregar otra figura, suma una fila a FIGURAS con:
  (notebook, número de celda, número de imagen dentro de la celda, nombre de salida)
Las celdas se cuentan desde 0 (orden del archivo .ipynb).

Uso (desde la raíz del repositorio):

    python scripts/extraer_figuras.py
"""

import base64
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "docs" / "assets" / "img"

FIGURAS = [
    ("Taller sumativo I ETI195.ipynb", 20, 2, "t1_celda20_orientacion_sexual.png"),
    ("TallerSumativo_2_Casen.ipynb", 20, 0, "t2_celda20_matriz_confusion.png"),
    ("TallerSumativo_2_Casen.ipynb", 27, 0, "t2_celda27_errores_por_grupo.png"),
    ("Taller_sumativo_3_completo.ipynb", 15, 3, "t3_celda15_lime_frase9.png"),
    ("Taller_sumativo_3_completo.ipynb", 40, 0, "t3_celda40_shap_summary.png"),
    ("Taller_sumativo_3_completo.ipynb", 42, 0, "t3_celda42_shap_agregado.png"),
    ("Taller_sumativo_3_completo.ipynb", 43, 0, "t3_celda43_shap_waterfall.png"),
    ("Taller_sumativo_4_CASEN.ipynb", 35, 0, "t4_celda35_brechas_sintetico.png"),
]


def imagenes_de_celda(celda: dict) -> list:
    """Devuelve las imágenes PNG (en bytes) que produjo una celda de código."""
    imagenes = []
    for salida in celda.get("outputs", []):
        datos = salida.get("data", {})
        if "image/png" in datos:
            contenido = datos["image/png"]
            if isinstance(contenido, list):  # algunos notebooks lo guardan en trozos
                contenido = "".join(contenido)
            imagenes.append(base64.b64decode(contenido))
    return imagenes


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    for notebook, celda, indice, nombre in FIGURAS:
        with open(RAIZ / notebook, encoding="utf-8") as archivo:
            celdas = json.load(archivo)["cells"]
        imagenes = imagenes_de_celda(celdas[celda])
        if indice >= len(imagenes):
            print(f"[!] {notebook} celda {celda}: no tiene la imagen {indice}")
            continue
        (DESTINO / nombre).write_bytes(imagenes[indice])
        print(f"[ok] {nombre}  <-  {notebook} (celda {celda}, imagen {indice})")


if __name__ == "__main__":
    main()
