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
    const kpiRuedas = document.getElementById('kpi-ruedas-count');
    const kpiBebidas = document.getElementById('kpi-bebidas-count');
    const kpiEncargos = document.getElementById('kpi-encargos-count');

    // Precios de Ruedas
    const btnSaveRuedaPrices = document.getElementById('btn-save-rueda-prices');

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
        if (kpiPizzas) kpiPizzas.textContent = products.filter(p => p.category === 'pizzas' && p.subcategory !== 'ruedas').length;
        if (kpiRuedas) kpiRuedas.textContent = products.filter(p => p.category === 'ruedas' || p.subcategory === 'ruedas').length;
        if (kpiBebidas) kpiBebidas.textContent = products.filter(p => p.category === 'bebidas').length;
        if (kpiEncargos) kpiEncargos.textContent = products.filter(p => p.category === 'encargos').length;
    };

    // Carga los precios actuales de las Ruedas de Pizza en los inputs del panel
    const loadRuedaPricesInputs = () => {
        if (!window.ProductsManager || typeof window.ProductsManager.getRuedaPrices !== 'function') return;
        const prices = window.ProductsManager.getRuedaPrices();

        // Junior
        const juniorLocal  = document.getElementById('price-junior-local');
        const juniorLlevar = document.getElementById('price-junior-llevar');
        if (juniorLocal)  juniorLocal.value  = prices.junior?.priceLocal  || 20000;
        if (juniorLlevar) juniorLlevar.value = prices.junior?.priceLlevar || 22000;

        // Medium
        const mediumLocal  = document.getElementById('price-medium-local');
        const mediumLlevar = document.getElementById('price-medium-llevar');
        if (mediumLocal)  mediumLocal.value  = prices.medium?.priceLocal  || 32000;
        if (mediumLlevar) mediumLlevar.value = prices.medium?.priceLlevar || 34000;

        // Familiar
        const familiarLocal  = document.getElementById('price-familiar-local');
        const familiarLlevar = document.getElementById('price-familiar-llevar');
        if (familiarLocal)  familiarLocal.value  = prices.familiar?.priceLocal  || 45000;
        if (familiarLlevar) familiarLlevar.value = prices.familiar?.priceLlevar || 48000;
    };

    // Guardar precios de Ruedas de Pizza desde la tarjeta rápida
    if (btnSaveRuedaPrices) {
        btnSaveRuedaPrices.addEventListener('click', () => {
            const jLocal  = parseInt(document.getElementById('price-junior-local')?.value)  || 20000;
            const jLlevar = parseInt(document.getElementById('price-junior-llevar')?.value) || 22000;
            const mLocal  = parseInt(document.getElementById('price-medium-local')?.value)  || 32000;
            const mLlevar = parseInt(document.getElementById('price-medium-llevar')?.value) || 34000;
            const fLocal  = parseInt(document.getElementById('price-familiar-local')?.value)  || 45000;
            const fLlevar = parseInt(document.getElementById('price-familiar-llevar')?.value) || 48000;

            const current = window.ProductsManager.getRuedaPrices();
            const updated = {
                junior:   { ...current.junior,   priceLocal: jLocal, priceLlevar: jLlevar, price: jLlevar },
                medium:   { ...current.medium,   priceLocal: mLocal, priceLlevar: mLlevar, price: mLlevar },
                familiar: { ...current.familiar, priceLocal: fLocal, priceLlevar: fLlevar, price: fLlevar }
            };

            const success = window.ProductsManager.saveRuedaPrices(updated);
            if (success) {
                showToast('¡Precios de Ruedas de Pizza actualizados y sincronizados!', 'success');
                renderDashboard();
            } else {
                showToast('Error al guardar los precios de ruedas', 'error');
            }
        });
    }

    const renderDashboard = () => {
        if (!productsGrid) return;
        const allProducts = window.ProductsManager.getAll();
        updateKPIs(allProducts);
        loadRuedaPricesInputs();

        // Filtrado por categoría y búsqueda
        const filtered = allProducts.filter(item => {
            let matchesCategory = false;
            if (currentCategory === 'all') {
                matchesCategory = true;
            } else if (currentCategory === 'pizzas') {
                matchesCategory = (item.category === 'pizzas' && item.subcategory !== 'ruedas');
            } else if (currentCategory === 'ruedas') {
                matchesCategory = (item.category === 'ruedas' || item.subcategory === 'ruedas');
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
