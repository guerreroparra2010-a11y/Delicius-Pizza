document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.particles');
    
    // Intentar reproducir el sonido automáticamente
    playIntroSound();

    // Si el navegador lo bloqueó, intentar reproducirlo al primer clic o tecla
    const playOnInteract = () => {
        playIntroSound();
        document.removeEventListener('click', playOnInteract);
        document.removeEventListener('keydown', playOnInteract);
    };
    document.addEventListener('click', playOnInteract);
    document.addEventListener('keydown', playOnInteract);

    // Animación de texto letra por letra desde distintas direcciones
    const textEl = document.querySelector('.overlay-text');
    if (textEl) {
        const text = textEl.textContent;
        textEl.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.className = 'fly-in-char';
            
            // Direcciones aleatorias para cada letra
            const directions = [
                'translate(-100vw, -100vh)', // Arriba izquierda
                'translate(100vw, -100vh)',  // Arriba derecha
                'translate(-100vw, 100vh)',  // Abajo izquierda
                'translate(100vw, 100vh)',   // Abajo derecha
                'translate(0, -100vh)',      // Arriba centro
                'translate(0, 100vh)'        // Abajo centro
            ];
            const randomDir = directions[Math.floor(Math.random() * directions.length)];
            
            span.style.setProperty('--start-transform', randomDir);
            span.style.animationDelay = `${0.5 + (index * 0.1)}s`;
            textEl.appendChild(span);
        });
    }

    // Create particles for cinematic effect
    for (let i = 0; i < 50; i++) {
        createParticle(container);
    }

    // Set timeout to transition to the main page after 5 seconds
    setTimeout(() => {
        document.body.classList.add('fade-out');
        setTimeout(() => {
            // Redirect to the actual index page
            window.location.href = 'html/index.html';
        }, 800);
    }, 5000);
});

function playIntroSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        
        // Acorde mágico/brillante (Do Mayor con delay)
        const frequencies = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        
        frequencies.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            // Fade in suave
            gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1 + (index * 0.15));
            // Fade out largo
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3 + (index * 0.2));
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(ctx.currentTime + (index * 0.15));
            osc.stop(ctx.currentTime + 4);
        });
    } catch (e) {
        console.log("Audio no soportado o bloqueado por el navegador");
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 5;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.bottom = `-20px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.background = Math.random() > 0.5 ? '#ffd700' : '#ffffff';
    
    container.appendChild(particle);
}
