/**
 * FlightOnTime - Sistema de Predicción de Riesgos de Vuelos
 * Script principal: Manejo de autocompletado y lógica de predicción
 * Autor: Flight Frontend Hackathon Team
 * Versión: 1.0.0
 */

// --- 1. DATOS DE RESPALDO (FALLBACK) ---
// Los definimos AL PRINCIPIO para que siempre existan, por si falla el fetch.
const backupData = {
    airports: [
        { label: "ATL - Atlanta Municipal", value: "Atlanta Municipal", code: "ATL" },
        { label: "JFK - John F. Kennedy International", value: "John F. Kennedy International", code: "JFK" },
        { label: "LAX - Los Angeles International", value: "Los Angeles International", code: "LAX" },
        { label: "ORD - Chicago O'Hare International", value: "Chicago O'Hare International", code: "ORD" },
        { label: "MIA - Miami International", value: "Miami International", code: "MIA" },
        { label: "SFO - San Francisco International", value: "San Francisco International", code: "SFO" }
    ],
    carriers: [
        { label: "AA - American Airlines Inc.", value: "American Airlines Inc." },
        { label: "DL - Delta Air Lines Inc.", value: "Delta Air Lines Inc." },
        { label: "WN - Southwest Airlines Co.", value: "Southwest Airlines Co." },
        { label: "UA - United Air Lines Inc.", value: "United Air Lines Inc." },
        { label: "B6 - JetBlue Airways", value: "JetBlue Airways" }
    ]
};

/**
 * Configura el autocompletado para campos de formulario
 * @param {string} inputId - ID del campo de input
 * @param {string} listId - ID del contenedor de sugerencias
 * @param {string} hiddenId - ID del campo oculto para el valor real
 * @param {Array} dataArray - Array de datos para el autocompletado
 */
function setupAutocomplete(inputId, listId, hiddenId, dataArray) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    const hidden = document.getElementById(hiddenId);

    // Protección contra errores si los elementos no existen
    if (!input || !list || !hidden) {
        console.warn(`⚠️ Elementos no encontrados para autocompletado: ${inputId}, ${listId}, ${hiddenId}`);
        return;
    }

    // Evento input para filtrar y mostrar sugerencias
    input.addEventListener("input", function() {
        const val = this.value.toUpperCase();
        list.innerHTML = ""; 
        if (!val) return;

        // Filtrar coincidencias por etiqueta o código
        const matches = dataArray.filter(item => {
            return item.label.toUpperCase().includes(val) || (item.code && item.code.includes(val));
        });

        // Crear elementos de sugerencia
        matches.forEach(item => {
            const div = document.createElement("div");
            // Resaltar la parte coincidente
            div.innerHTML = item.label.replace(new RegExp(val, "gi"), (match) => `<strong>${match}</strong>`);
            
            // Evento click para seleccionar opción
            div.addEventListener("click", function() {
                input.value = item.label; 
                hidden.value = item.value; 
                list.innerHTML = ""; 
                console.log(`✅ Seleccionado: ${item.label}`);
            });
            list.appendChild(div);
        });
    });

    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener("click", function(e) {
        if (e.target !== input) list.innerHTML = "";
    });
}

// --- 3. CARGA DE DATOS (Lógica Corregida) ---
console.log("🚀 Iniciando carga de datos para FlightOnTime...");

/**
 * Carga los datos desde archivo JSON externo con fallback a datos locales
 */
function loadData() {
    fetch('assets/frontend_options.json')
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar JSON externo");
            return response.json();
        })
        .then(data => {
            console.log("✅ Datos cargados desde JSON externo.");
            // Inicializar autocompletado con datos externos
            setupAutocomplete("airport-input", "airport-list", "airport-real-value", data.airports);
            setupAutocomplete("carrier-input", "carrier-list", "carrier-real-value", data.carriers);
        })
        .catch(error => {
            console.warn("⚠️ Falló la carga del JSON (¿CORS?). Usando datos de respaldo.", error);
            // Fallback a datos locales
            setupAutocomplete("airport-input", "airport-list", "airport-real-value", backupData.airports);
            setupAutocomplete("carrier-input", "carrier-list", "carrier-real-value", backupData.carriers);
        });
}

// Iniciar carga de datos
loadData();

// --- 4. LÓGICA DE SUBMIT (CONEXIÓN AL BACKEND) ---
/**
 * Maneja el envío del formulario de predicción
 */
function handleFormSubmit() {
    const form = document.getElementById("predictionForm");
    
    if (!form) {
        console.error("❌ Formulario no encontrado");
        return;
    }

    form.addEventListener("submit", async function(e) {
        e.preventDefault(); 

        // Elementos de UI
        const btn = document.querySelector(".btn-predict");
        const loader = document.getElementById("loader");
        const resultBox = document.getElementById("result");
        
        // Validación de campos requeridos
        const carrierReal = document.getElementById("carrier-real-value").value;
        const airportReal = document.getElementById("airport-real-value").value;
        const date = document.getElementById("date-input").value; 
        const time = document.getElementById("time-input").value;

        if (!carrierReal || !airportReal || !date || !time) {
            alert("⚠️ Por favor completa todos los campos");
            return;
        }

        // Mostrar loader y ocultar botón/resultados
        btn.style.display = "none";
        loader.style.display = "block";
        resultBox.style.display = "none";

        try {
            console.log("🔄 Enviando predicción...");
            
            // LLAMADA AL BACKEND REAL
            const response = await fetch("https://lay-represented-beverly-mix.trycloudflare.com/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    CARRIER_NAME: carrierReal,
                    DEPARTING_AIRPORT: airportReal,
                    FECHA: date,
                    HORA: time
                })
            });

            if (!response.ok) throw new Error("Error en la API");
            const data = await response.json();

            console.log("✅ Predicción recibida:", data);

            // Ocultar loader y mostrar botón
            loader.style.display = "none";
            btn.style.display = "block";
            
            // Procesar resultados
            displayResults(data);

        } catch (error) {
            console.error("❌ Error en la predicción:", error);
            loader.style.display = "none";
            btn.style.display = "block";
            alert("Error conectando con el servidor. Asegúrate de que 'main.py' esté corriendo.");
        }
    });
}

/**
 * Muestra los resultados de la predicción en la UI
 * @param {Object} data - Datos de respuesta del backend
 */
function displayResults(data) {
    const resultBox = document.getElementById("result");
    const isDelayed = data.prediction === "RETRASADO";
    const probPercent = (data.probability * 100).toFixed(0);

    resultBox.style.display = "block";
    resultBox.className = "result-box " + (isDelayed ? "result-danger" : "result-safe");
    
    document.getElementById("result-title").innerText = isDelayed ? "⚠️ ALTO RIESGO" : "✅ PUNTUAL";
    document.getElementById("result-percent").innerText = probPercent + "%";
    document.getElementById("result-msg").innerText = data.details || "Cálculo completado.";
}

// Inicializar manejador del formulario
handleFormSubmit();

// --- 5. INICIALIZACIÓN ---
/**
 * Establece la fecha actual por defecto en el campo de fecha
 */
function setDefaultDate() {
    const dateInput = document.getElementById("date-input");
    if (dateInput) {
        const today = new Date();
        dateInput.valueAsDate = today;
        console.log(`📅 Fecha por defecto establecida: ${today.toISOString().split('T')[0]}`);
    }
}

/**
 * Inicialización completa de la aplicación
 */
function initializeApp() {
    console.log("🚀 Inicializando FlightOnTime...");
    
    // Cargar datos
    loadData();
    
    // Configurar formulario
    handleFormSubmit();
    
    // Establecer fecha por defecto
    setDefaultDate();
    
    console.log("✅ FlightOnTime inicializado correctamente");
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}