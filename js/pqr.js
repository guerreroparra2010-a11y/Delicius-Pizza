/**
 * =========================================================
 * DELICIUS PIZZA - LÓGICA MÓDULO PQR
 * Archivo separado: js/pqr.js
 * =========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const pqrForm = document.getElementById('pqrForm');
    if (!pqrForm) return;

    // Función auxiliar para mostrar notificaciones estilo Toast
    function showNotification(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `pqr-toast ${type}`;
        toast.style.cssText = `
            background: ${type === 'success' ? '#2e7d32' : '#c62828'};
            color: #ffffff;
            padding: 16px 24px;
            margin-top: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            font-family: 'Outfit', sans-serif;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 99999;
            transition: all 0.3s ease;
            border-left: 4px solid #FFB300;
        `;

        const icon = type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Validación y manejo del envío del formulario
    pqrForm.addEventListener('submit', function(e) {
        const nombre = document.getElementById('nombre')?.value.trim();
        const celular = document.getElementById('celular')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const sede = document.getElementById('sede')?.value;
        const jornada = document.getElementById('jornada')?.value;
        const asunto = document.getElementById('asunto')?.value;
        const dirigido = document.getElementById('dirigido')?.value;
        const comentario = document.getElementById('comentario')?.value.trim();

        // Validaciones básicas
        if (!nombre || !celular || !email || !sede || !jornada || !asunto || !dirigido || !comentario) {
            e.preventDefault();
            showNotification('Por favor, completa todos los campos del formulario.', 'error');
            return;
        }

        // Validación de teléfono mínimo 7 dígitos
        const phoneRegex = /^[0-9+\s-]{7,15}$/;
        if (!phoneRegex.test(celular)) {
            e.preventDefault();
            showNotification('Por favor ingresa un número de celular válido.', 'error');
            return;
        }

        // Si la acción está configurada hacia el backend de PHP (/bases2026/...)
        // y se ejecuta localmente sin dicho servidor activo, informamos al usuario amigablemente
        console.log('Enviando PQR:', {
            nombre,
            celular,
            email,
            sede,
            jornada,
            asunto,
            dirigido,
            comentario
        });

        // Feedback al usuario
        showNotification('Procesando tu solicitud PQR...', 'success');
    });

    // Formateo en tiempo real del celular (solo números y espacios)
    const telInput = document.getElementById('celular');
    if (telInput) {
        telInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9+\s]/g, '');
        });
    }
});
