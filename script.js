document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const modulosInput = document.getElementById('modulos');
    const lineasSelect = document.getElementById('lineas');
    const nivelesInput = document.getElementById('niveles');
    const largueroSelect = document.getElementById('larguero-size');
    const escalaSelect = document.getElementById('escala-size');
    const lineasTip = document.getElementById('lineas-tip');

    const resEscalas = document.getElementById('res-escalas');
    const resLargueros = document.getElementById('res-largueros');
    const resSubtotal = document.getElementById('res-subtotal');
    const resIva = document.getElementById('res-iva');
    const resTotal = document.getElementById('res-total');
    const btnWhatsapp = document.getElementById('btn-whatsapp');

    // Precios base
    const PRECIO_LARGUERO = 45.00;
    const PRECIO_ESCALA_POR_METRO = 45.00; // $45 por metro de altura
    const IVA = 0.13;
    const TELEFONO_WHATSAPP = "50370000000"; // Sustituir por tu número de WhatsApp real

    // Generar opciones de escala de 1 a 10 metros (de 1 en 1)
    function cargarOpcionesEscala() {
        escalaSelect.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i} Metro${i > 1 ? 's' : ''}`;
            if (i === 2) option.selected = true; // Opción predeterminada
            escalaSelect.appendChild(option);
        }
    }

    // Actualizar dinámicamente el selector de distribución (unidos vs. separados)
    function actualizarOpcionesLineas() {
        const modulos = parseInt(modulosInput.value) || 1;
        const valorPrevio = parseInt(lineasSelect.value) || 1;
        
        lineasSelect.innerHTML = '';

        // Opción 1: Un solo estante continuo (unidos)
        const optUnidos = document.createElement('option');
        optUnidos.value = 1;
        optUnidos.textContent = `1 Batería continua (${modulos} módulo${modulos > 1 ? 's unidos' : ''})`;
        lineasSelect.appendChild(optUnidos);

        // Opción 2: Estantes independientes (separados) si hay 2 o más módulos
        if (modulos > 1) {
            const optSeparados = document.createElement('option');
            optSeparados.value = modulos;
            optSeparados.textContent = `${modulos} Estantes independientes / separados`;
            lineasSelect.appendChild(optSeparados);

            // Preservar la selección previa si sigue siendo válida
            if (valorPrevio === modulos) {
                optSeparados.selected = true;
            }
        }
    }

    // Lógica de cálculo principal
    function calcularCotizacion() {
        const modulos = parseInt(modulosInput.value) || 1;
        const lineas = parseInt(lineasSelect.value) || 1;
        const niveles = parseInt(nivelesInput.value) || 1;
        const metrosAltura = parseInt(escalaSelect.value) || 1;

        // FÓRMULA DE ESCALAS:
        // Cada batería/línea requiere (módulos_por_línea + 1) escalas.
        // Ej. 2 módulos unidos en 1 línea = 3 escalas.
        // Ej. 2 módulos separados en 2 líneas = 2 * (1 + 1) = 4 escalas.
        const modulosPorLinea = modulos / lineas;
        const escalasPorLinea = modulosPorLinea + 1;
        const cantidadEscalas = Math.round(escalasPorLinea * lineas);

        // LARGUEROS: 2 largueros por nivel en cada módulo (frontal y trasero)
        const cantidadLargueros = modulos * niveles * 2;

        // CÁLCULOS MONETARIOS:
        // Costo por escala = Altura en metros * $45
        const precioUnitarioEscala = metrosAltura * PRECIO_ESCALA_POR_METRO;
        const costoTotalEscalas = cantidadEscalas * precioUnitarioEscala;
        const costoTotalLargueros = cantidadLargueros * PRECIO_LARGUERO;

        const subtotal = costoTotalEscalas + costoTotalLargueros;
        const montoIva = subtotal * IVA;
        const total = subtotal + montoIva;

        // Feedback informativo al usuario
        if (lineas === 1 && modulos > 1) {
            lineasTip.textContent = "💡 Al estar unidos, ahorras dinero compartiendo escalas intermedias.";
            lineasTip.style.color = "var(--primary)";
        } else if (lineas > 1) {
            lineasTip.textContent = "ℹ️ Configuración de estantes independientes (requiere más escalas).";
            lineasTip.style.color = "var(--text-muted)";
        } else {
            lineasTip.textContent = "Configuración básica de 1 módulo.";
            lineasTip.style.color = "var(--text-muted)";
        }

        // Actualizar valores en pantalla
        resEscalas.textContent = cantidadEscalas;
        resLargueros.textContent = cantidadLargueros;
        resSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        resIva.textContent = `$${montoIva.toFixed(2)}`;
        resTotal.textContent = `$${total.toFixed(2)}`;

        return {
            modulos,
            lineas,
            niveles,
            largueroLargo: largueroSelect.value,
            escalaAlto: metrosAltura,
            precioEscalaUnitario: precioUnitarioEscala,
            cantidadEscalas,
            cantidadLargueros,
            total: total.toFixed(2)
        };
    }

    // Integración para envío directo a WhatsApp
    function enviarWhatsApp() {
        const datos = calcularCotizacion();
        const tipoDistribucion = datos.lineas === 1 
            ? `${datos.modulos} módulo(s) UNIDOS (Batería continua)` 
            : `${datos.modulos} estante(s) INDEPENDIENTES / SEPARADOS`;
        
        const mensaje = `*COTIZACIÓN DE RACK INDUSTRIAL*%0A` +
            `----------------------------------%0A` +
            `• *Total Módulos:* ${datos.modulos}%0A` +
            `• *Distribución:* ${tipoDistribucion}%0A` +
            `• *Niveles por módulo:* ${datos.niveles}%0A` +
            `• *Largo de larguero:* ${datos.largueroLargo}m%0A` +
            `• *Alto de escala:* ${datos.escalaAlto}m ($${datos.precioEscalaUnitario} c/u)%0A` +
            `----------------------------------%0A` +
            `• *Escalas requeridas:* ${datos.cantidadEscalas}%0A` +
            `• *Largueros requeridos:* ${datos.cantidadLargueros}%0A` +
            `• *TOTAL ESTIMADO (IVA Inc):* $${datos.total}%0A` +
            `----------------------------------%0A` +
            `Deseo confirmar disponibilidad y detalles de entrega.`;

        const url = `https://api.whatsapp.com/send?phone=${TELEFONO_WHATSAPP}&text=${mensaje}`;
        window.open(url, '_blank');
    }

    // Inicialización del sistema
    cargarOpcionesEscala();
    actualizarOpcionesLineas();

    // Event Listeners
    modulosInput.addEventListener('input', () => {
        actualizarOpcionesLineas();
        calcularCotizacion();
    });
    lineasSelect.addEventListener('change', calcularCotizacion);
    nivelesInput.addEventListener('input', calcularCotizacion);
    largueroSelect.addEventListener('change', calcularCotizacion);
    escalaSelect.addEventListener('change', calcularCotizacion);
    btnWhatsapp.addEventListener('click', enviarWhatsApp);

    // Cálculo inicial
    calcularCotizacion();
});