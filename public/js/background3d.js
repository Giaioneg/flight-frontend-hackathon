/**
 * FlightOnTime - Sistema de Predicción de Riesgos de Vuelos
 * Background 3D: Renderizado del modelo Airbus A380
 * Autor: Flight Frontend Hackathon Team
 * Versión: 1.0.0
 * Dependencias: Three.js, GLTFLoader
 */

class Background3D {
    /**
     * Constructor de la clase Background3D
     * @param {string} containerId - ID del contenedor donde se renderizará el modelo 3D
     */
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`❌ Container with id '${containerId}' not found`);
            return;
        }

        // Propiedades de la escena 3D
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.animationId = null;

        console.log(`🚀 Inicializando Background3D en container: ${containerId}`);
        this.init();
    }

    /**
     * Inicializa todos los componentes de la escena 3D
     */
    init() {
        console.log('🔧 Inicializando componentes 3D...');
        this.setupScene();
        this.createLights();
        this.createModel();
        this.setupCamera();
        this.setupRenderer();
        this.animate();
        this.handleResize();
        console.log('✅ Componentes 3D inicializados');
    }

    /**
     * Configura la escena Three.js
     */
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparente para que se vea el fondo original
        console.log('🎬 Escena configurada con fondo transparente');
    }

    /**
     * Crea y configura las luces de la escena
     */
    createLights() {
        // Luz ambiental para iluminación general
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Luz direccional para sombras y profundidad
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        console.log('💡 Luces configuradas: ambiental y direccional');
    }

    /**
     * Carga el modelo 3D del avión con fallback a modelo geométrico
     */
    createModel() {
        console.log('✈️ Creando modelo de avión...');
        
        // Crear modelo de respaldo inmediatamente pero invisible
        this.createFallbackModel();
        
        // Intentar cargar modelo GLTF después de un retraso mayor
        setTimeout(() => {
            this.tryLoadGLTFModel();
        }, 2000);
    }

    /**
     * Intenta cargar el modelo GLTF del Airbus A380
     */
    tryLoadGLTFModel() {
        console.log('🔍 Verificando disponibilidad de GLTFLoader...');
        console.log('THREE disponible:', typeof THREE !== 'undefined');
        console.log('GLTFLoader disponible:', typeof THREE.GLTFLoader !== 'undefined');
        
        // Verificar si GLTFLoader está disponible
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.error('❌ GLTFLoader no está disponible. Manteniendo modelo de respaldo.');
            console.log('Posibles soluciones:');
            console.log('1. Recargar la página');
            console.log('2. Deshabilitar extensiones del navegador que puedan interferir');
            console.log('3. Usar modo incógnito');
            return;
        }

        console.log('✅ GLTFLoader disponible, intentando cargar modelo A380...');
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            'assets/models/a380.glb',
            (gltf) => {
                console.log('📦 Modelo GLTF cargado:', gltf);
                console.log('🔍 Escena del modelo:', gltf.scene);
                console.log('📊 Número de mallas en el modelo:', gltf.scene.children.length);
                
                // Remover el modelo de respaldo si existe
                if (this.model) {
                    this.scene.remove(this.model);
                }
                
                this.model = gltf.scene;
                
                // Escalar y posicionar el modelo A380 - más grande y detallado
                this.model.scale.set(0.003, 0.003, 0.003); // Más grande para mejor detalle
                this.model.position.set(0, 0, 0);
                
                // Centrar el modelo
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                console.log('📏 Dimensiones del modelo:', size);
                console.log('🎯 Centro del modelo:', center);
                
                this.model.position.sub(center);
                
                // Ajustar escala basado en el tamaño real del modelo - más grande y detallado
                const maxDimension = Math.max(size.x, size.y, size.z);
                if (maxDimension > 10) {
                    const scale = 4 / maxDimension; // Más grande para mejor detalle
                    this.model.scale.set(scale, scale, scale);
                    console.log('🔧 Escala ajustada a:', scale);
                }
                
                // Hacer visible el modelo GLTF inmediatamente si el contenedor ya está visible
                const modelContainer = document.getElementById('model-3d-container');
                if (modelContainer && modelContainer.classList.contains('loaded')) {
                    this.model.visible = true;
                } else {
                    this.model.visible = false; // Mantener invisible hasta que el contenedor esté listo
                }
                
                this.scene.add(this.model);
                console.log('🎉 Modelo A380 personalizado cargado exitosamente');
            },
            (progress) => {
                if (progress.lengthComputable) {
                    console.log('📥 Progreso de carga:', (progress.loaded / progress.total * 100).toFixed(1) + '%');
                } else {
                    console.log('📥 Cargando...', progress.loaded, 'bytes');
                }
            },
            (error) => {
                console.error('❌ Error cargando el modelo GLTF:', error);
                console.log('Detalles del error:', error.message || error);
                console.log('Manteniendo modelo de respaldo.');
            }
        );
    }

    /**
     * Crea un modelo geométrico de respaldo en forma de avión
     */
    createFallbackModel() {
        console.log('🛠️ Creando modelo de respaldo del avión...');
        
        const group = new THREE.Group();

        // Material metálico para el avión
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x4A90E2,
            emissive: 0x112244,
            shininess: 100,
            specular: 0x222222
        });
        
        // Fuselaje principal
        const fuselageGeometry = new THREE.CylinderGeometry(0.5, 0.8, 6, 32);
        const fuselage = new THREE.Mesh(fuselageGeometry, material);
        fuselage.rotation.z = Math.PI / 2;
        group.add(fuselage);

        // Alas principales
        const wingGeometry = new THREE.BoxGeometry(8, 0.2, 2);
        const wings = new THREE.Mesh(wingGeometry, material);
        wings.position.y = 0;
        group.add(wings);

        // Cola del avión
        const tailGeometry = new THREE.BoxGeometry(0.3, 2, 0.8);
        const tailMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xDC143C,
            emissive: 0x8B0000,
            shininess: 100
        });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-1.8, 0.7, 0);
        group.add(tail);

        // Estabilizadores horizontales
        const horizontalTailGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.3);
        const horizontalTail = new THREE.Mesh(horizontalTailGeometry, tailMaterial);
        horizontalTail.position.set(-1.8, 0.5, 0);
        group.add(horizontalTail);

        // Hacer el modelo invisible inicialmente
        group.visible = false;

        this.model = group;
        this.scene.add(this.model);
        
        console.log('✅ Modelo de respaldo A380 creado (invisible inicialmente)');
        console.log('📊 Total de mallas en la escena:', this.scene.children.length);
    }

    /**
     * Configura la cámara perspectiva para la escena 3D
     */
    setupCamera() {
        console.log('📷 Configurando cámara...');
        
        this.camera = new THREE.PerspectiveCamera(
            60, // Ángulo más amplio para mejor visibilidad
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 12; // Más cerca para mejor detalle
        this.camera.position.y = 0; // Nivelado con el avión
        this.camera.lookAt(0, 0, 0);
        
        console.log('📐 Cámara configurada: posición', this.camera.position);
    }

    /**
     * Configura el renderizador WebGL para la escena 3D
     */
    setupRenderer() {
        console.log('🎨 Configurando renderizador...');
        
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, // Permitir transparencia
            antialias: true 
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight); // Pantalla completa
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limitar para rendimiento
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Configurar el canvas para pantalla completa
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.borderRadius = '0';
        this.renderer.domElement.style.display = 'block';

        console.log('📐 Canvas dimensions: pantalla completa');
        console.log('📱 Device pixel ratio:', window.devicePixelRatio);
        console.log('🖼️ Pixel ratio limitado a:', Math.min(window.devicePixelRatio, 2));

        // Usar el contenedor específico para el modelo 3D
        const modelContainer = document.getElementById('model-3d-container');
        if (modelContainer) {
            modelContainer.appendChild(this.renderer.domElement);
            console.log('✅ Canvas agregado al contenedor del modelo 3D');
            
            // Mostrar todo solo cuando esté completamente listo
            setTimeout(() => {
                // Hacer visible el modelo (ya sea geométrico o GLTF)
                if (this.model) {
                    this.model.visible = true;
                }
                
                // Mostrar el contenedor con transición suave
                modelContainer.classList.add('loaded');
                console.log('🎬 Modelo 3D completamente visible y listo');
            }, 2500); // Tiempo mayor para asegurar que todo esté cargado
        } else {
            console.error('❌ No se encontró el contenedor del modelo 3D');
        }
    }

    /**
     * Bucle de animación principal para rotar el modelo 3D
     */
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Rotación con radio más amplio para mejor apreciación
        if (this.model) {
            // Rotación en eje Y
            this.model.rotation.y += 0.005;
            
            // Movimiento circular amplio para mostrar el avión desde diferentes ángulos
            const time = Date.now() * 0.001;
            const radius = 3; // Radio más amplio
            this.model.position.x = Math.sin(time) * radius;
            this.model.position.z = Math.cos(time) * radius + 12; // Mantener distancia de la cámara
        }

        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Maneja el redimensionamiento de la ventana manteniendo el diseño responsive
     */
    handleResize() {
        // Mantener el diseño responsive al cambiar el tamaño de la ventana
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        console.log('📱 Ventana redimensionada - Diseño responsive mantenido');
    }

    /**
     * Limpia los recursos de la escena 3D para evitar memory leaks
     */
    destroy() {
        console.log('🧹 Limpiando recursos 3D...');
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            console.log('⏹️ Animación detenida');
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
                console.log('🗑️ Canvas removido del DOM');
            }
        }
        
        console.log('✅ Recursos 3D liberados');
    }
}

/**
 * Event listener para manejar el redimensionamiento de ventana
 */
window.addEventListener('resize', () => {
    if (window.background3D) {
        window.background3D.handleResize();
    }
});

console.log('🎮 Background3D class loaded successfully');
