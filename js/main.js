// Redirección al intro eliminada: el usuario puede recargar la página libremente.

document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.querySelector('.glass-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animación de letras voladoras para el título del inicio
    const heroH2 = document.querySelector('.hero h2');
    if (heroH2) {
        const nodes = Array.from(heroH2.childNodes);
        heroH2.innerHTML = '';
        let charIndex = 0;
        
        const setRandomDirection = (span, index) => {
            const directions = [
                'translate(-100vw, -100vh)',
                'translate(100vw, -100vh)',
                'translate(-100vw, 100vh)',
                'translate(100vw, 100vh)',
                'translate(0, -100vh)',
                'translate(0, 100vh)'
            ];
            const randomDir = directions[Math.floor(Math.random() * directions.length)];
            span.style.setProperty('--start-transform', randomDir);
            span.style.animationDelay = `${0.5 + (index * 0.03)}s`;
        };

        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const chars = node.textContent.split('');
                chars.forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    span.className = 'fly-in-char-main';
                    setRandomDirection(span, charIndex++);
                    heroH2.appendChild(span);
                });
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'span') {
                const chars = node.textContent.split('');
                chars.forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    span.className = 'fly-in-char-main highlight-text';
                    setRandomDirection(span, charIndex++);
                    heroH2.appendChild(span);
                });
            }
        });
    }

    // Intersection Observer for scroll animations (fade in menu cards)
    const menuCards = document.querySelectorAll('.menu-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    menuCards.forEach((card, index) => {
        // Initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        // Stagger the animation
        card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`;
        observer.observe(card);
    });

    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            // Cambiar el icono de hamburguesa a X
            const icon = mobileBtn.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- NUEVO SISTEMA DE CARRITO ROBUSTO ---
    
    // 1. Carga Segura y Validación Estricta
    const loadCart = () => {
        try {
            const stored = localStorage.getItem('delicius_cart');
            if (!stored) return [];
            
            let parsed = JSON.parse(stored);
            if (!Array.isArray(parsed)) return [];
            
            // Limpieza y validación rigurosa de cada ítem
            return parsed.filter(item => {
                const isValidName = item && typeof item.name === 'string' && item.name.trim() !== '';
                const isValidPrice = typeof item.price === 'number' && !isNaN(item.price) && item.price >= 0;
                const isValidQuantity = typeof item.quantity === 'number' && !isNaN(item.quantity) && item.quantity > 0;
                return isValidName && isValidPrice && isValidQuantity;
            }).map(item => ({
                name: item.name.trim(),
                price: Math.floor(item.price), // Asegurar entero
                quantity: Math.floor(item.quantity) // Asegurar entero
            }));
        } catch (e) {
            console.error("Error cargando carrito, reiniciando...", e);
            return [];
        }
    };

    let cart = loadCart();
    
    // Referencias al DOM
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const btnCheckout = document.getElementById('btn-checkout');
    
    let globalAudioContext = null;

    // 2. Sonido y Notificaciones
    const playCartSound = () => {
        try {
            if (!globalAudioContext) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                globalAudioContext = new AudioContext();
            }
            if (globalAudioContext.state === 'suspended') globalAudioContext.resume();
            
            const ctx = globalAudioContext;
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(987.77, ctx.currentTime);
            osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
            gainNode.gain.setValueAtTime(0.4, ctx.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.4);
        } catch (e) {
            console.error("Audio error", e);
        }
    };

    const showToast = (message, undoCallback = null) => {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        let undoHtml = undoCallback ? `<a href="#" class="undo-btn" style="color: #dc3545; text-decoration: underline; font-size: 0.85rem; margin-top: 4px;">(Deshacer)</a>` : '';

        toast.innerHTML = `
            <i class="fa-solid fa-cart-shopping"></i> 
            <span style="display: flex; flex-direction: column;">
                <span>${message}</span>
                <div style="display: flex; gap: 10px;">
                    <a href="#" onclick="document.getElementById('cart-sidebar').classList.add('active'); document.getElementById('cart-overlay').classList.add('active'); return false;" style="color: #000; text-decoration: underline; font-size: 0.85rem; margin-top: 4px;">(Ver carrito)</a>
                    ${undoHtml}
                </div>
            </span>
        `;
        
        toastContainer.appendChild(toast);
        playCartSound();
        
        if (undoCallback) {
            const undoBtn = toast.querySelector('.undo-btn');
            if (undoBtn) {
                undoBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    undoCallback();
                    toast.remove();
                });
            }
        }
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toastContainer.contains(toast)) toast.remove();
                }, 300);
            }
        }, 4000);
    };

    // 3. UI del Carrito
    const toggleCart = (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (!cartSidebar) return;
        
        try {
            if (!cartSidebar.classList.contains('active')) {
                cart = loadCart();
                updateCartUI();
            }
        } catch (err) {
            console.error("Error al actualizar UI del carrito:", err);
        }
        
        cartSidebar.classList.toggle('active');
        if (cartOverlay) cartOverlay.classList.toggle('active');
    };
    
    if (cartIcon) cartIcon.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
    
    // ----------------------------------------------------
    // ANIMACIÓN DE FRACTURA Y VUELO AL CARRITO (SHATTER EFFECT)
    // ----------------------------------------------------
    const SHARDS_CONFIG = [
        { clip: "polygon(0.0% 0.0%, 24.2% 0.0%, 23.8% 22.2%, 0.0% 23.2%)", cx: 12.0, cy: 11.3 },
        { clip: "polygon(24.2% 0.0%, 45.6% 0.0%, 50.6% 22.0%, 23.8% 22.2%)", cx: 36.1, cy: 11.1 },
        { clip: "polygon(45.6% 0.0%, 77.9% 0.0%, 71.6% 24.4%, 50.6% 22.0%)", cx: 61.4, cy: 11.6 },
        { clip: "polygon(77.9% 0.0%, 100.0% 0.0%, 100.0% 25.6%, 71.6% 24.4%)", cx: 87.4, cy: 12.5 },
        { clip: "polygon(0.0% 23.2%, 23.8% 22.2%, 25.5% 48.7%, 0.0% 47.1%)", cx: 12.3, cy: 35.3 },
        { clip: "polygon(23.8% 22.2%, 50.6% 22.0%, 54.1% 46.3%, 25.5% 48.7%)", cx: 38.5, cy: 34.8 },
        { clip: "polygon(50.6% 22.0%, 71.6% 24.4%, 79.3% 49.2%, 54.1% 46.3%)", cx: 63.9, cy: 35.5 },
        { clip: "polygon(71.6% 24.4%, 100.0% 25.6%, 100.0% 50.0%, 79.3% 49.2%)", cx: 87.7, cy: 37.3 },
        { clip: "polygon(0.0% 47.1%, 25.5% 48.7%, 27.0% 72.2%, 0.0% 71.8%)", cx: 13.1, cy: 60.0 },
        { clip: "polygon(25.5% 48.7%, 54.1% 46.3%, 48.6% 70.7%, 27.0% 72.2%)", cx: 38.8, cy: 59.5 },
        { clip: "polygon(54.1% 46.3%, 79.3% 49.2%, 73.6% 79.2%, 48.6% 70.7%)", cx: 63.9, cy: 61.3 },
        { clip: "polygon(79.3% 49.2%, 100.0% 50.0%, 100.0% 79.3%, 73.6% 79.2%)", cx: 88.2, cy: 64.4 },
        { clip: "polygon(0.0% 71.8%, 27.0% 72.2%, 27.2% 100.0%, 0.0% 100.0%)", cx: 13.6, cy: 86.0 },
        { clip: "polygon(27.0% 72.2%, 48.6% 70.7%, 45.5% 100.0%, 27.2% 100.0%)", cx: 37.1, cy: 85.7 },
        { clip: "polygon(48.6% 70.7%, 73.6% 79.2%, 79.0% 100.0%, 45.5% 100.0%)", cx: 61.7, cy: 87.5 },
        { clip: "polygon(73.6% 79.2%, 100.0% 79.3%, 100.0% 100.0%, 79.0% 100.0%)", cx: 88.2, cy: 89.6 },
    ];

    const playShatterSound = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            // 1. Crack / quiebre
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(950, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.14);

            // 2. Whoosh / vuelo
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(320, ctx.currentTime);
                osc2.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.35);
                gain2.gain.setValueAtTime(0.12, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.start();
                osc2.stop(ctx.currentTime + 0.38);
            }, 100);

            // 3. Campana pop al entrar al carrito
            setTimeout(() => {
                const osc3 = ctx.createOscillator();
                const gain3 = ctx.createGain();
                osc3.type = 'sine';
                osc3.frequency.setValueAtTime(880, ctx.currentTime);
                gain3.gain.setValueAtTime(0.2, ctx.currentTime);
                gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                osc3.connect(gain3);
                gain3.connect(ctx.destination);
                osc3.start();
                osc3.stop(ctx.currentTime + 0.4);
            }, 650);
        } catch (e) {
            // Audio no soportado o silenciado por el navegador
        }
    };

    const createCartSparkles = (x, y) => {
        const count = 14;
        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div');
            spark.className = 'cart-sparkle';
            const angle = (i / count) * Math.PI * 2;
            const dist = 25 + Math.random() * 35;
            const size = 5 + Math.random() * 5;
            const color = Math.random() > 0.4 ? '#FFB300' : '#FFF59D';

            spark.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10002;
                box-shadow: 0 0 10px ${color};
                transition: transform 0.5s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.5s ease;
            `;
            document.body.appendChild(spark);

            requestAnimationFrame(() => {
                const tx = Math.cos(angle) * dist;
                const ty = Math.sin(angle) * dist;
                spark.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                spark.style.opacity = '0';
            });

            setTimeout(() => {
                if (spark.parentNode) spark.parentNode.removeChild(spark);
            }, 550);
        }
    };

    const animateShatterToCart = (sourceEl) => {
        if (!sourceEl) return;
        const rect = sourceEl.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        playShatterSound();

        let bgImage = '';
        let bgSize = 'cover';
        let bgPos = 'center';
        let bgColor = 'transparent';

        if (sourceEl.tagName.toLowerCase() === 'img') {
            bgImage = `url("${sourceEl.src}")`;
        } else {
            const cs = window.getComputedStyle(sourceEl);
            bgImage = cs.backgroundImage;
            bgSize = cs.backgroundSize || 'cover';
            bgPos = cs.backgroundPosition || 'center';
            bgColor = cs.backgroundColor || 'transparent';
        }

        if (!bgImage || bgImage === 'none') return;

        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(container);

        let targetX = window.innerWidth - 60;
        let targetY = 30;
        if (cartIcon) {
            const cRect = cartIcon.getBoundingClientRect();
            targetX = cRect.left + cRect.width / 2;
            targetY = cRect.top + cRect.height / 2;
        }

        // Efecto flash/vibración en la imagen original
        sourceEl.style.transition = 'filter 0.15s ease, transform 0.15s ease';
        sourceEl.style.filter = 'brightness(1.8) contrast(1.2)';
        sourceEl.style.transform = 'scale(0.96)';
        setTimeout(() => {
            sourceEl.style.filter = '';
            sourceEl.style.transform = '';
        }, 220);

        const shards = [];

        SHARDS_CONFIG.forEach((cfg, idx) => {
            const shard = document.createElement('div');
            shard.className = 'shatter-shard';
            shard.style.cssText = `
                position: fixed;
                left: ${rect.left}px;
                top: ${rect.top}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                background-image: ${bgImage};
                background-size: ${bgSize};
                background-position: ${bgPos};
                background-repeat: no-repeat;
                background-color: ${bgColor};
                clip-path: ${cfg.clip};
                -webkit-clip-path: ${cfg.clip};
                filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.75)) drop-shadow(0 3px 6px rgba(0,0,0,0.35));
                transform-origin: ${cfg.cx}% ${cfg.cy}%;
                pointer-events: none;
                transition: transform 0.32s cubic-bezier(0.12, 0.9, 0.25, 1.25), opacity 0.3s ease;
            `;
            container.appendChild(shard);
            shards.push({ el: shard, cfg, idx });
        });

        // Fase 1: Ruptura explosiva hacia afuera
        requestAnimationFrame(() => {
            shards.forEach(({ el, cfg }) => {
                const shardAbsX = rect.left + (cfg.cx / 100) * rect.width;
                const shardAbsY = rect.top + (cfg.cy / 100) * rect.height;
                const originX = rect.left + rect.width / 2;
                const originY = rect.top + rect.height / 2;

                const angle = Math.atan2(shardAbsY - originY, shardAbsX - originX);
                const dist = 30 + Math.random() * 45;
                const burstX = Math.cos(angle) * dist;
                const burstY = Math.sin(angle) * dist;
                const burstRot = (Math.random() - 0.5) * 45;

                el.style.transform = `translate(${burstX}px, ${burstY}px) rotate(${burstRot}deg) scale(1.05)`;
            });
        });

        // Fase 2: Succión en vórtice magnético hacia el carrito
        setTimeout(() => {
            shards.forEach(({ el, cfg, idx }) => {
                const delay = (idx % 4) * 0.025 + (idx / shards.length) * 0.06;
                const shardAbsX = rect.left + (cfg.cx / 100) * rect.width;
                const shardAbsY = rect.top + (cfg.cy / 100) * rect.height;

                const toCartX = targetX - shardAbsX;
                const toCartY = targetY - shardAbsY;

                el.style.transition = `
                    transform 0.55s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s,
                    opacity 0.55s ease ${delay}s
                `;
                el.style.transform = `translate(${toCartX}px, ${toCartY}px) rotate(${720 + Math.random() * 180}deg) scale(0.08)`;
                el.style.opacity = '0.15';
            });
        }, 320);

        // Fase 3: Impacto en el carrito con destellos dorados
        setTimeout(() => {
            if (cartIcon) {
                cartIcon.classList.remove('cart-bounce-pop');
                void cartIcon.offsetWidth;
                cartIcon.classList.add('cart-bounce-pop');
                createCartSparkles(targetX, targetY);
            }

            setTimeout(() => {
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                }
            }, 250);
        }, 850);
    };

    // 4. Agregar ítems (Bebidas, Porciones, Encargos externos al juego)
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = btn.getAttribute('data-name');
            const rawPrice = btn.getAttribute('data-price');
            const price = parseInt(rawPrice);
            const img = btn.getAttribute('data-img'); // optional image path
            
            if (!name || isNaN(price)) {
                console.error("Error: Producto sin nombre o precio inválido", name, rawPrice);
                return;
            }
            
            // Disparar animación de imagen rota hacia el carrito
            const card = btn.closest('.menu-card');
            const imgSource = card ? (card.querySelector('.menu-card-img') || card.querySelector('img')) : null;
            if (imgSource) {
                animateShatterToCart(imgSource);
            }

            cart = loadCart();
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity += 1;
                // preserve existing image if not already set
                if (!existingItem.img && img) existingItem.img = img;
            } else {
                const newItem = { name, price, quantity: 1 };
                if (img) newItem.img = img;
                cart.push(newItem);
            }
            
            updateCartUI();
            
            showToast(`¡${name} agregado al carrito!`, () => {
                cart = loadCart();
                const index = cart.findIndex(item => item.name === name);
                if (index !== -1) {
                    if (cart[index].quantity > 1) {
                        cart[index].quantity -= 1;
                    } else {
                        cart.splice(index, 1);
                    }
                    updateCartUI();
                }
            });
            
            if (cartIcon) {
                cartIcon.style.transform = 'scale(1.2)';
                setTimeout(() => cartIcon.style.transform = 'scale(1)', 200);
            }
        });
    });
    
    // 5. Motor de Renderizado del Carrito
    const updateCartUI = () => {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #888;">
                    <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Tu carrito está vacío</p>
                </div>`;
        } else {
            cart.forEach((item, index) => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                count += item.quantity;
                
                // Extraer detalles si el nombre es complejo (ej. "Pizza Custom Familiar (Local) - Hawaiana")
                let displayName = item.name;
                let details = '';
                if (item.name.includes(' - ')) {
                    const parts = item.name.split(' - ');
                    displayName = parts[0];
                    details = parts.slice(1).join(' - ');
                }

                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="cart-item-info" style="flex: 1;">
                        <h4 style="margin: 0; font-size: 1rem; color: var(--text-light);">${displayName}</h4>
                        ${details ? `<p style="font-size: 0.8rem; color: var(--text-muted); margin: 3px 0; font-style: italic;">${details}</p>` : ''}
                        ${item.img ? `<img src="${item.img}" alt="${displayName}" style="max-width: 80px; border-radius: 8px; margin: 5px 0;"/>` : ''}

                        <p style="font-size: 0.9rem; margin: 5px 0 0 0; color: var(--text-muted);">
                            $${item.price.toLocaleString('es-CO')} x ${item.quantity} = 
                            <strong style="color: var(--primary-color);">$${subtotal.toLocaleString('es-CO')} COP</strong>
                        </p>
                    </div>
                    <div class="cart-item-actions" style="display: flex; align-items: center; gap: 8px;">
                        <button class="qty-btn minus" data-name="${item.name}" style="padding: 5px 10px;">-</button>
                        <span style="font-weight: bold; min-width: 20px; text-align: center; color: var(--text-light);">${item.quantity}</span>
                        <button class="qty-btn plus" data-name="${item.name}" style="padding: 5px 10px;">+</button>
                        <button class="remove-item" data-name="${item.name}" style="color: #ff5252; background: none; border: none; padding: 5px; margin-left: 5px; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }
        
        if (cartCount) cartCount.textContent = count;
        if (cartTotalPrice) cartTotalPrice.textContent = `$${total.toLocaleString('es-CO')} COP`;
        
        localStorage.setItem('delicius_cart', JSON.stringify(cart));
        attachCartEvents();
    };
    
    // 6. Asignación de eventos dinámicos
    const attachCartEvents = () => {
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cart = loadCart();
                const name = e.currentTarget.getAttribute('data-name');
                const item = cart.find(i => i.name === name);
                if (item) item.quantity += 1;
                updateCartUI();
            });
        });
        
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cart = loadCart();
                const name = e.currentTarget.getAttribute('data-name');
                const itemIndex = cart.findIndex(i => i.name === name);
                if (itemIndex > -1) {
                    if (cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity -= 1;
                    } else {
                        cart.splice(itemIndex, 1);
                    }
                }
                updateCartUI();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cart = loadCart();
                const name = e.currentTarget.getAttribute('data-name');
                cart = cart.filter(i => i.name !== name);
                updateCartUI();
            });
        });
    };
    
    // Inicialización y Sincronización
    updateCartUI();
    
    window.addEventListener('storage', (e) => {
        if (e.key === 'delicius_cart') {
            cart = loadCart();
            updateCartUI();
        }
    });
    
    // 7. Componentes Extras del Carrito (Botón Vaciar y Nota de Domicilio)
    const cartHeader = document.querySelector('.cart-header');
    if (cartHeader && !document.getElementById('btn-empty-cart')) {
        const emptyBtn = document.createElement('button');
        emptyBtn.id = 'btn-empty-cart';
        emptyBtn.className = 'btn-secondary';
        emptyBtn.style = 'font-size: 0.8rem; padding: 0.4rem 0.8rem; border-color: #ff5252; color: #ff5252; transition: all 0.3s; border-radius: 8px; margin-right: auto; margin-left: 15px;';
        emptyBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Vaciar';
        
        emptyBtn.addEventListener('mouseover', () => {
            emptyBtn.style.backgroundColor = '#ff5252';
            emptyBtn.style.color = '#fff';
        });
        emptyBtn.addEventListener('mouseout', () => {
            emptyBtn.style.backgroundColor = 'transparent';
            emptyBtn.style.color = '#ff5252';
        });

        const h2 = cartHeader.querySelector('h2');
        if (h2) cartHeader.insertBefore(emptyBtn, h2.nextSibling);
        else cartHeader.appendChild(emptyBtn);
        
        emptyBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            if (confirm('¿Estás seguro de que quieres vaciar todo el pedido?')) {
                cart = [];
                updateCartUI();
                const toastContainer = document.getElementById('toast-container');
                if(toastContainer) {
                    const toast = document.createElement('div');
                    toast.className = 'toast';
                    toast.style.backgroundColor = '#ff5252';
                    toast.style.color = '#fff';
                    toast.innerHTML = '<i class="fa-solid fa-trash-can"></i> <span>Carrito vaciado</span>';
                    toastContainer.appendChild(toast);
                    setTimeout(() => toast.classList.add('show'), 10);
                    setTimeout(() => {
                        toast.classList.remove('show');
                        setTimeout(() => toast.remove(), 300);
                    }, 3000);
                }
            }
        });
    }

    const cartFooter = document.querySelector('.cart-footer');
    if (cartFooter && !document.getElementById('delivery-note')) {
        const deliveryNote = document.createElement('p');
        deliveryNote.id = 'delivery-note';
        deliveryNote.style = 'font-size: 0.85rem; color: var(--primary-color); text-align: center; margin-bottom: 10px; font-style: italic; font-weight: 500; letter-spacing: 0.5px;';
        deliveryNote.innerHTML = '<i class="fa-solid fa-motorcycle"></i> * No incluye el precio del domicilio';
        if (btnCheckout) cartFooter.insertBefore(deliveryNote, btnCheckout);
        else cartFooter.appendChild(deliveryNote);
    }
    
    // 8. Envío de Pedido a WhatsApp (A prueba de bugs)
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            cart = loadCart(); // Refrescar antes de enviar
            if (cart.length === 0) {
                alert('Tu carrito está vacío. ¡Añade algunas pizzas o bebidas primero!');
                return;
            }
            
            let message = '🍕 *Hola Delicius Pizza, me gustaría hacer este pedido:*%0A%0A';
            let total = 0;
            
            cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                
                // Formatear si tiene detalles separados por guión
                if (item.name.includes(' - ')) {
                    const parts = item.name.split(' - ');
                    message += `▪️ *${item.quantity}x ${parts[0]}* ($${subtotal.toLocaleString('es-CO')})%0A`;
                    message += `   ↳ _Detalles: ${parts.slice(1).join(' - ')}_%0A`;
                } else {
                    message += `▪️ *${item.quantity}x ${item.name}* ($${subtotal.toLocaleString('es-CO')})%0A`;
                }
            });
            
            message += `%0A💰 *TOTAL DEL PEDIDO: $${total.toLocaleString('es-CO')} COP*%0A`;
            message += `_(Recuerda que el domicilio se cobra por separado)_`;
            
            const waUrl = `https://wa.me/573229062173?text=${message}`;
            window.open(waUrl, '_blank');
        });
    }



    // --- Música Alegre de Inicio (10 segundos) ---
    const playHappyMusic = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            // Notas para una melodía alegre tipo arpegio (Do Mayor)
            const notes = [
                261.63, 329.63, 392.00, 523.25,
                392.00, 329.63, 261.63, 392.00
            ]; 
            
            const noteDuration = 0.25; // 4 notas por segundo
            const startTime = ctx.currentTime;
            
            // 40 notas * 0.25 seg = 10 segundos exactos
            for (let i = 0; i < 40; i++) {
                const osc = ctx.createOscillator();
                const gainNode = ctx.createGain();
                
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                osc.type = 'triangle'; // Sonido suave y alegre
                osc.frequency.value = notes[i % notes.length];
                
                const noteStart = startTime + i * noteDuration;
                
                // Envolvente de volumen para que no suene golpeado
                gainNode.gain.setValueAtTime(0, noteStart);
                gainNode.gain.linearRampToValueAtTime(0.1, noteStart + 0.05); // Volumen bajito (0.1)
                gainNode.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration - 0.01);
                
                osc.start(noteStart);
                osc.stop(noteStart + noteDuration);
            }
        } catch (e) {
            console.error("Error al reproducir música:", e);
        }
    };

    // Políticas de navegadores bloquean el autoplay. 
    // Reproduciremos la música cuando el usuario vea o interactúe con el MENÚ.
    let musicPlayed = false;
    const tryPlayMusic = () => {
        if (!musicPlayed) {
            musicPlayed = true;
            playHappyMusic();
        }
    };

    const menuSection = document.getElementById('menu');
    if (menuSection) {
        // Opción 1: Si hace clic en el menú
        menuSection.addEventListener('click', tryPlayMusic);
        
        // Opción 2: Si el menú aparece en pantalla al bajar (scroll)
        const menuObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !musicPlayed) {
                    // Si el navegador lo permite (ya hubo interacción previa), sonará
                    musicPlayed = true;
                    playHappyMusic();
                }
            });
        }, { threshold: 0.3 }); // Cuando se vea el 30% del menú
        
        menuObserver.observe(menuSection);
    }

    // --- Lógica del formulario de reseñas ---
    // ============================================================
    // ELIGE UNO DE ESTOS SERVICIOS Y ACTÍVALO:
    //
    // OPCIÓN 1 - CallMeBot (GRATIS, ya lo intentaste)
    //   Requiere: Registrarte en api.callmebot.com y obtener tu API Key
    //   const SERVICIO = "callmebot";
    //   const CALLMEBOT_API_KEY = "TU_API_KEY";
    //
    // OPCIÓN 2 - UltraMsg (MÁS FÁCIL, 3 días gratis luego $)
    //   Requiere: Crear cuenta en ultramsg.com, obtener Instance ID y Token
    //   const SERVICIO = "ultramsg";
    //   const ULTRAMSG_INSTANCE = "TU_INSTANCE_ID";
    //   const ULTRAMSG_TOKEN    = "TU_TOKEN";
    //
    // OPCIÓN 3 - Green API (GRATIS hasta 200 mensajes al mes)
    //   Requiere: Crear cuenta en green-api.com, obtener Instance ID y Token
    //   const SERVICIO = "greenapi";
    //   const GREENAPI_INSTANCE = "TU_INSTANCE_ID";
    //   const GREENAPI_TOKEN    = "TU_TOKEN";
    //
    // OPCIÓN 4 - Abrir WhatsApp en segundo plano (SIN REGISTRO)
    //   No requiere nada. Abre WhatsApp invisible por 1 segundo y lo cierra.
    //   const SERVICIO = "wame";
    //
    // ============================================================

    const PHONE    = "573229062173"; // Número destino
    const SERVICIO = "wame";         // <-- CAMBIA ESTO por la opción que prefieras

    // Configuración CallMeBot
    const CALLMEBOT_API_KEY = "TU_API_KEY";

    // Configuración UltraMsg
    const ULTRAMSG_INSTANCE = "TU_INSTANCE_ID";
    const ULTRAMSG_TOKEN    = "TU_TOKEN";

    // Configuración Green API
    const GREENAPI_INSTANCE = "TU_INSTANCE_ID";
    const GREENAPI_TOKEN    = "TU_TOKEN";

    const showReviewToast = (message, isError = false) => {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="fa-solid ${isError ? 'fa-circle-xmark' : 'fa-check-circle'}" style="color: ${isError ? '#ff5252' : '#25d366'}; font-size: 1.5rem;"></i>
            <span style="font-size: 1.05rem;">${message}</span>
        `;
        toastContainer.appendChild(toast);
        playCartSound();
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const ratingSelected = document.querySelector('input[name="rating"]:checked');
            if (!ratingSelected) {
                alert('Por favor, califícanos con las estrellas antes de enviar.');
                return;
            }

            const reviewText = document.getElementById('review-text').value.trim();
            const ratingValue = ratingSelected.value;
            const stars = '⭐'.repeat(parseInt(ratingValue));
            const texto = `Nueva Reseña Delicius Pizza\nCalificación: ${stars} (${ratingValue}/5)\nComentario: ${reviewText}`;
            const textoCodificado = encodeURIComponent(texto);

            const submitBtn = reviewForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            const onSuccess = () => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                showReviewToast('✅ ¡Reseña enviada a nuestro WhatsApp!');
                reviewForm.reset();
                document.querySelectorAll('input[name="rating"]').forEach(s => s.checked = false);
            };

            const onError = () => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                showReviewToast('❌ No se pudo enviar. Intenta de nuevo.', true);
            };

            // ---- SERVICIO ACTIVO ----
            if (SERVICIO === "callmebot") {
                // CallMeBot: gratis, requiere API Key
                const url = `https://api.callmebot.com/whatsapp.php?phone=${PHONE}&text=${textoCodificado}&apikey=${CALLMEBOT_API_KEY}`;
                fetch(url, { mode: 'no-cors' }).then(onSuccess).catch(onError);

            } else if (SERVICIO === "ultramsg") {
                // UltraMsg: 3 días gratis
                const url = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE}/messages/chat`;
                fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `token=${ULTRAMSG_TOKEN}&to=${PHONE}&body=${textoCodificado}`
                }).then(onSuccess).catch(onError);

            } else if (SERVICIO === "greenapi") {
                // Green API: gratis hasta 200 mensajes/mes
                const url = `https://api.green-api.com/waInstance${GREENAPI_INSTANCE}/sendMessage/${GREENAPI_TOKEN}`;
                fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chatId: `${PHONE}@c.us`, message: texto })
                }).then(onSuccess).catch(onError);

            } else if (SERVICIO === "wame") {
                // Opción sin registro: abre WhatsApp en ventana pequeña invisible y lo cierra
                const waUrl = `https://wa.me/${PHONE}?text=${textoCodificado}`;
                const popup = window.open(waUrl, '_blank', 'width=1,height=1,left=-1000,top=-1000');
                setTimeout(() => {
                    if (popup) popup.close();
                    onSuccess();
                }, 2500);
            }
        });
    }
});
