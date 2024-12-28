// Variables para controlar el carro
let isRunning = false;
let kilometers = 0;
let speed = 0;
let acceleration = 0.1;
let deceleration = 0.1;
let isAccelerating = false;
let doorsLocked = true;
let isFLDoorOpen = false;
let isBLDoorOpen = false;
let isFRDoorOpen = false;
let isBRDoorOpen = false;
let sunroofOpen = false;
let trunkOpen = false;
let hoodOpen = false;
let lightsOn = false;
let turnSignals = false;
let doorStates = [];
let intervalIds = [];

// Lógica para los botones del carro
document.getElementById('start-stop').addEventListener('click', () => {
    isRunning = !isRunning;
    updateKilometerDisplay();
});

document.getElementById('lock-unlock').addEventListener('click', () => {
    doorsLocked = !doorsLocked;
    document.getElementById('lock-unlock').textContent = doorsLocked ? 'Bloquear' : 'Desbloquear';
    console.log(doorsLocked);
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

function toggleDoor(doorId, isDoorOpen, position, rotation) {
	let door = document.getElementById(doorId);

	if (isDoorOpen) {
		door.style[position] = '';
		door.style.transform = '';
	} else {
		door.style[position] = '255px';
		door.style.transform = `rotate(${rotation}deg)`;
	}

	return !isDoorOpen;
}

document.getElementById('open-front-left-door').addEventListener('click', () => {
	if (!doorsLocked) {
		isFLDoorOpen = toggleDoor('front-left-door', isFLDoorOpen, 'left', 50);
	}
});

document.getElementById('open-back-left-door').addEventListener('click', () => {
	if (!doorsLocked) {
		isBLDoorOpen = toggleDoor('back-left-door', isBLDoorOpen, 'left', 50);
	}
});

document.getElementById('open-front-right-door').addEventListener('click', () => {
	if (!doorsLocked) {
		isFRDoorOpen = toggleDoor('front-right-door', isFRDoorOpen, 'right', -50);
	}
});

document.getElementById('open-back-right-door').addEventListener('click', () => {
	if (!doorsLocked) {
		isBRDoorOpen = toggleDoor('back-right-door', isBRDoorOpen, 'right', -50);
	}
});

document.getElementById('turn-lights').addEventListener('click', () => {
    lightsOn = !lightsOn;

	let frontLights = document.getElementsByClassName('front-light');
	if (lightsOn) {
		for (let light of frontLights) {
			light.style.backgroundColor = 'rgb(226, 226, 226)';
		}
	} else {
		for (let light of frontLights) {
			light.style.backgroundColor = '';
		}
	}
});

document.getElementById('turn-signals').addEventListener('click', () => {
    turnSignals = !turnSignals;
    updateTurnSignals();
});

// Movimiento y control del auto con teclas
document.addEventListener('keydown', (event) => {
	let reverseLights = document.getElementsByClassName('reverse-light');
	if (event.key === 'ArrowUp') {
		if (!isAccelerating) {
			isAccelerating = true;
			speed = acceleration;

			for (let light of reverseLights) {
				light.style.backgroundColor = '';
			}
		}
	} else if (event.key === 'ArrowDown') {
		if (!isAccelerating) {
			isAccelerating = true;
			speed = -deceleration;

			for (let light of reverseLights) {
				light.style.backgroundColor = '#FFFFFF';
			}
		}
	} else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
		rotateWheels(event.key);
	}
	updateKilometerDisplay();
});

// Funciones auxiliares
function updateKilometerDisplay() {
    document.getElementById('kilometer-display').textContent = `${kilometers.toFixed(1)} Km/h`;
}

function updateTurnSignals() {
    // Actualizar dirección de las luces direccionales
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
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        isAccelerating = false; // Deja de acelerar cuando se suelta la tecla
    }
});

document.getElementById('brake').addEventListener('click', () => {
    console.log('aqui');
});
document.getElementById('turn-signals').addEventListener('click', () => {
    directionals = ['front-left-directional', 'front-right-directional', 'back-left-directional', 'back-right-directional'];
    colors = ['gray', 'yellow'];
    
    toggleBlinking(directionals, 500, colors);
});

function toggleBlinking(divIds, interval = 500, colors = ['gray', 'yellow']) {
    if (intervalIds.length > 0) {
        intervalIds.forEach(intervalId => clearInterval(intervalId));
        intervalIds = [];
        divIds.forEach(divId => {
            const directionalDiv = document.getElementById(divId);
            if (directionalDiv) {
                directionalDiv.style.backgroundColor = colors[0];
            }
        });
    } else {
        divIds.forEach(divId => {
            const directionalDiv = document.getElementById(divId);
            if (directionalDiv) {
                let isPrimaryColor = false;
                const intervalId = setInterval(() => {
                    directionalDiv.style.backgroundColor = isPrimaryColor ? colors[0] : colors[1];
                    isPrimaryColor = !isPrimaryColor;
                }, interval);
                intervalIds.push(intervalId);
            }
        });
    }
}

function getRotationAngle(element) {
    const matrix = window.getComputedStyle(element).transform;
    
    if (matrix === 'none') return 0;
    
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);

    // Calcular el ángulo en grados
    return Math.round(Math.atan2(b, a) * (180 / Math.PI));
}

function slowDown() {
    if (!isAccelerating && speed !== 0) {
        // Si no se está acelerando, disminuir la velocidad lentamente hasta 0
        speed *= 0.95; // Controla la rapidez con la que disminuye la velocidad
    }

    // Asegura que la velocidad no sea menor que 0.01
    if (Math.abs(speed) < 0.01) {
        speed = 0;
    }

    kilometers += speed; // Aumentar el kilometraje según la velocidad actual
    updateKilometerDisplay();
}

// Usar setInterval para actualizar el kilometraje cada 50ms
setInterval(slowDown, 50); // Ejecutar cada 50 ms para desacelerar y actualizar el kilometraje