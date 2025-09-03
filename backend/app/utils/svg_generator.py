# backend/utils/svg_generator.py

import drawsvg as dw

def create_gym_icon_svg(primary_color="#3b82f6", secondary_color="#60a5fa"):
    """
    Genera un SVG moderno y estilizado de una mancuerna.
    
    Args:
        primary_color (str): El color principal del icono.
        secondary_color (str): Un color secundario o de acento.

    Returns:
        str: El contenido del archivo SVG como una cadena de texto.
    """
    d = dw.Drawing(200, 200, origin='center')

    # --- Estilos y Definiciones ---
    # Gradiente para un look más moderno
    gradient = dw.LinearGradient(x1="0", y1="0", x2="1", y2="1")
    gradient.add_stop(0, primary_color, 1)
    gradient.add_stop(1, secondary_color, 1)

    # --- Dibujo de la Mancuerna ---
    # Barra central
    d.append(dw.Rectangle(-40, -10, 80, 20, fill=gradient, rx=5, ry=5))

    # Pesas laterales
    # Lado izquierdo
    d.append(dw.Rectangle(-70, -30, 30, 60, fill=primary_color, rx=8, ry=8))
    d.append(dw.Rectangle(-65, -25, 20, 50, fill=secondary_color, rx=5, ry=5))

    # Lado derecho
    d.append(dw.Rectangle(40, -30, 30, 60, fill=primary_color, rx=8, ry=8))
    d.append(dw.Rectangle(45, -25, 20, 50, fill=secondary_color, rx=5, ry=5))

    return d.as_svg()

if __name__ == '__main__':
    # Esto te permite generar y guardar el archivo si ejecutas el script directamente
    svg_content = create_gym_icon_svg()
    with open("gym_icon.svg", "w") as f:
        f.write(svg_content)
    print("Archivo 'gym_icon.svg' generado con éxito.")