import drawsvg as dw
import random

def create_login_background():
    """
    Genera un fondo SVG con un efecto de 'plasma' o 'energía' eléctrica.
    """
    d = dw.Drawing(800, 1200, origin='center', id_prefix='loginbg')
    d.set_pixel_scale(2)

    # Definir los filtros SVG en la sección <defs>
    # Este filtro crea el efecto de 'plasma' ruidoso
    plasma_filter = dw.Filter(id="plasma-filter")
    plasma_filter.append(dw.FeTurbulence(type='fractalNoise', baseFrequency='0.01 0.02', numOctaves=3, result='noise'))
    plasma_filter.append(dw.FeDisplacementMap(in2='noise', in_='SourceGraphic', scale=50, xChannelSelector='R', yChannelSelector='G'))
    
    # Este filtro crea el efecto de brillo (glow)
    glow_filter = dw.Filter(id="glow-filter", x="-50%", y="-50%", width="200%", height="200%")
    glow_filter.append(dw.FeGaussianBlur(stdDeviation=8, result="coloredBlur"))
    
    d.defs.append(plasma_filter)
    d.defs.append(glow_filter)

    # Fondo oscuro
    gradient = dw.LinearGradient(0, -600, 0, 600)
    gradient.add_stop(0, '#111827')
    gradient.add_stop(1, '#000000')
    d.append(dw.Rectangle(-400, -600, 800, 1200, fill=gradient))
    
    # Círculos de fondo con efecto de brillo
    for _ in range(10):
        d.append(dw.Circle(
            random.randint(-400, 400),
            random.randint(-600, 600),
            random.randint(50, 150),
            fill='#3b82f6',
            opacity=random.uniform(0.05, 0.15),
            filter=f'url(#glow-filter)' # Aplicar filtro de brillo
        ))

    # Líneas de energía con efecto de plasma
    path = dw.Path(stroke='#3b82f6', stroke_width=4, fill='none', opacity=0.7)
    path.M(-500, random.randint(-400, 400))
    for i in range(10):
        x = -500 + (i * 110)
        y = random.randint(-200, 200)
        path.L(x, y)
    
    # Aplicamos el filtro de plasma a una copia del path para no afectar al original
    d.append(dw.Use(path, filter=f'url(#plasma-filter)'))

    return d.as_svg()

if __name__ == '__main__':
    svg_content = create_login_background()
    with open("login_background_electric.svg", "w") as f:
        f.write(svg_content)
    print("Archivo 'login_background_electric.svg' generado con éxito.")