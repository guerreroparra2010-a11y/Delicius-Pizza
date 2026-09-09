document.addEventListener('DOMContentLoaded', () => {
    const landingScreen = document.getElementById('landing-screen');
    const gameScreen = document.getElementById('game-screen');
    const startBtn = document.getElementById('start-btn');
    const slicesOverlay = document.getElementById('slices-overlay');
    const optionBtns = document.querySelectorAll('.option-btn');

    const readyBtn = document.getElementById('ready-btn');
    const flavorScreen = document.getElementById('flavors-screen');
    const backToSlices = document.getElementById('back-to-slices');

    const mainPizzaWrapper = document.getElementById('main-pizza-wrapper');
    const pizzaPreviewContainer = document.getElementById('pizza-preview-container');
    const flavorsGrid = document.getElementById('flavors-grid');
    const remainingCountEl = document.getElementById('remaining-count');
    const totalPortionsEl = document.getElementById('total-portions');

    let selectedSlices = 8;
    let selectedSize = 'familiar'; // Guarda el tamaño elegido
    let orderType = 'negocio'; // Guarda si es para negocio o llevar
    let portionsMap = {};
    let wedgeAssignment = [];

    const pizzaFlavors = [
        { id: 'hawaiana', name: 'Hawaiana', desc: 'Piña de la casa, jamón, queso' },
        { id: 'pollo-champinon', name: 'Pollo Champiñón', desc: 'Pollo, champiñón, queso' },
        { id: 'carnes', name: 'Carnes', desc: 'Jamón, salchicha, queso' },
        { id: 'ranchera', name: 'Ranchera', desc: 'Cebolla, pollo, queso, salchicha ranchera, maíz' },
        { id: 'criolla', name: 'Criolla', desc: 'Carne desmechada, maíz, queso' },
        { id: 'napolitana', name: 'Napolitana', desc: 'Cebolla, pimentón, tomate, champiñón, queso, orégano' },
        { id: 'mexicana', name: 'Mexicana', desc: 'Pico de gallo, picante, criolla, queso, doritos' },
        { id: 'carbonara', name: 'Carbonara', desc: 'Crema de leche, pollo, tocineta, queso' },
        { id: 'pepperoni', name: 'Pepperoni', desc: 'Tomate, pepperoni, orégano, queso' },
        { id: 'tropical', name: 'Tropical', desc: 'Piña de la casa, cerezas, uvas pasas, queso' },
        { id: 'tentacion', name: 'Tentación', desc: 'Chocolate, fresas, banano, queso' }
    ];

    // Transición de inicio (Parte 1 -> Parte 2)
    startBtn.addEventListener('click', () => {
        landingScreen.classList.remove('active');
        gameScreen.classList.add('active');
    });

    // Manejo de botones de tipo de orden
    const typeBtns = document.querySelectorAll('.type-btn');
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            orderType = btn.getAttribute('data-ordertype');
        });
    });

    // Manejo de botones de opción
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            optionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            readyBtn.classList.add('show');

            selectedSlices = parseInt(btn.getAttribute('data-slices'));
            selectedSize = btn.getAttribute('data-size') || 'familiar';
            updateSlices(selectedSlices);
        });
    });

    // Volver a Porciones (Parte 4 -> Parte 2/3)
    backToSlices.addEventListener('click', () => {
        // Devolver la pizza al contenedor de juego inicial
        gameScreen.insertBefore(mainPizzaWrapper, readyBtn);
        
        flavorScreen.classList.remove('active');
        gameScreen.classList.add('active');
    });

    function renderFlavors() {
        flavorsGrid.innerHTML = '';
        totalPortionsEl.textContent = selectedSlices;
        updateRemaining();

        // Actualizar el anuncio de reglas según el tamaño
        const maxFlavors = (selectedSize === 'familiar') ? 3 : 2;
        const flavorRule = document.querySelector('.flavor-rule');
        if (flavorRule) {
            if (selectedSize === 'familiar') {
                flavorRule.textContent = 'MÁXIMO 3 SABORES';
                flavorRule.style.backgroundColor = 'rgba(139, 0, 0, 0.8)';
            } else {
                flavorRule.textContent = '⚠️ MÁXIMO 2 SABORES (Medium/Junior)';
                flavorRule.style.backgroundColor = 'rgba(180, 80, 0, 0.9)';
            }
        }

        pizzaFlavors.forEach(flavor => {
            const currentCount = portionsMap[flavor.id] || 0;
            const card = document.createElement('div');
            card.className = 'flavor-card';

            // Añadir nota especial para Tentación
            let specialNote = '';
            if (flavor.id === 'tentacion') {
                specialNote = `<span class="special-note">Porcion solo por encargo de 2 dias anticipado</span>`;
            }

            card.innerHTML = `
                <div class="flavor-info">
                    <div class="flavor-name">${flavor.name} ${specialNote}</div>
                    <div class="flavor-desc">${flavor.desc}</div>
                </div>
                <div class="flavor-controls">
                    <button class="counter-btn minus" data-id="${flavor.id}">-</button>
                    <span class="flavor-count" id="count-${flavor.id}">${currentCount}</span>
                    <button class="counter-btn plus" data-id="${flavor.id}">+</button>
                </div>
            `;

            const minusBtn = card.querySelector('.minus');
            const plusBtn = card.querySelector('.plus');
            const countDisplay = card.querySelector('.flavor-count');

            minusBtn.addEventListener('click', () => {
                if (portionsMap[flavor.id] > 0) {
                    portionsMap[flavor.id]--;
                    // Eliminar la última asignación de este sabor
                    const lastIndex = wedgeAssignment.lastIndexOf(flavor.id);
                    if (lastIndex !== -1) wedgeAssignment[lastIndex] = null;

                    updateFlavorUI(flavor.id);
                }
            });

            plusBtn.addEventListener('click', () => {
                const totalUsed = Object.values(portionsMap).reduce((a, b) => a + b, 0);
                const distinctFlavors = Object.keys(portionsMap).filter(id => (portionsMap[id] || 0) > 0);
                const isNewFlavor = !portionsMap[flavor.id] || portionsMap[flavor.id] === 0;
                const maxFlavors = (selectedSize === 'familiar') ? 3 : 2;

                if (totalUsed < selectedSlices) {
                    if (isNewFlavor && distinctFlavors.length >= maxFlavors) {
                        alert(`Solo puedes elegir hasta ${maxFlavors} sabores para la pizza ${selectedSize}.`);
                        return;
                    }
                    portionsMap[flavor.id] = (portionsMap[flavor.id] || 0) + 1;

                    // Asignar este sabor a la primera rebanada libre
                    const firstFree = wedgeAssignment.indexOf(null);
                    if (firstFree !== -1) wedgeAssignment[firstFree] = flavor.id;

                    updateFlavorUI(flavor.id);
                }
            });

            flavorsGrid.appendChild(card);
            updateFlavorUI(flavor.id); // Initial state for buttons
        });
    }

    function updateFlavorUI(flavorId) {
        const count = portionsMap[flavorId] || 0;
        const countDisplay = document.getElementById(`count-${flavorId}`);
        const card = countDisplay.closest('.flavor-card');
        const minusBtn = card.querySelector('.minus');
        const plusBtn = card.querySelector('.plus');

        countDisplay.textContent = count;
        minusBtn.disabled = count <= 0;

        const totalUsed = Object.values(portionsMap).reduce((a, b) => a + b, 0);
        plusBtn.disabled = totalUsed >= selectedSlices;

        updateRemaining();
        updateWedges();
    }

    function updateRemaining() {
        const totalUsed = Object.values(portionsMap).reduce((a, b) => a + b, 0);
        remainingCountEl.textContent = selectedSlices - totalUsed;

        const pizzaBase = document.getElementById('pizza-base');
        const finishBtn = document.getElementById('finish-btn');

        if (totalUsed === selectedSlices) {
            finishBtn.style.opacity = '1';
            finishBtn.style.pointerEvents = 'auto';
            pizzaBase.classList.add('golden-border');
        } else {
            finishBtn.style.opacity = '0.5';
            finishBtn.style.pointerEvents = 'none';
            pizzaBase.classList.remove('golden-border');
        }
    }

    function updateWedges() {
        const wedges = document.querySelectorAll('.pizza-wedge');
        wedges.forEach((wedge, index) => {
            const flavorId = wedgeAssignment[index];
            const toppingContainer = wedge.querySelector('.topping-container');
            toppingContainer.innerHTML = ''; // Limpiar ingredientes anteriores

            if (flavorId) {
                wedge.classList.add('filled');

                // Si es Hawaiana, añadir los cuadritos de jamón
                if (flavorId === 'hawaiana') {
                    addHamToppings(toppingContainer);
                }

                // Si es Ranchera, añadir chorizo y maíz
                if (flavorId === 'ranchera') {
                    addRancheraToppings(toppingContainer);
                }

                // Si es Criolla, añadir maíz (bien lleno)
                if (flavorId === 'criolla') {
                    addCriollaToppings(toppingContainer);
                }

                // Si es Napolitana, añadir puntos negros super pequeños
                if (flavorId === 'napolitana') {
                    addNapolitanaToppings(toppingContainer);
                }

                // Si es Carbonara, añadir tocineta
                if (flavorId === 'carbonara') {
                    addCarbonaraToppings(toppingContainer);
                }

                // Si es Mexicana, fondo naranja sólido vibrante
                if (flavorId === 'mexicana') {
                    addMexicanaToppings(toppingContainer);
                } else if (flavorId === 'pepperoni') {
                    addPepperoniToppings(toppingContainer);
                } else if (flavorId === 'tropical') {
                    addTropicalToppings(toppingContainer);
                } else if (flavorId === 'tentacion') {
                    wedge.style.background = 'radial-gradient(circle, #5d2e06 0%, #3d1f05 100%)'; // Chocolate brillante
                    addTentacionToppings(toppingContainer);
                } else if (flavorId) {
                    // Restaurar fondo de queso normal
                    wedge.style.background = 'radial-gradient(circle, #fff9e6 0%, #f7e38d 100%)';
                }
            } else {
                wedge.classList.remove('filled');
            }
        });
    }

    function addHamToppings(container) {
        const count = wedgeAssignment.length;
        const angleStep = 360 / count;
        const pizzaBase = document.getElementById('pizza-base');
        const pizzaRadius = pizzaBase.offsetWidth / 2;

        // Tamaño dinámico del jamón según la cantidad de porciones
        const hamSize = Math.max(8, 16 - (count - 8));

        // Patrón 1-2-2-2-3 usando ratios de radio (0 a 1) - Ajustado más hacia el borde
        const photoPositions = [
            { rRatio: 0.25, aRatio: 0.5 },
            { rRatio: 0.45, aRatio: 0.3 }, { rRatio: 0.45, aRatio: 0.7 },
            { rRatio: 0.65, aRatio: 0.35 }, { rRatio: 0.65, aRatio: 0.65 },
            { rRatio: 0.8, aRatio: 0.25 }, { rRatio: 0.8, aRatio: 0.75 },
            { rRatio: 0.92, aRatio: 0.2 }, { rRatio: 0.92, aRatio: 0.5 }, { rRatio: 0.92, aRatio: 0.8 }
        ];

        photoPositions.forEach(pos => {
            const ham = document.createElement('div');
            ham.className = 'ham-cube';
            ham.style.width = `${hamSize}px`;
            ham.style.height = `${hamSize}px`;
            ham.style.top = '50%';
            ham.style.left = '50%';

            const a = pos.aRatio * angleStep;
            const actualR = pos.rRatio * (pizzaRadius - 8); // -8 para acercarse al borde del queso sin tocar la masa

            ham.style.transform = `
                translate(-50%, -50%) 
                rotate(${a}deg) 
                translateY(-${actualR}px)
                rotate(0deg)
            `;

            container.appendChild(ham);
        });
    }

    function addRancheraToppings(container) {
        const count = wedgeAssignment.length;
        const angleStep = 360 / count;
        const pizzaBase = document.getElementById('pizza-base');
        const pizzaRadius = pizzaBase.offsetWidth / 2;

        // Distribución para el Chorizo (6 piezas)
        const chorizoPositions = [
            { rRatio: 0.3, aRatio: 0.5 },
            { rRatio: 0.55, aRatio: 0.3 }, { rRatio: 0.55, aRatio: 0.7 },
            { rRatio: 0.85, aRatio: 0.2 }, { rRatio: 0.85, aRatio: 0.5 }, { rRatio: 0.85, aRatio: 0.8 }
        ];

        // Distribución muy densa para el Maíz (30 granos base antes de recortes)
        const cornPositions = [
            { rRatio: 0.15, aRatio: 0.3 }, { rRatio: 0.15, aRatio: 0.7 },
            { rRatio: 0.25, aRatio: 0.1 }, { rRatio: 0.25, aRatio: 0.5 }, { rRatio: 0.25, aRatio: 0.9 },
            { rRatio: 0.35, aRatio: 0.3 }, { rRatio: 0.35, aRatio: 0.7 },
            { rRatio: 0.45, aRatio: 0.1 }, { rRatio: 0.45, aRatio: 0.3 }, { rRatio: 0.45, aRatio: 0.5 }, { rRatio: 0.45, aRatio: 0.7 }, { rRatio: 0.45, aRatio: 0.9 },
            { rRatio: 0.55, aRatio: 0.2 }, { rRatio: 0.55, aRatio: 0.4 }, { rRatio: 0.55, aRatio: 0.6 }, { rRatio: 0.55, aRatio: 0.8 },
            { rRatio: 0.65, aRatio: 0.1 }, { rRatio: 0.65, aRatio: 0.3 }, { rRatio: 0.65, aRatio: 0.5 }, { rRatio: 0.65, aRatio: 0.7 }, { rRatio: 0.65, aRatio: 0.9 },
            { rRatio: 0.75, aRatio: 0.2 }, { rRatio: 0.75, aRatio: 0.4 }, { rRatio: 0.75, aRatio: 0.6 }, { rRatio: 0.75, aRatio: 0.8 },
            { rRatio: 0.85, aRatio: 0.1 }, { rRatio: 0.85, aRatio: 0.3 }, { rRatio: 0.85, aRatio: 0.5 }, { rRatio: 0.85, aRatio: 0.7 }, { rRatio: 0.85, aRatio: 0.9 },
            { rRatio: 0.95, aRatio: 0.2 }, { rRatio: 0.95, aRatio: 0.4 }, { rRatio: 0.95, aRatio: 0.6 }, { rRatio: 0.95, aRatio: 0.8 }
        ];

        // Ajustar cantidad de ingredientes según el número de porciones para no saturar
        let chorizoToDisplay = chorizoPositions;
        let cornToDisplay = cornPositions;

        if (count === 12) {
            chorizoToDisplay = chorizoPositions.filter((_, i) => [0, 2, 4, 5].includes(i)); // 4 piezas
            cornToDisplay = cornPositions.filter((_, i) => i % 2 === 0); // 12 piezas
        } else if (count >= 16) {
            // Mantener las salchichas pero reducir ligeramente el maíz
            chorizoToDisplay = chorizoPositions;
            cornToDisplay = cornPositions.filter((_, i) => i % 3 === 0); // 8 piezas
        }

        // Añadir Chorizo
        chorizoToDisplay.forEach(pos => {
            const chorizo = document.createElement('div');
            chorizo.className = 'chorizo-slice';
            chorizo.style.top = '50%';
            chorizo.style.left = '50%';
            const a = pos.aRatio * angleStep;
            const actualR = pos.rRatio * (pizzaRadius - 10);
            chorizo.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${actualR}px)`;
            container.appendChild(chorizo);
        });

        // Añadir Maíz
        cornToDisplay.forEach(pos => {
            const corn = document.createElement('div');
            corn.className = 'corn-kernel';
            corn.style.top = '50%';
            corn.style.left = '50%';
            // Añadir aleatoriedad para evitar simetría
            const jitterA = (Math.random() - 0.5) * 0.3;
            const jitterR = (Math.random() - 0.5) * 0.1;
            const a = (pos.aRatio + jitterA) * angleStep;
            const actualR = (pos.rRatio + jitterR) * (pizzaRadius - 10);
            const randomRot = Math.random() * 360;
            corn.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${actualR}px) rotate(${randomRot}deg)`;
            container.appendChild(corn);
        });
    }

    function addCriollaToppings(container) {
        const count = wedgeAssignment.length;
        const angleStep = 360 / count;
        const pizzaBase = document.getElementById('pizza-base');
        const pizzaRadius = pizzaBase.offsetWidth / 2;

        // Distribución EXTREMADAMENTE densa de Maíz para la Criolla (50+ granos)
        const cornPositions = [];
        for (let r = 0.1; r <= 0.95; r += 0.1) {
            const kernelsInRing = Math.floor(r * 15);
            for (let i = 0; i < kernelsInRing; i++) {
                cornPositions.push({ rRatio: r, aRatio: (i + Math.random()) / kernelsInRing });
            }
        }

        // Añadir Maíz
        cornPositions.forEach(pos => {
            const corn = document.createElement('div');
            corn.className = 'corn-kernel';
            corn.style.top = '50%';
            corn.style.left = '50%';
            // Añadir aleatoriedad para evitar simetría
            const jitterA = (Math.random() - 0.5) * 0.4;
            const jitterR = (Math.random() - 0.5) * 0.15;
            const a = (pos.aRatio + jitterA) * angleStep;
            const actualR = (pos.rRatio + jitterR) * (pizzaRadius - 10);
            const randomRot = Math.random() * 360;
            corn.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${actualR}px) rotate(${randomRot}deg)`;
            container.appendChild(corn);
        });
    }

    function addNapolitanaToppings(container) {
        const count = wedgeAssignment.length;
        const angleStep = 360 / count;
        const pizzaBase = document.getElementById('pizza-base');
        const pizzaRadius = pizzaBase.offsetWidth / 2;

        // Crear MUCHOS puntos negros super pequeños
        const dotCount = 300; // Aumentado para mayor densidad
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'napolitana-dot';
            dot.style.top = '50%';
            dot.style.left = '50%';

            // Posición aleatoria dentro de la cuña
            const rRatio = 0.05 + Math.random() * 0.9; // De casi el centro al borde
            const aRatio = Math.random(); // Cualquier ángulo dentro del step

            const a = aRatio * angleStep;
            const actualR = rRatio * (pizzaRadius - 10);

            // Tamaño aleatorio para naturalidad (1 a 2.5px)
            const size = 1 + Math.random() * 1.5;
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.opacity = 0.4 + Math.random() * 0.6; // Diferentes opacidades

            dot.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${actualR}px)`;
            container.appendChild(dot);
        }
    }

    function addMexicanaToppings(container) {
        const count = wedgeAssignment.length;
        const angleStep = 360 / count;
        const pizzaBase = document.getElementById('pizza-base');
        const pizzaRadius = pizzaBase.offsetWidth / 2;

        // 200 Triángulos naranjas (Doritos)
        const chipCount = 200;
        for (let i = 0; i < chipCount; i++) {
            const chip = document.createElement('div');
            chip.className = 'dorito-chip';
            chip.style.top = '50%';
            chip.style.left = '50%';
            
            const rRatio = 0.1 + Math.random() * 0.8;
            const aRatio = Math.random();
            const a = aRatio * angleStep;
            const actualR = rRatio * (pizzaRadius - 12);
            
            chip.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${actualR}px) rotate(${Math.random() * 360}deg)`;
            container.appendChild(chip);
        }

        // 50 triángulos extra cerca del borde
        for (let i = 0; i < 50; i++) {
            const chip = document.createElement('div');
            chip.className = 'dorito-chip';
            chip.style.top = '50%';
            chip.style.left = '50%';
            const rRatio = 0.75 + Math.random() * 0.2; // Solo zona cercana al borde
            const aRatio = Math.random();
            const a = aRatio * angleStep;
            const actualR = rRatio * (pizzaRadius - 12);
            chip.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${actualR}px) rotate(${Math.random() * 360}deg)`;
            container.appendChild(chip);
        }
    }

    function addCarbonaraToppings(container) {
        const count = wedgeAssignment.length;
        const angleStep = 360 / count;
        const pizzaBase = document.getElementById('pizza-base');
        const pizzaRadius = pizzaBase.offsetWidth / 2;

        // Distribución por "anillos" para asegurar que estén bien repartidos
        // Definimos cuántos palitos queremos en cada nivel de distancia del centro
        const distribution = [
            { rRange: [0.15, 0.35], count: 5 },
            { rRange: [0.4, 0.65], count: 12 },
            { rRange: [0.7, 0.92], count: 18 }
        ];

        distribution.forEach(zone => {
            for (let i = 0; i < zone.count; i++) {
                const strip = document.createElement('div');
                strip.className = 'bacon-strip';
                strip.style.top = '50%';
                strip.style.left = '50%';

                // Rango de radio específico de la zona + pequeño jitter
                const rRatio = zone.rRange[0] + Math.random() * (zone.rRange[1] - zone.rRange[0]);
                // Distribución uniforme en el ángulo de la cuña
                const aRatio = (i + Math.random()) / zone.count;

                const a = aRatio * angleStep;
                const actualR = rRatio * (pizzaRadius - 12);
                const randomRot = Math.random() * 360;

                strip.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${actualR}px) rotate(${randomRot}deg)`;
                container.appendChild(strip);
            }
        });
    }

    function addPepperoniToppings(container) {
        const count = wedgeAssignment.length;
        const angleStep = 360 / count;
        const pizzaBase = document.getElementById('pizza-base');
        const pizzaRadius = pizzaBase.offsetWidth / 2;

        // 1. Añadir puntos negros (orégano)
        const dotCount = 150;
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'napolitana-dot';
            dot.style.top = '50%';
            dot.style.left = '50%';

            const rRatio = 0.05 + Math.random() * 0.9;
            const aRatio = Math.random();
            const a = aRatio * angleStep;
            const actualR = rRatio * (pizzaRadius - 10);

            // Tamaño y opacidad para que sean visibles
            const size = 1 + Math.random() * 1.5;
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.opacity = 0.4 + Math.random() * 0.6;

            dot.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${actualR}px)`;
            container.appendChild(dot);
        }

        // 2. Añadir 5 rodajas de Pepperoni (color rojizo)
        const pepPositions = [
            { rRatio: 0.2, aRatio: 0.5 },
            { rRatio: 0.5, aRatio: 0.25 }, { rRatio: 0.5, aRatio: 0.75 },
            { rRatio: 0.8, aRatio: 0.3 }, { rRatio: 0.8, aRatio: 0.7 }
        ];

        pepPositions.forEach(pos => {
            const pep = document.createElement('div');
            pep.className = 'pepperoni-slice';
            pep.style.top = '50%';
            pep.style.left = '50%';
            const a = pos.aRatio * angleStep;
            const actualR = pos.rRatio * (pizzaRadius - 15);
            pep.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${actualR}px) rotate(${Math.random() * 360}deg)`;
            container.appendChild(pep);
        });
    }

    function addTropicalToppings(container) {
        const count = wedgeAssignment.length;
        const angleStep = 360 / count;
        const pizzaBase = document.getElementById('pizza-base');
        const pizzaRadius = pizzaBase.offsetWidth / 2;

        // Distribución por anillos para cerezas y pasas (20 de cada una)
        // Esto asegura que estén "bien organizadas" y separadas
        const zones = [
            { rRange: [0.15, 0.35], count: 4 },
            { rRange: [0.4, 0.65], count: 7 },
            { rRange: [0.7, 0.92], count: 9 }
        ];

        zones.forEach(zone => {
            for (let i = 0; i < zone.count; i++) {
                // 1. Añadir Pasa (Punto negro)
                const dot = document.createElement('div');
                dot.className = 'napolitana-dot';
                dot.style.top = '50%';
                dot.style.left = '50%';

                // Distribución angular con desfase para no solapar con la cereza
                const aDot = ((i + 0.2) / zone.count) * angleStep;
                const rDot = zone.rRange[0] + Math.random() * (zone.rRange[1] - zone.rRange[0]);

                dot.style.width = '6px'; // Más grandes como pidió el usuario
                dot.style.height = '6px';
                dot.style.opacity = '1';
                dot.style.transform = `translate(-50%, -50%) rotate(${aDot}deg) translateY(-${rDot * (pizzaRadius - 10)}px)`;
                container.appendChild(dot);

                // 2. Añadir Cereza (Punto rojo)
                const cherry = document.createElement('div');
                cherry.className = 'cherry-topping';
                cherry.style.top = '50%';
                cherry.style.left = '50%';

                // Distribución angular con desfase
                const aCherry = ((i + 0.7) / zone.count) * angleStep;
                const rCherry = zone.rRange[0] + Math.random() * (zone.rRange[1] - zone.rRange[0]);

                cherry.style.width = '10px';
                cherry.style.height = '10px';
                cherry.style.transform = `translate(-50%, -50%) rotate(${aCherry}deg) translateY(-${rCherry * (pizzaRadius - 10)}px)`;
                container.appendChild(cherry);
            }
        });
    }

    function addTentacionToppings(container) {
        const count = wedgeAssignment.length;
        const angleStep = 360 / count;
        const pizzaBase = document.getElementById('pizza-base');
        const pizzaRadius = pizzaBase.offsetWidth / 2;

        // 1. Añadir Banano (7 rodajas)
        const bananaCount = 7;
        for (let i = 0; i < bananaCount; i++) {
            const banana = document.createElement('div');
            banana.className = 'banana-slice';
            banana.style.top = '50%';
            banana.style.left = '50%';
            // Distribución amplia
            const rRatio = 0.15 + Math.random() * 0.75;
            const aRatio = Math.random();
            const a = aRatio * angleStep;
            const actualR = rRatio * (pizzaRadius - 15);
            banana.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${actualR}px) rotate(${Math.random() * 360}deg)`;
            container.appendChild(banana);
        }

        // 2. Añadir Fresas (7 unidades)
        const strawberryCount = 7;
        for (let i = 0; i < strawberryCount; i++) {
            const strawberry = document.createElement('div');
            strawberry.className = 'strawberry';
            strawberry.style.top = '50%';
            strawberry.style.left = '50%';
            // Distribución amplia
            const rRatio = 0.15 + Math.random() * 0.75;
            const aRatio = Math.random();
            const a = aRatio * angleStep;
            const actualR = rRatio * (pizzaRadius - 15);
            strawberry.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${actualR}px) rotate(${Math.random() * 360}deg)`;
            container.appendChild(strawberry);
        }

        // 3. Crear efecto de hilos de chocolate (drizzle) - 50 hilos por encima
        const drizzleCount = 50;
        for (let i = 0; i < drizzleCount; i++) {
            const line = document.createElement('div');
            line.className = 'chocolate-drizzle';
            line.style.top = '50%';
            line.style.left = '50%';

            const rRatio = 0.1 + Math.random() * 0.85;
            const aRatio = Math.random();
            const a = aRatio * angleStep;
            const actualR = rRatio * (pizzaRadius - 12);
            const randomRot = Math.random() * 360;

            line.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${actualR}px) rotate(${randomRot}deg)`;
            container.appendChild(line);
        }
    }

    function updateSlices(count) {
        const pizzaBase = document.getElementById('pizza-base');
        const mainPizzaWrapper = document.getElementById('main-pizza-wrapper');
        const activeBtn = document.querySelector('.option-btn.active');
        const sizeType = activeBtn ? activeBtn.getAttribute('data-size') : 'medium';

        // Escalar la pizza según el tamaño seleccionado
        const sizeMap = { 'familiar': 450, 'medium': 270, 'junior': 200 };
        const newSize = sizeMap[sizeType] || 350;

        mainPizzaWrapper.style.width = `${newSize}px`;
        mainPizzaWrapper.style.height = `${newSize}px`;

        // Ajustar el borde según el tamaño (Junior sin borde)
        if (sizeType === 'junior') {
            pizzaBase.style.borderWidth = '0';
        } else if (sizeType === 'medium') {
            pizzaBase.style.borderWidth = '10px';
        } else {
            pizzaBase.style.borderWidth = '16px';
        }

        pizzaBase.style.transform = `rotate(${Math.random() * 360}deg)`;
        slicesOverlay.innerHTML = '';

        // Reiniciar asignaciones al cambiar número de porciones
        wedgeAssignment = new Array(count).fill(null);
        portionsMap = {};

        const angleStep = 360 / count;

        // Crear cuñas (wedges)
        for (let i = 0; i < count; i++) {
            const wedge = document.createElement('div');
            wedge.className = 'pizza-wedge';
            const mask = `conic-gradient(black ${angleStep}deg, transparent 0)`;
            wedge.style.setProperty('--mask', mask);
            wedge.style.background = 'radial-gradient(circle, #fff9e6 0%, #f7e38d 100%)';
            wedge.style.transform = `rotate(${i * angleStep}deg)`;

            // Contenedor para ingredientes
            const toppingContainer = document.createElement('div');
            toppingContainer.className = 'topping-container';
            wedge.appendChild(toppingContainer);

            slicesOverlay.appendChild(wedge);
        }
    }

    const cuttingScreen = document.getElementById('cutting-screen');
    const cuttingPizzaContainer = document.getElementById('cutting-pizza-container');
    const sliceOptionsContainer = document.getElementById('slice-options-container');

    // Navegar a Pantalla de Corte
    readyBtn.addEventListener('click', () => {
        const activeBtn = document.querySelector('.option-btn.active');
        if (!activeBtn) return;

        const sizeType = activeBtn.getAttribute('data-size');

        gameScreen.classList.remove('active');
        cuttingScreen.classList.add('active');

        // Ocultar el botón de sabores hasta que se elija el corte
        cuttingReadyBtn.style.display = 'none';
        cuttingReadyBtn.classList.remove('show');

        // Mover pizza al contenedor de corte
        cuttingPizzaContainer.appendChild(mainPizzaWrapper);

        // Generar opciones de corte según el tamaño
        renderSliceOptions(sizeType);
    });

    function renderSliceOptions(size) {
        sliceOptionsContainer.innerHTML = '';
        let slices = [];

        if (size === 'familiar') slices = [8, 10, 12, 16];
        else if (size === 'medium') slices = [6, 8];
        else if (size === 'junior') slices = [4];

        slices.forEach(s => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = `x${s}`;
            btn.style.position = 'static'; // Evitar posiciones absolutas aquí
            btn.style.margin = '0 10px';
            btn.addEventListener('click', () => performCut(s));
            sliceOptionsContainer.appendChild(btn);
        });
    }

    const cuttingReadyBtn = document.getElementById('cutting-ready-btn');

    function performCut(count) {
        selectedSlices = count;
        updateSlices(count); // Esto genera las cuñas internamente

        const linesNeeded = count / 2;
        const lineAngleStep = 180 / linesNeeded;

        // Limpiar líneas previas
        const oldLines = slicesOverlay.querySelectorAll('.slice-line');
        oldLines.forEach(l => l.remove());

        for (let i = 0; i < linesNeeded; i++) {
            const line = document.createElement('div');
            line.className = 'slice-line';
            line.style.zIndex = '10';
            line.style.transform = `rotate(${i * lineAngleStep + 90}deg)`;
            line.style.width = '0';
            slicesOverlay.appendChild(line);
            setTimeout(() => {
                line.style.width = '100%';
            }, 50 * i);
        }

        // Mostrar el botón de LISTO después de que terminen las animaciones
        setTimeout(() => {
            cuttingReadyBtn.style.display = 'block';
            cuttingReadyBtn.classList.add('show');
        }, linesNeeded * 50 + 500);
    }

    // Navegar a Sabores desde el nuevo botón
    cuttingReadyBtn.addEventListener('click', () => {
        cuttingScreen.classList.remove('active');
        flavorScreen.classList.add('active');
        pizzaPreviewContainer.appendChild(mainPizzaWrapper);
        renderFlavors();
    });

    // Finalizar Pedido y agregar al Carrito Global
    const finishBtn = document.getElementById('finish-btn');
    finishBtn.addEventListener('click', () => {
        const totalUsed = Object.values(portionsMap).reduce((a, b) => a + b, 0);
        if (totalUsed < selectedSlices) {
            alert("Aún faltan porciones por asignar.");
            return;
        }

        // Determinar precio según el tamaño y tipo
        let price = 0;
        if (orderType === 'negocio') {
            const priceMapNegocio = {
                'familiar': 65000,
                'medium': 35000,
                'junior': 17000
            };
            price = priceMapNegocio[selectedSize] || 35000;
        } else {
            const priceMapLlevar = {
                'familiar': 67000,
                'medium': 37000,
                'junior': 18000
            };
            price = priceMapLlevar[selectedSize] || 37000;
        }

        // Construir el nombre descriptivo
        const distinctFlavors = Object.keys(portionsMap).filter(id => portionsMap[id] > 0);
        const flavorNames = distinctFlavors.map(id => {
            const f = pizzaFlavors.find(pf => pf.id === id);
            return f ? f.name : id;
        });
        
        let sizeName = selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1);
        let orderTypeName = orderType === 'negocio' ? 'Local' : 'Llevar';
        const customName = `Pizza Custom ${sizeName} (${orderTypeName}) - ${flavorNames.join(', ')}`;

        // Cargar carrito existente de localStorage
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('delicius_cart')) || [];
        } catch (e) {
            cart = [];
        }

        // Añadir la nueva pizza
        const existingItem = cart.find(item => item.name === customName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: customName, price: price, quantity: 1 });
        }

        // Guardar en localStorage
        localStorage.setItem('delicius_cart', JSON.stringify(cart));

        // Forzar actualización del carrito en la misma página (main.js escucha esto)
        window.dispatchEvent(new StorageEvent('storage', { key: 'delicius_cart' }));

        // Mostrar notificación y abrir carrito simulando click en el icono, o redirigir
        alert(`¡Tu pizza ha sido añadida al carrito!`);
        
        // Opcional: Redirigir a la página principal o menú
        window.location.href = '../html/pizzas.html';
    });
});
