/**
 * Delicius Pizza - Lógica del Panel de Administración (admin.js)
 * Maneja autenticación segura en frontend, Dashboard interactivo y operaciones CRUD.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- CREDENCIALES CONFIGURADAS ---
    const ADMIN_CREDENTIALS = {
        email: 'guerreroparra2010@gmail.com',
        password: 'chuchogay'
    };

    const AUTH_SESSION_KEY = 'delicius_admin_auth';
    const AUTH_EMAIL_KEY = 'delicius_admin_email';

    // --- ELEMENTOS DEL DOM ---
    const loginView = document.getElementById('admin-login-view');
    const dashboardView = document.getElementById('admin-dashboard-view');
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('admin-email');
    const passwordInput = document.getElementById('admin-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const loginError = document.getElementById('login-error');
    const btnLogout = document.getElementById('btn-admin-logout');
    const adminUserEmailEl = document.getElementById('admin-user-email');

    // Métricas
    const kpiTotal = document.getElementById('kpi-total-count');
    const kpiPizzas = document.getElementById('kpi-pizzas-count');
    const kpiBebidas = document.getElementById('kpi-bebidas-count');
    const kpiEncargos = document.getElementById('kpi-encargos-count');

    // Precios de Porciones
    const btnSavePorcionPrice = document.getElementById('btn-save-porcion-price');

    // Controles y Grid
    const productsGrid = document.getElementById('admin-products-grid');
    const searchInput = document.getElementById('admin-search-input');
    const categoryTabs = document.querySelectorAll('.tab-btn');
    const btnNewProduct = document.getElementById('btn-new-product');
    const btnResetCatalog = document.getElementById('btn-reset-catalog');
    const btnExportJson = document.getElementById('btn-export-json');
    const fileImportInput = document.getElementById('file-import-json');

    // Modal Producto
    const productModal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-product-title');
    const productForm = document.getElementById('product-form');
    const productIdInput = document.getElementById('prod-id');
    const prodNameInput = document.getElementById('prod-name');
    const prodCategorySelect = document.getElementById('prod-category');
    const prodSubcategoryInput = document.getElementById('prod-subcategory');
    const prodPriceInput = document.getElementById('prod-price');
    const prodBadgeInput = document.getElementById('prod-badge');
    const prodDescInput = document.getElementById('prod-desc');
    const prodImageInput = document.getElementById('prod-image');
    const prodFileInput = document.getElementById('prod-file');
    const previewContainer = document.getElementById('image-preview');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');

    // Modal Confirmación Eliminar
    const deleteModal = document.getElementById('delete-modal');
    const deleteItemNameEl = document.getElementById('delete-item-name');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');
    const btnCancelDelete = document.getElementById('btn-cancel-delete');
    let itemToDeleteId = null;

    // Modal Confirmación Reset
    const resetModal = document.getElementById('reset-modal');
    const btnConfirmReset = document.getElementById('btn-confirm-reset');
    const btnCancelReset = document.getElementById('btn-cancel-reset');

    // Contenedor Toasts
    const toastContainer = document.getElementById('admin-toast-container');

    // Estado local
    let currentCategory = 'all';
    let searchQuery = '';

    // --- FUNCIONES DE NOTIFICACIÓN TOAST ---
    const showToast = (message, type = 'success') => {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `admin-toast toast-${type}`;
        
        let icon = 'fa-circle-check';
        if (type === 'error') icon = 'fa-triangle-exclamation';
        if (type === 'warning') icon = 'fa-circle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 20);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toastContainer.contains(toast)) toast.remove();
            }, 300);
        }, 3800);
    };

    // --- AUTENTICACIÓN ---
    const isAuthenticated = () => {
        return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true' || 
               localStorage.getItem(AUTH_SESSION_KEY) === 'true';
    };

    const updateAuthUI = () => {
        if (isAuthenticated()) {
            if (loginView) loginView.style.display = 'none';
            if (dashboardView) dashboardView.style.display = 'block';
            const email = sessionStorage.getItem(AUTH_EMAIL_KEY) || localStorage.getItem(AUTH_EMAIL_KEY) || ADMIN_CREDENTIALS.email;
            if (adminUserEmailEl) adminUserEmailEl.textContent = email;
            renderDashboard();
        } else {
            if (loginView) loginView.style.display = 'flex';
            if (dashboardView) dashboardView.style.display = 'none';
        }
    };

    // Toggle ver contraseña
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            const icon = togglePasswordBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye', !isPassword);
                icon.classList.toggle('fa-eye-slash', isPassword);
            }
        });
    }

    // Submit del login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailVal = emailInput.value.trim().toLowerCase();
            const passwordVal = passwordInput.value.trim();
            const rememberMe = document.getElementById('remember-me')?.checked;

            if (emailVal === ADMIN_CREDENTIALS.email.toLowerCase() && passwordVal === ADMIN_CREDENTIALS.password) {
                // Login exitoso
                if (loginError) loginError.style.display = 'none';

                if (rememberMe) {
                    localStorage.setItem(AUTH_SESSION_KEY, 'true');
                    localStorage.setItem(AUTH_EMAIL_KEY, emailVal);
                } else {
                    sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
                    sessionStorage.setItem(AUTH_EMAIL_KEY, emailVal);
                }

                showToast('¡Bienvenido al Panel de Administración!', 'success');
                updateAuthUI();
            } else {
                // Error de credenciales
                if (loginError) {
                    loginError.style.display = 'flex';
                    // Re-disparar animación de shake
                    loginError.style.animation = 'none';
                    void loginError.offsetWidth;
                    loginError.style.animation = 'shake 0.4s ease-in-out';
                }
                passwordInput.value = '';
                passwordInput.focus();
            }
        });
    }

    // Logout
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem(AUTH_SESSION_KEY);
            sessionStorage.removeItem(AUTH_EMAIL_KEY);
            localStorage.removeItem(AUTH_SESSION_KEY);
            localStorage.removeItem(AUTH_EMAIL_KEY);
            showToast('Sesión cerrada correctamente', 'warning');
            updateAuthUI();
        });
    }

    // --- DASHBOARD: MÉTRICAS Y LISTADO ---
    const updateKPIs = (products) => {
        if (kpiTotal) kpiTotal.textContent = products.length;
        if (kpiPizzas) kpiPizzas.textContent = products.filter(p => p.category === 'pizzas').length;
        if (kpiBebidas) kpiBebidas.textContent = products.filter(p => p.category === 'bebidas').length;
        if (kpiEncargos) kpiEncargos.textContent = products.filter(p => p.category === 'encargos').length;
    };

    // Carga precios actuales de Ruedas en los inputs del panel
    const loadRuedaPricesInputs = () => {
        if (!window.ProductsManager) return;
        const prices = window.ProductsManager.getRuedaPrices();
        const inputJunior = document.getElementById('price-rueda-junior');
        const inputMedium = document.getElementById('price-rueda-medium');
        const inputFamiliar = document.getElementById('price-rueda-familiar');

        if (inputJunior) inputJunior.value = prices.junior?.price || prices.junior?.priceLlevar || 22000;
        if (inputMedium) inputMedium.value = prices.medium?.price || prices.medium?.priceLlevar || 34000;
        if (inputFamiliar) inputFamiliar.value = prices.familiar?.price || prices.familiar?.priceLlevar || 48000;
    };

    // Guardar precios de ruedas (se sincronizan con el juego y el catálogo)
    const btnSaveRuedasPrices = document.getElementById('btn-save-ruedas-prices');
    if (btnSaveRuedasPrices) {
        btnSaveRuedasPrices.addEventListener('click', () => {
            const pJunior = parseInt(document.getElementById('price-rueda-junior')?.value) || 22000;
            const pMedium = parseInt(document.getElementById('price-rueda-medium')?.value) || 34000;
            const pFamiliar = parseInt(document.getElementById('price-rueda-familiar')?.value) || 48000;

            const updated = {
                junior: { id: "rueda-junior", name: "Rueda Junior", badge: "Junior", priceLocal: Math.max(0, pJunior - 2000), priceLlevar: pJunior, price: pJunior },
                medium: { id: "rueda-medium", name: "Rueda Medium", badge: "Medium", priceLocal: Math.max(0, pMedium - 2000), priceLlevar: pMedium, price: pMedium },
                familiar: { id: "rueda-familiar", name: "Rueda Familiar", badge: "Familiar", priceLocal: Math.max(0, pFamiliar - 3000), priceLlevar: pFamiliar, price: pFamiliar }
            };

            window.ProductsManager.saveRuedaPrices(updated);
            showToast('¡Precios de Ruedas de Pizza actualizados con éxito!', 'success');
            renderDashboard();
        });
    }

    // Carga el precio actual de las porciones en el input del panel
    const loadPorcionPriceInput = () => {
        if (!window.ProductsManager) return;
        const porciones = window.ProductsManager.getAll().filter(
            p => p.category === 'pizzas' && p.subcategory === 'porciones'
        );
        const input = document.getElementById('price-porcion');
        if (input && porciones.length > 0) {
            input.value = porciones[0].price;
        }
    };

    // Guardar precio de porciones: actualiza todas las 10 porciones al mismo tiempo
    if (btnSavePorcionPrice) {
        btnSavePorcionPrice.addEventListener('click', () => {
            const nuevoPrice = parseInt(document.getElementById('price-porcion')?.value);
            if (!nuevoPrice || nuevoPrice <= 0) {
                showToast('Por favor ingresa un precio válido', 'error');
                return;
            }

            const porciones = window.ProductsManager.getAll().filter(
                p => p.category === 'pizzas' && p.subcategory === 'porciones'
            );

            porciones.forEach(p => {
                window.ProductsManager.update(p.id, { ...p, price: nuevoPrice });
            });

            showToast(`¡Precio de porciones actualizado a $${nuevoPrice.toLocaleString('es-CO')} COP!`, 'success');
            renderDashboard();
        });
    }

    const renderDashboard = () => {
        if (!productsGrid) return;
        const allProducts = window.ProductsManager.getAll();
        updateKPIs(allProducts);
        loadRuedaPricesInputs();
        loadPorcionPriceInput();

        // Filtrado por categoría y búsqueda
        const filtered = allProducts.filter(item => {
            let matchesCategory = false;
            if (currentCategory === 'all') {
                matchesCategory = true;
            } else {
                matchesCategory = (item.category === currentCategory);
            }

            const q = searchQuery.toLowerCase();
            const matchesSearch = !q || 
                item.name.toLowerCase().includes(q) || 
                (item.description && item.description.toLowerCase().includes(q)) ||
                (item.subcategory && item.subcategory.toLowerCase().includes(q));
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-pizza-slice"></i>
                    <h3>No se encontraron productos</h3>
                    <p>No hay elementos que coincidan con los filtros o la búsqueda actual.</p>
                    <button class="btn-primary-admin" onclick="document.getElementById('btn-new-product').click()">
                        <i class="fa-solid fa-plus"></i> Crear Nuevo Producto
                    </button>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = filtered.map(item => {
            const imgPath = window.ProductsManager.resolveImagePath(item.image);
            const formattedPrice = Number(item.price).toLocaleString('es-CO');
            const categoryLabels = {
                pizzas: 'Porción',
                ruedas: 'Rueda de Pizza',
                bebidas: 'Bebida',
                encargos: 'Encargo'
            };
            const catName = categoryLabels[item.category] || (item.subcategory === 'ruedas' ? 'Rueda de Pizza' : item.category);

            return `
                <div class="admin-product-card" data-id="${item.id}">
                    <div class="admin-card-img-wrap">
                        <span class="admin-category-badge">${catName}</span>
                        ${item.badge ? `<span class="admin-special-badge">${item.badge}</span>` : ''}
                        <div class="admin-card-img" style="background-image: url('${imgPath}')"></div>
                    </div>
                    <div class="admin-card-body">
                        <h4 class="admin-card-title">${item.name}</h4>
                        <p class="admin-card-desc">${item.description || 'Sin descripción detallada.'}</p>
                        <div class="admin-card-footer">
                            <span class="admin-price">$${formattedPrice} COP</span>
                            <div class="admin-card-actions">
                                <button class="btn-card-edit" data-id="${item.id}" title="Editar Producto">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="btn-card-delete" data-id="${item.id}" data-name="${item.name}" title="Eliminar Producto">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Vincular eventos de editar y eliminar
        productsGrid.querySelectorAll('.btn-card-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openEditModal(id);
            });
        });

        productsGrid.querySelectorAll('.btn-card-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                openDeleteModal(id, name);
            });
        });
    };

    // Búsqueda en vivo
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderDashboard();
        });
    }

    // Filtros de categoría
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.getAttribute('data-category');
            renderDashboard();
        });
    });

    // --- MODAL: CREAR / EDITAR PRODUCTO ---
    const openNewModal = () => {
        productForm.reset();
        productIdInput.value = '';
        modalTitle.innerHTML = '<i class="fa-solid fa-plus-circle"></i> Nuevo Producto';
        previewContainer.style.backgroundImage = 'url("../imagen/pzz.jpg")';
        productModal.classList.add('active');
        prodNameInput.focus();
    };

    const openEditModal = (id) => {
        const prod = window.ProductsManager.getById(id);
        if (!prod) return;

        productIdInput.value = prod.id;
        prodNameInput.value = prod.name;
        prodCategorySelect.value = prod.category;
        prodSubcategoryInput.value = prod.subcategory || '';
        prodPriceInput.value = prod.price;
        prodBadgeInput.value = prod.badge || '';
        prodDescInput.value = prod.description || '';
        prodImageInput.value = prod.image || '';

        const resolved = window.ProductsManager.resolveImagePath(prod.image);
        previewContainer.style.backgroundImage = `url('${resolved}')`;

        modalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar Producto';
        productModal.classList.add('active');
    };

    const closeModal = () => {
        productModal.classList.remove('active');
        productForm.reset();
    };

    if (btnNewProduct) btnNewProduct.addEventListener('click', openNewModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

    // Previsualización de imagen al escribir URL o ruta
    if (prodImageInput) {
        prodImageInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val) {
                const resolved = window.ProductsManager.resolveImagePath(val);
                previewContainer.style.backgroundImage = `url('${resolved}')`;
            } else {
                previewContainer.style.backgroundImage = 'url("../imagen/pzz.jpg")';
            }
        });
    }

    // Subida de imagen local (FileReader a Base64)
    if (prodFileInput) {
        prodFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 2 * 1024 * 1024) {
                showToast('La imagen es demasiado grande. Máximo 2MB.', 'error');
                prodFileInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Data = event.target.result;
                prodImageInput.value = base64Data;
                previewContainer.style.backgroundImage = `url('${base64Data}')`;
                showToast('Imagen cargada correctamente', 'success');
            };
            reader.readAsDataURL(file);
        });
    }

    // Guardar Producto (Nuevo o Editado)
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const id = productIdInput.value.trim();
            const name = prodNameInput.value.trim();
            const category = prodCategorySelect.value;
            const subcategory = prodSubcategoryInput.value.trim();
            const price = parseInt(prodPriceInput.value) || 0;
            const badge = prodBadgeInput.value.trim();
            const description = prodDescInput.value.trim();
            const image = prodImageInput.value.trim() || 'imagen/pzz.jpg';

            if (!name || isNaN(price)) {
                showToast('Por favor completa el nombre y un precio válido', 'error');
                return;
            }

            if (id) {
                // Actualizar existente
                const updated = window.ProductsManager.update(id, {
                    name,
                    category,
                    subcategory,
                    price,
                    badge,
                    description,
                    image
                });
                if (updated) {
                    showToast(`¡"${name}" actualizado con éxito!`, 'success');
                }
            } else {
                // Crear nuevo
                window.ProductsManager.add({
                    name,
                    category,
                    subcategory,
                    price,
                    badge,
                    description,
                    image
                });
                showToast(`¡"${name}" agregado al catálogo!`, 'success');
            }

            closeModal();
            renderDashboard();
        });
    }

    // --- MODAL: ELIMINAR PRODUCTO ---
    const openDeleteModal = (id, name) => {
        itemToDeleteId = id;
        if (deleteItemNameEl) deleteItemNameEl.textContent = name;
        if (deleteModal) deleteModal.classList.add('active');
    };

    const closeDeleteModal = () => {
        itemToDeleteId = null;
        if (deleteModal) deleteModal.classList.remove('active');
    };

    if (btnCancelDelete) btnCancelDelete.addEventListener('click', closeDeleteModal);

    if (btnConfirmDelete) {
        btnConfirmDelete.addEventListener('click', () => {
            if (itemToDeleteId) {
                const deleted = window.ProductsManager.delete(itemToDeleteId);
                if (deleted) {
                    showToast('Producto eliminado del catálogo', 'warning');
                    renderDashboard();
                }
            }
            closeDeleteModal();
        });
    }

    // --- MODAL: RESTABLECER CATÁLOGO ---
    if (btnResetCatalog) {
        btnResetCatalog.addEventListener('click', () => {
            if (resetModal) resetModal.classList.add('active');
        });
    }

    if (btnCancelReset) {
        btnCancelReset.addEventListener('click', () => {
            if (resetModal) resetModal.classList.remove('active');
        });
    }

    if (btnConfirmReset) {
        btnConfirmReset.addEventListener('click', () => {
            window.ProductsManager.reset();
            showToast('Catálogo restablecido a valores por defecto', 'success');
            if (resetModal) resetModal.classList.remove('active');
            renderDashboard();
        });
    }

    // --- EXPORTAR / IMPORTAR CATÁLOGO JSON ---
    if (btnExportJson) {
        btnExportJson.addEventListener('click', () => {
            const data = window.ProductsManager.getAll();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `delicius_productos_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Catálogo descargado como archivo JSON', 'success');
        });
    }

    if (fileImportInput) {
        fileImportInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        window.ProductsManager.saveAll(parsed);
                        showToast(`¡Se importaron ${parsed.length} productos con éxito!`, 'success');
                        renderDashboard();
                    } else {
                        showToast('El archivo no contiene un catálogo válido', 'error');
                    }
                } catch (err) {
                    showToast('Error al parsear el archivo JSON', 'error');
                }
            };
            reader.readAsText(file);
            fileImportInput.value = '';
        });
    }

    // Cerrar modales con clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === productModal) closeModal();
        if (e.target === deleteModal) closeDeleteModal();
        if (e.target === resetModal) resetModal.classList.remove('active');
    });

    // Iniciar vista
    updateAuthUI();
});
