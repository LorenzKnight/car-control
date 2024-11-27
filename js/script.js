// Variables para controlar el carro
let isRunning = false;
let kilometers = 0;
let doorsLocked = true;
let sunroofOpen = false;
let trunkOpen = false;
let hoodOpen = false;
let lightsOn = false;
let reverseLightsOn = false;
let turnSignals = false;
let doorStates = {};

// Lógica para los botones del carro
document.getElementById('start-stop').addEventListener('click', () => {
    isRunning = !isRunning;
    updateKilometerDisplay();
});

document.getElementById('lock-unlock').addEventListener('click', () => {
    doorsLocked = !doorsLocked;
    document.getElementById('lock-unlock').textContent = doorsLocked ? 'Desbloquear' : 'Bloquear';
});

document.getElementById('open-trunk').addEventListener('click', () => {
    if (!doorsLocked) trunkOpen = !trunkOpen;
});

document.getElementById('open-hood').addEventListener('click', () => {
    if (!doorsLocked) hoodOpen = !hoodOpen;
});

document.getElementById('open-sunroof').addEventListener('click', () => {
    if (!doorsLocked) sunroofOpen = !sunroofOpen;
});

document.getElementById('open-doors').addEventListener('click', () => {
    if (!doorsLocked) {
        // Toggle doors open/close here
    }
});

document.getElementById('turn-lights').addEventListener('click', () => {
    lightsOn = !lightsOn;
    updateLights();
});

document.getElementById('turn-signals').addEventListener('click', () => {
    turnSignals = !turnSignals;
    updateTurnSignals();
});

document.getElementById('turn-reverse-light').addEventListener('click', () => {
    reverseLightsOn = !reverseLightsOn;
    updateReverseLight();
});

// Movimiento y control del auto con teclas
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        kilometers += 0.1; // Adelantar
    } else if (event.key === 'ArrowDown') {
        kilometers -= 0.1; // Retroceder
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        // Girar ruedas
        rotateWheels(event.key);
    }
    updateKilometerDisplay();
});

// Funciones auxiliares
function updateKilometerDisplay() {
    document.getElementById('kilometer-display').textContent = `Kilómetros: ${kilometers.toFixed(1)}`;
}

function updateLights() {
    document.getElementById('turn-lights').classList.toggle('lights-on', lightsOn);
}

function updateTurnSignals() {
    // Actualizar dirección de las luces direccionales
}

function updateReverseLight() {
    // Actualizar la luz de reversa
}


let rotationInterval;
let currentRotation = 0;
function rotateWheels(direction) {
    let frontWheels = document.getElementsByClassName('front-wheels');

    if (frontWheels.length > 0) {
        // Detener cualquier rotación anterior si la tecla se mantiene presionada
        clearInterval(rotationInterval);
        
        // Definir el intervalo para aumentar la rotación de las ruedas
        rotationInterval = setInterval(() => {
            if (direction === 'ArrowLeft' && currentRotation > -35) {
                currentRotation -= 1; // Disminuir el ángulo de rotación para la izquierda
            } else if (direction === 'ArrowRight' && currentRotation < 35) {
                currentRotation += 1; // Aumentar el ángulo de rotación para la derecha
            }

            // Aplicar la rotación
            for (let wheel of frontWheels) {
                wheel.style.transform = `rotate(${currentRotation}deg)`;
            }

            // Detener el intervalo cuando se alcance el valor máximo
            if (currentRotation <= -35 || currentRotation >= 35) {
                clearInterval(rotationInterval);
            }
        }, 10); // Ajusta este valor para la velocidad de la rotación (en milisegundos)
    }
}

function straightenWheels(direction) {
    let frontWheels = document.getElementsByClassName('front-wheels');
    
    // Verificar si existen las ruedas delanteras
    if (frontWheels.length > 0) {
        for (let wheel of frontWheels) {
            let currentRotation = getRotationAngle(wheel); // Obtener el ángulo actual
            let targetRotation = 0; // El objetivo es 0 grados
            let duration = 1000; // Duración de la animación en milisegundos
            let startTime = performance.now();

            function animateWheelRotation(timestamp) {
                let timeElapsed = timestamp - startTime;
                let progress = timeElapsed / duration;
                
                // Asegurarse de que el progreso no pase de 1
                if (progress > 1) progress = 1;

                // Calcular el nuevo ángulo basado en el progreso
                let newRotation = currentRotation + (targetRotation - currentRotation) * progress;

                // Aplicar la rotación al elemento
                wheel.style.transform = `rotate(${newRotation}deg)`;

                // Continuar la animación hasta que se haya completado
                if (progress < 1) {
                    requestAnimationFrame(animateWheelRotation);
                }
            }

            // Iniciar la animación
            requestAnimationFrame(animateWheelRotation);
        }
    }
}

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        straightenWheels(event.key);
        clearInterval(rotationInterval);
    }
});

function getRotationAngle(element) {
    const matrix = window.getComputedStyle(element).transform;
    
    if (matrix === 'none') return 0;
    
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);

    // Calcular el ángulo en grados
    return Math.round(Math.atan2(b, a) * (180 / Math.PI));
}