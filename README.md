# ✈️ FlightOnTime - Sistema de Predicción de Riesgos de Vuelos

Una aplicación web moderna y elegante que utiliza inteligencia artificial para predecir riesgos en vuelos, con una interfaz 3D interactiva y diseño responsive.

## 🚀 Características Principales

### ✨ **Diseño Visual**
- **Modelo 3D Interactivo**: Airbus A380 rotando con radio amplio para mejor visualización
- **Gradientes Dinámicos**: Títulos con efectos de gradiente animados en escalas de rojo y azul
- **Diseño Responsive**: Totalmente adaptado para desktop, tablet y móviles
- **Efectos Visuales**: Blur moderno, animaciones suaves y transiciones fluidas

### 🎯 **Funcionalidades**
- **Predicción de Riesgos**: Análisis inteligente basado en múltiples factores
- **Autocompletado**: Búsqueda inteligente de aerolíneas y aeropuertos
- **Interfaz Intuitiva**: Diseño centrado en la experiencia del usuario
- **Resultados Visuales**: Presentación clara de probabilidades con colores indicativos

### 🛠️ **Tecnologías Utilizadas**

#### **Frontend**
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con animaciones y efectos visuales
- **JavaScript ES6+**: Lógica de aplicación y manejo de eventos
- **Three.js**: Renderizado 3D del modelo Airbus A380
- **GLTFLoader**: Carga de modelos 3D optimizados

#### **Diseño y Estilos**
- **CSS Grid & Flexbox**: Layout responsive y moderno
- **CSS Variables**: Sistema de diseño consistente
- **Media Queries**: Adaptación a diferentes dispositivos
- **CSS Animations**: Efectos visuales dinámicos
- **Backdrop Filters**: Efectos de blur y transparencia

## 📱 **Diseño Responsive**

### **Desktop (>768px)**
- Layout centrado con espaciado amplio
- Modelo 3D de fondo pantalla completa
- Títulos grandes con gradientes dinámicos
- Interacciones hover refinadas

### **Tablet (≤768px)**
- Espaciado reducido para optimizar espacio
- Textos escalables con `clamp()`
- Botones táctiles optimizados
- Modelo 3D adaptativo

### **Móvil (≤480px)**
- Diseño compacto y eficiente
- Padding mínimo para máximo contenido
- Botones grandes para fácil interacción
- Textos optimizados para legibilidad

## 🎨 **Sistema de Diseño**

### **Colores**
- **Primario**: Azul profundo (`#0056b3`)
- **Secundario**: Azul medio (`#00a8e8`)
- **Acento**: Rojo intenso (`#dc3545`)
- **Fondo**: Gradiente azul cielo a blanco

### **Tipografía**
- **Fuente**: Inter (Google Fonts)
- **Pesos**: 300-700 para jerarquía visual
- **Escalado**: Fluid con `clamp()` y unidades `vw`

### **Efectos Visuales**
- **Blur**: `backdrop-filter: blur()` para profundidad
- **Sombras**: Múltiples capas para realismo
- **Gradientes**: Animados con `background-position`
- **Transiciones**: `cubic-bezier` para movimientos naturales

## 🚀 **Instalación y Configuración**

### **Prerrequisitos**
- Navegador moderno con soporte WebGL
- Conexión a internet para cargar modelos 3D
- Servidor local para desarrollo

### **Instalación**
```bash
# Clonar el repositorio
git clone <repository-url>

# Navegar al directorio
cd flight-frontend-hackathon

# Iniciar servidor local
python -m http.server 8000
# o
npx serve .
```

### **Configuración del Modelo 3D**
1. Colocar el archivo `a380.glb` en `public/assets/models/`
2. Verificar que el modelo esté optimizado para web
3. Ajustar escala y posición en `background3d.js` si es necesario

## 📁 **Estructura del Proyecto**

```
flight-frontend-hackathon/
├── public/
│   ├── index.html          # Página principal
│   ├── css/
│   │   └── style.css      # Estilos principales
│   ├── js/
│   │   └── background3d.js # Lógica 3D y animaciones
│   └── assets/
│       └── models/
│           └── a380.glb    # Modelo 3D del avión
└── README.md              # Documentación del proyecto
```

## 🎮 **Uso de la Aplicación**

### **Predicción de Riesgos**
1. **Seleccionar Aerolínea**: Usar el autocompletado o escribir manualmente
2. **Elegir Aeropuerto**: Seleccionar del menú desplegable
3. **Configurar Fecha**: Usar el selector de fechas
4. **Establecer Hora**: Seleccionar hora del vuelo
5. **Predecir Riesgo**: Hacer clic en el botón de predicción

### **Interacción 3D**
- El modelo A380 rota continuamente en un radio amplio
- La rotación muestra múltiples ángulos del avión
- El modelo se adapta al tamaño de la pantalla

## 🔧 **Personalización y Configuración**

### **Ajustes del Modelo 3D**
```javascript
// En background3d.js
this.model.scale.set(0.003, 0.003, 0.003); // Escala
this.camera.position.z = 12; // Distancia de cámara
const radius = 3; // Radio de rotación
```

### **Modificación de Colores**
```css
/* En style.css */
:root {
    --primary: #0056b3;    // Color primario
    --secondary: #00a8e8;  // Color secundario
    --danger: #dc3545;     // Color de riesgo
}
```

### **Ajustes Responsive**
```css
/* Media queries personalizadas */
@media (max-width: 768px) {
    /* Estilos para tablet */
}
@media (max-width: 480px) {
    /* Estilos para móvil */
}
```

## 🐛 **Solución de Problemas Comunes**

### **Modelo 3D no carga**
- Verificar ruta del archivo `a380.glb`
- Comprobar que el navegador soporte WebGL
- Revisar consola para errores de GLTFLoader

### **Diseño no responsive**
- Verificar meta tag viewport en HTML
- Comprobar media queries en CSS
- Validar unidades relativas

### **Animaciones lentas**
- Reducir complejidad de animaciones CSS
- Optimizar modelo 3D
- Limitar pixel ratio del renderer

## 🚀 **Mejoras Futuras**

### **Funcionalidades**
- [ ] Integración con API de datos de vuelos en tiempo real
- [ ] Sistema de notificaciones de alertas
- [ ] Historial de predicciones
- [ ] Exportación de resultados

### **Técnicas**
- [ ] Implementación de Service Worker para offline
- [ ] Optimización de carga con lazy loading
- [ ] Migración a TypeScript
- [ ] Testing automatizado

## 📄 **Licencia**

Este proyecto está desarrollado como parte del Flight Frontend Hackathon.

## 👥 **Contribución**

1. Fork del proyecto
2. Crear rama de funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📞 **Contacto y Soporte**

Para soporte técnico o preguntas sobre el proyecto:
- Revisar la documentación técnica
- Consultar la consola del navegador para errores
- Verificar compatibilidad del navegador

---

**✈️ FlightOnTime** - Transformando la predicción de riesgos aéreos con tecnología de vanguardia y diseño excepcional.