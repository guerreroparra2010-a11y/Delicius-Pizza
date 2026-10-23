/**
 * Delicius Pizza - Products Manager
 * Manejo centralizado del catálogo de productos con persistencia en localStorage.
 * Permite listar, agregar, editar, eliminar y restablecer productos desde el Frontend.
 */

const DEFAULT_PRODUCTS = [
    // --- PIZZAS Y PORCIONES ---
    {
        id: "pizza-1",
        name: "Porción Pepperoni",
        category: "pizzas",
        subcategory: "porciones",
        price: 9000,
        description: "Queso mozzarella premium y abundante pepperoni curado.",
        image: "imagen/porcion-peperoni.jpg",
        badge: "Clásica"
    },
    {
        id: "pizza-2",
        name: "Porción Hawaiana",
        category: "pizzas",
        subcategory: "porciones",
        price: 9000,
        description: "Jamón seleccionado y piña dulce sobre base de queso fundido.",
        image: "imagen/porcion-hawaiana.jpg",
        badge: "Favorita"
    },
    {
        id: "pizza-3",
        name: "Porción Carnes",
        category: "pizzas",
        subcategory: "porciones",
        price: 9000,
        description: "Tocineta, pepperoni, jamón y carne molida con sazón de la casa.",
        image: "imagen/porcion-carnes.jpg",
        badge: "Especial"
    },
    {
        id: "pizza-4",
        name: "Porción Mexicana",
        category: "pizzas",
        subcategory: "porciones",
        price: 9000,
        description: "Carne molida, frijol, jalapeños selectos y maíz tierno tostado.",
        image: "imagen/porcion-mexicana.jpg",
        badge: "Picante"
    },
    {
        id: "pizza-5",
        name: "Porción Ranchera",
        category: "pizzas",
        subcategory: "porciones",
        price: 9000,
        description: "Salchicha ranchera, maíz tierno, tocineta crujiente y salsa BBQ especial.",
        image: "imagen/porcion-ranchera.jpg",
        badge: "Popular"
    },
    {
        id: "pizza-6",
        name: "Porción Tropical",
        category: "pizzas",
        subcategory: "porciones",
        price: 9000,
        description: "Jamón premium, piña dulce, cerezas y queso gratinado.",
        image: "imagen/porcion-tropical.jpg"
    },
    {
        id: "pizza-7",
        name: "Porción Carbonara",
        category: "pizzas",
        subcategory: "porciones",
        price: 9000,
        description: "Exquisita salsa carbonara a la crema, pollo y tocineta.",
        image: "imagen/porcion-carbonara.jpg"
    },
    {
        id: "pizza-10",
        name: "Porción Pollo con Champiñones",
        category: "pizzas",
        subcategory: "porciones",
        price: 9000,
        description: "Pollo, champiñón y abundante queso mozzarella fundido.",
        image: "imagen/porcion-pollo-champinones.jpg",
        badge: "Popular"
    },
    {
        id: "pizza-8",
        name: "Porción Napolitana",
        category: "pizzas",
        subcategory: "porciones",
        price: 9000,
        description: "Tomate natural, albahaca de nuestro huerto, orégano y aceite de oliva.",
        image: "imagen/porcion-napolitana.jpg"
    },
    {
        id: "pizza-9",
        name: "Porción Criolla",
        category: "pizzas",
        subcategory: "porciones",
        price: 9000,
        description: "Sabor tradicional con carne desmechada, maíz tierno tostado, cebolla y cilantro fresco.",
        image: "imagen/porcion-criolla.jpg",
        badge: "Auténtica"
    },

    // --- ENCARGOS ESPECIALES ---
    {
        id: "encargo-1",
        name: "Porción Tentación",
        category: "encargos",
        subcategory: "especiales",
        price: 10000,
        description: "Chocolate, fresas, banano y queso. Una delicia dulce sobre masa artesanal. Solo por encargo con 2 días de anticipación.",
        image: "imagen/porcion-tentacion.jpg",
        badge: "Dulce"
    },
    {
        id: "encargo-2",
        name: "Panzeroti",
        category: "encargos",
        subcategory: "especiales",
        price: 6000,
        description: "Masa crujiente rellena de queso mozzarella fundido y el ingrediente de tu elección. Perfecto para compartir.",
        image: "imagen/panzerotis.jpg"
    },
    {
        id: "encargo-3",
        name: "Avena Cubana",
        category: "encargos",
        subcategory: "especiales",
        price: 5000,
        description: "Deliciosa avena cremosa y fría con el toque tradicional y refrescante de la casa.",
        image: "imagen/avena-cubana.jpg"
    },

    // --- BEBIDAS (250ml - 280ml) ---
    {
        id: "bebida-1",
        name: "Coca-Cola 250ml",
        category: "bebidas",
        subcategory: "250ml-280ml",
        price: 2500,
        description: "Presentación personal pet fría y refrescante.",
        image: "imagen/coca-cola-250ml.jpg"
    },
    {
        id: "bebida-2",
        name: "Coca-Cola 280ml",
        category: "bebidas",
        subcategory: "250ml-280ml",
        price: 2800,
        description: "Clásica en botella de vidrio para consumo exclusivo en el local.",
        image: "imagen/coca-cola-vidrio-280ml.jpg"
    },
    {
        id: "bebida-3",
        name: "Sprite 280ml",
        category: "bebidas",
        subcategory: "250ml-280ml",
        price: 2800,
        description: "Refrescante lima-limón en vidrio para consumo exclusivo en el local.",
        image: "imagen/sprite-vidrio-280ml.jpg"
    },

    // --- BEBIDAS (330ml - 350ml) ---
    {
        id: "bebida-4",
        name: "Pony Malta 330ml",
        category: "bebidas",
        subcategory: "330ml-350ml",
        price: 3000,
        description: "Bebida de malta nutritiva y helada.",
        image: "imagen/pony-malta-330ml.jpg"
    },
    {
        id: "bebida-5",
        name: "Kola Sol 335ml",
        category: "bebidas",
        subcategory: "330ml-350ml",
        price: 3000,
        description: "Sabor tradicional de la región bien fría.",
        image: "imagen/kola-sol-335ml.jpg"
    },
    {
        id: "bebida-6",
        name: "Agua Brisa",
        category: "bebidas",
        subcategory: "330ml-350ml",
        price: 3000,
        description: "Agua pura y cristalina para hidratarte.",
        image: "imagen/agua-brisa.jpg"
    },
    {
        id: "bebida-7",
        name: "Agua con gas Brisa",
        category: "bebidas",
        subcategory: "330ml-350ml",
        price: 3000,
        description: "Agua mineralizada con gas para refrescarte.",
        image: "imagen/agua-con-gas-brisa.jpg"
    },
    {
        id: "bebida-8",
        name: "Coca-Cola 0 350ml",
        category: "bebidas",
        subcategory: "330ml-350ml",
        price: 3500,
        description: "Sin azúcar en botella de vidrio para consumo en el local.",
        image: "imagen/coca-cola-0-vidrio-350ml.jpg"
    },
    {
        id: "bebida-9",
        name: "Coca-Cola 350ml",
        category: "bebidas",
        subcategory: "330ml-350ml",
        price: 3500,
        description: "Sabor original en botella de vidrio para consumo en el local.",
        image: "imagen/coca-cola-vidrio-350ml.jpg"
    },
    {
        id: "bebida-10",
        name: "Colombiana 350ml",
        category: "bebidas",
        subcategory: "330ml-350ml",
        price: 3500,
        description: "La nuestra en botella de vidrio para consumo en el local.",
        image: "imagen/colombiana-vidrio-350ml.jpg"
    },
    {
        id: "bebida-11",
        name: "Freskola 350ml",
        category: "bebidas",
        subcategory: "330ml-350ml",
        price: 3500,
        description: "Deliciosa en botella de vidrio para consumo en el local.",
        image: "imagen/freskola-vidrio-350ml.jpg"
    },
    {
        id: "bebida-12",
        name: "Manzana 350ml",
        category: "bebidas",
        subcategory: "330ml-350ml",
        price: 3500,
        description: "Sabor manzana Postobón en vidrio para consumo en local.",
        image: "imagen/manzana-vidrio-350ml.jpg"
    },
    {
        id: "bebida-13",
        name: "Quatro 350ml",
        category: "bebidas",
        subcategory: "330ml-350ml",
        price: 3500,
        description: "Sabor toronja en vidrio para consumo exclusivo en local.",
        image: "imagen/quatro-vidrio-350ml.jpg"
    },
    {
        id: "bebida-14",
        name: "Soda 350ml",
        category: "bebidas",
        subcategory: "330ml-350ml",
        price: 3500,
        description: "Soda burbujeante en vidrio para consumo exclusivo en local.",
        image: "imagen/soda-vidrio-350ml.jpg"
    },
    {
        id: "bebida-15",
        name: "Sprite 350ml",
        category: "bebidas",
        subcategory: "330ml-350ml",
        price: 3500,
        description: "Refresco lima-limón en vidrio para consumo en local.",
        image: "imagen/sprite-vidrio-350ml.jpg"
    },
    {
        id: "bebida-16",
        name: "Uva 350ml",
        category: "bebidas",
        subcategory: "330ml-350ml",
        price: 3500,
        description: "Gaseosa Postobón sabor uva en vidrio para consumo en local.",
        image: "imagen/uva-vidrio-350ml.jpg"
    },

    // --- BEBIDAS (400ml) ---
    {
        id: "bebida-17",
        name: "Coca-Cola 400ml",
        category: "bebidas",
        subcategory: "400ml",
        price: 4000,
        description: "Botella pet 400ml fría, lista para llevar o consumir.",
        image: "imagen/coca-cola-400ml.jpg"
    },
    {
        id: "bebida-18",
        name: "Coca-Cola 0 400ml",
        category: "bebidas",
        subcategory: "400ml",
        price: 4000,
        description: "Sin azúcar botella pet 400ml refrescante.",
        image: "imagen/coca-cola-0-400ml.jpg"
    },
    {
        id: "bebida-19",
        name: "Colombiana 400ml",
        category: "bebidas",
        subcategory: "400ml",
        price: 3500,
        description: "Gaseosa típica colombiana botella pet 400ml.",
        image: "imagen/colombiana-400ml.jpg"
    },
    {
        id: "bebida-20",
        name: "Ginger 400ml",
        category: "bebidas",
        subcategory: "400ml",
        price: 4000,
        description: "Canada Dry Ginger Ale 400ml pet.",
        image: "imagen/ginger-400ml.jpg"
    },
    {
        id: "bebida-21",
        name: "Manzana 400ml",
        category: "bebidas",
        subcategory: "400ml",
        price: 3500,
        description: "Postobón manzana botella pet 400ml.",
        image: "imagen/manzana-400ml.jpg"
    },
    {
        id: "bebida-22",
        name: "Sprite 400ml",
        category: "bebidas",
        subcategory: "400ml",
        price: 4000,
        description: "Sprite sabor lima-limón 400ml pet.",
        image: "imagen/sprite-400ml.jpg"
    },
    {
        id: "bebida-23",
        name: "Valle 400ml",
        category: "bebidas",
        subcategory: "400ml",
        price: 3500,
        description: "Jugo del Valle sabor frutas 400ml pet.",
        image: "imagen/valle-400ml.jpg"
    },

    // --- BEBIDAS (600ml) ---
    {
        id: "bebida-24",
        name: "Fuzetea Durazno 600ml",
        category: "bebidas",
        subcategory: "600ml",
        price: 4500,
        description: "Té helado sabor durazno refrescante 600ml pet.",
        image: "imagen/fuzetea-durasno-600ml.jpg"
    },
    {
        id: "bebida-25",
        name: "Fuzetea Limon 600ml",
        category: "bebidas",
        subcategory: "600ml",
        price: 4500,
        description: "Té helado sabor limón refrescante 600ml pet.",
        image: "imagen/fuzetea-limon-600ml.jpg"
    },

    // --- BEBIDAS FAMILIARES (1L - 2.25L) ---
    {
        id: "bebida-26",
        name: "Coca-Cola 1L",
        category: "bebidas",
        subcategory: "1L-2.25L",
        price: 5500,
        description: "Presentación 1 Litro pet ideal para compartir en pareja.",
        image: "imagen/coca-cola-1l.jpg"
    },
    {
        id: "bebida-27",
        name: "Kola Sol 1L",
        category: "bebidas",
        subcategory: "1L-2.25L",
        price: 5000,
        description: "Tradicional Kola Sol 1 Litro pet.",
        image: "imagen/kola-sol-1l.jpg"
    },
    {
        id: "bebida-28",
        name: "Coca-Cola 1.5L",
        category: "bebidas",
        subcategory: "1L-2.25L",
        price: 7000,
        description: "Botella familiar 1.5 Litros pet.",
        image: "imagen/coca-cola-15l.jpg"
    },
    {
        id: "bebida-29",
        name: "Ginger 1.5L",
        category: "bebidas",
        subcategory: "1L-2.25L",
        price: 7000,
        description: "Canada Dry Ginger Ale 1.5 Litros pet.",
        image: "imagen/ginger-15l.jpg"
    },
    {
        id: "bebida-30",
        name: "Quatro 1.5L",
        category: "bebidas",
        subcategory: "1L-2.25L",
        price: 7000,
        description: "Gaseosa Quatro Toronja 1.5 Litros pet.",
        image: "imagen/quatro-15l.jpg"
    },
    {
        id: "bebida-31",
        name: "Sprite 1.5L",
        category: "bebidas",
        subcategory: "1L-2.25L",
        price: 7000,
        description: "Gaseosa Sprite lima-limón 1.5 Litros pet.",
        image: "imagen/sprite-15l.jpg"
    },
    {
        id: "bebida-32",
        name: "Kola Sol 2L",
        category: "bebidas",
        subcategory: "1L-2.25L",
        price: 8500,
        description: "Kola Sol tamaño familiar 2 Litros pet.",
        image: "imagen/kola-sol-2l.jpg"
    },
    {
        id: "bebida-33",
        name: "Coca-Cola 2.25L",
        category: "bebidas",
        subcategory: "1L-2.25L",
        price: 9500,
        description: "Mega botella Coca-Cola 2.25 Litros familiar.",
        image: "imagen/coca-cola-225l.jpg"
    }
];

const STORAGE_KEY = 'delicius_products';
const RUEDA_PRICES_KEY = 'delicius_rueda_prices';
const CATALOG_VERSION = 'delicius_remaster_v2026_1';

const DEFAULT_RUEDA_PRICES = {
    junior:   { id: "rueda-junior",   name: "Rueda Junior",   badge: "Junior",   priceLocal: 20000, priceLlevar: 22000, price: 22000 },
    medium:   { id: "rueda-medium",   name: "Rueda Medium",   badge: "Medium",   priceLocal: 32000, priceLlevar: 34000, price: 34000 },
    familiar: { id: "rueda-familiar", name: "Rueda Familiar", badge: "Familiar", priceLocal: 45000, priceLlevar: 48000, price: 48000 }
};

const ProductsManager = {
    /**
     * Resuelve rutas de imagen relativas dependiendo de si estamos en /html/ o en la raíz.
     */
    resolveImagePath(path) {
        if (!path) return '../imagen/pzz.jpg';
        if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        const cleanPath = path.replace(/^(\.\.\/|\.\/)+/, '');
        const pathLower = (window.location.pathname || '').toLowerCase();
        const isInHtmlFolder = pathLower.includes('/html/') || pathLower.endsWith('/html');
        return isInHtmlFolder ? `../${cleanPath}` : cleanPath;
    },

    /**
     * Obtiene los precios configurados para los diferentes tamaños de Ruedas de Pizza.
     */
    getRuedaPrices() {
        try {
            const raw = localStorage.getItem(RUEDA_PRICES_KEY);
            if (!raw) return { ...DEFAULT_RUEDA_PRICES };
            return { ...DEFAULT_RUEDA_PRICES, ...JSON.parse(raw) };
        } catch (e) {
            return { ...DEFAULT_RUEDA_PRICES };
        }
    },

    /**
     * Guarda los precios de las Ruedas de Pizza (para llevar y en el negocio) y los sincroniza con el catálogo.
     */
    saveRuedaPrices(pricesObj) {
        try {
            const current = this.getRuedaPrices();
            const updatedPrices = { ...current, ...pricesObj };
            localStorage.setItem(RUEDA_PRICES_KEY, JSON.stringify(updatedPrices));

            // Sincronizar en el catálogo de productos de ruedas
            const products = this.getAll();
            let changed = false;

            ['junior', 'medium', 'familiar'].forEach(key => {
                if (updatedPrices[key]) {
                    const priceLlevar = typeof updatedPrices[key] === 'object' 
                        ? (parseInt(updatedPrices[key].priceLlevar) || parseInt(updatedPrices[key].price) || 0) 
                        : (parseInt(updatedPrices[key]) || 0);
                    const priceLocal = typeof updatedPrices[key] === 'object'
                        ? (parseInt(updatedPrices[key].priceLocal) || priceLlevar)
                        : priceLlevar;

                    // Actualizar el producto del catálogo que coincida
                    const prod = products.find(p => 
                        p.id === `rueda-${key}` || 
                        (p.category === 'ruedas' && p.badge && p.badge.toLowerCase() === key)
                    );
                    if (prod) {
                        prod.price = priceLlevar;
                        prod.priceLocal = priceLocal;
                        prod.priceLlevar = priceLlevar;
                        changed = true;
                    }
                }
            });

            if (changed) {
                this.saveAll(products);
            }

            window.dispatchEvent(new CustomEvent('delicius_rueda_prices_updated', { detail: updatedPrices }));
            return true;
        } catch (e) {
            console.error("Error al guardar precios de ruedas:", e);
            return false;
        }
    },

    /**
     * Obtiene todos los productos desde localStorage o carga los iniciales.
     * Incluye auto-migración para inyectar Ruedas de Pizza si el usuario ya tenía productos guardados.
     */
    getAll() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                this.reset();
                return [...DEFAULT_PRODUCTS];
            }
            let parsed = JSON.parse(raw);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                this.reset();
                return [...DEFAULT_PRODUCTS];
            }

            // Migración: asegurar que Carbonara tenga pollo y no champiñón, e incluir Pollo con Champiñones
            let migrated = false;
            const carb = parsed.find(p => p.name === 'Porción Carbonara' || p.id === 'pizza-7');
            if (carb && carb.description && carb.description.includes('champiñon')) {
                carb.description = "Exquisita salsa carbonara a la crema, pollo y tocineta.";
                migrated = true;
            }
            const polloChamp = parsed.find(p => 
                (p.name && p.name.toLowerCase().includes('pollo con champiñ')) || 
                p.id === 'pizza-10'
            );
            if (polloChamp) {
                if (polloChamp.description !== "Pollo, champiñón y abundante queso mozzarella fundido." || polloChamp.image !== "imagen/porcion-pollo-champinones.jpg") {
                    polloChamp.description = "Pollo, champiñón y abundante queso mozzarella fundido.";
                    polloChamp.image = "imagen/porcion-pollo-champinones.jpg";
                    migrated = true;
                }
            } else {
                const carbIdx = parsed.findIndex(p => p.name === 'Porción Carbonara' || p.id === 'pizza-7');
                const newProd = {
                    id: "pizza-10",
                    name: "Porción Pollo con Champiñones",
                    category: "pizzas",
                    subcategory: "porciones",
                    price: 9000,
                    description: "Pollo, champiñón y abundante queso mozzarella fundido.",
                    image: "imagen/porcion-pollo-champinones.jpg",
                    badge: "Popular"
                };
                if (carbIdx !== -1) {
                    parsed.splice(carbIdx + 1, 0, newProd);
                } else {
                    parsed.push(newProd);
                }
                migrated = true;
            }

            // Sincronización de catálogo: asegura que las imágenes remasterizadas se apliquen
            // incluso si el usuario ya tenía productos guardados en localStorage
            if (localStorage.getItem('delicius_cat_ver') !== CATALOG_VERSION) {
                DEFAULT_PRODUCTS.forEach(defProd => {
                    const match = parsed.find(p => p.id === defProd.id);
                    if (match) {
                        match.image = defProd.image;
                        if (defProd.description) match.description = defProd.description;
                    }
                });
                localStorage.setItem('delicius_cat_ver', CATALOG_VERSION);
                migrated = true;
            }

            // Limpieza: Las Ruedas no van como tarjetas de productos en el catálogo
            // (Son exclusivas del juego interactivo y su precio se gestiona arriba)
            const countBefore = parsed.length;
            parsed = parsed.filter(p => p.category !== 'ruedas' && !String(p.id).startsWith('rueda-'));
            if (parsed.length !== countBefore) {
                migrated = true;
            }

            if (migrated) {
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed)); } catch (err) {}
            }

            return parsed;
        } catch (e) {
            console.error("Error al leer productos de localStorage:", e);
            return [...DEFAULT_PRODUCTS];
        }
    },

    /**
     * Guarda la lista de productos en localStorage y notifica cambios.
     */
    saveAll(products) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
            window.dispatchEvent(new CustomEvent('delicius_products_updated', { detail: products }));
            return true;
        } catch (e) {
            console.error("Error al guardar productos en localStorage:", e);
            return false;
        }
    },

    /**
     * Obtiene un producto por su ID.
     */
    getById(id) {
        return this.getAll().find(p => String(p.id) === String(id));
    },

    /**
     * Filtra productos por categoría principal.
     */
    getByCategory(category) {
        if (category === 'pizzas') {
            return this.getAll().filter(p => p.category === 'pizzas' && p.subcategory !== 'ruedas');
        }
        if (category === 'ruedas') {
            return this.getAll().filter(p => p.category === 'ruedas' || p.subcategory === 'ruedas');
        }
        return this.getAll().filter(p => p.category === category);
    },

    /**
     * Agrega un nuevo producto.
     */
    add(productData) {
        const products = this.getAll();
        const newProduct = {
            id: 'prod_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: productData.name.trim(),
            category: productData.category || 'pizzas',
            subcategory: productData.subcategory || '',
            price: Math.max(0, parseInt(productData.price) || 0),
            description: (productData.description || '').trim(),
            image: productData.image || 'imagen/pzz.jpg',
            badge: (productData.badge || '').trim()
        };
        products.unshift(newProduct);
        this.saveAll(products);
        return newProduct;
    },

    /**
     * Actualiza un producto existente.
     */
    update(id, updatedData) {
        const products = this.getAll();
        const index = products.findIndex(p => String(p.id) === String(id));
        if (index === -1) return null;

        products[index] = {
            ...products[index],
            name: updatedData.name ? updatedData.name.trim() : products[index].name,
            category: updatedData.category || products[index].category,
            subcategory: updatedData.subcategory !== undefined ? updatedData.subcategory : products[index].subcategory,
            price: updatedData.price !== undefined ? Math.max(0, parseInt(updatedData.price) || 0) : products[index].price,
            description: updatedData.description !== undefined ? updatedData.description.trim() : products[index].description,
            image: updatedData.image || products[index].image,
            badge: updatedData.badge !== undefined ? updatedData.badge.trim() : products[index].badge
        };

        // Sincronizar con RUEDA_PRICES_KEY si se modifica una Rueda
        if (String(id).startsWith('rueda-')) {
            const key = String(id).replace('rueda-', '');
            const currentRuedaPrices = this.getRuedaPrices();
            if (currentRuedaPrices[key]) {
                currentRuedaPrices[key].price = products[index].price;
                currentRuedaPrices[key].priceLlevar = products[index].price;
                try {
                    localStorage.setItem(RUEDA_PRICES_KEY, JSON.stringify(currentRuedaPrices));
                    window.dispatchEvent(new CustomEvent('delicius_rueda_prices_updated', { detail: currentRuedaPrices }));
                } catch(e) {}
            }
        }

        this.saveAll(products);
        return products[index];
    },

    /**
     * Elimina un producto por su ID.
     */
    delete(id) {
        const products = this.getAll();
        const filtered = products.filter(p => String(p.id) !== String(id));
        if (filtered.length === products.length) return false;
        this.saveAll(filtered);
        return true;
    },

    /**
     * Restablece los productos a la lista por defecto.
     */
    reset() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
        localStorage.setItem(RUEDA_PRICES_KEY, JSON.stringify(DEFAULT_RUEDA_PRICES));
        window.dispatchEvent(new CustomEvent('delicius_products_updated', { detail: DEFAULT_PRODUCTS }));
        window.dispatchEvent(new CustomEvent('delicius_rueda_prices_updated', { detail: DEFAULT_RUEDA_PRICES }));
        return [...DEFAULT_PRODUCTS];
    },

    /**
     * Crea el HTML de una tarjeta de producto (menu-card).
     */
    createCardHTML(product) {
        const imgPath = this.resolveImagePath(product.image);
        const clean = (product.image || '').replace(/^(\.\.\/|\.\/)+/, '');
        const altPath = imgPath.startsWith('../') ? clean : `../${clean}`;
        const formattedPrice = Number(product.price).toLocaleString('es-CO');
        const badgeHTML = product.badge ? `<div class="menu-card-badge" style="position: absolute; top: 12px; right: 12px; background: var(--primary-color); color: #000; font-weight: 700; font-size: 0.75rem; padding: 4px 10px; border-radius: 50px; z-index: 2; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">${product.badge}</div>` : '';

        return `
            <div class="menu-card" data-product-id="${product.id}" style="position: relative;">
                ${badgeHTML}
                <div class="menu-card-img contain" style="background-image: url('${imgPath}')">
                    <img src="${imgPath}" alt="${product.name}" style="display:none;" onerror="if(!this.dataset.err){this.dataset.err=1; this.parentElement.style.backgroundImage='url(${altPath})';}">
                </div>
                <div class="menu-card-content">
                    <h3>${product.name}</h3>
                    ${product.description ? `<p>${product.description}</p>` : ''}
                    <div class="price-action">
                        <span class="price">$${formattedPrice} (COP)</span>
                        <button class="btn-primary add-to-cart-btn" 
                                data-name="${product.name}" 
                                data-price="${product.price}" 
                                data-img="${imgPath}">
                            Agregar
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderiza las Ruedas de Pizza en pizzas.html
     */
    renderRuedas(containerSelector = '#ruedas-grid') {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const all = this.getAll();
        const ruedas = all.filter(p => p.category === 'ruedas' || p.subcategory === 'ruedas');

        if (ruedas.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="fa-solid fa-pizza-slice" style="font-size: 3rem; margin-bottom: 1rem; color: var(--primary-color);"></i>
                    <p>No hay ruedas de pizza disponibles en este momento.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = ruedas.map(r => this.createCardHTML(r)).join('');
    },

    /**
     * Renderiza las Porciones individuales de Pizza en pizzas.html
     */
    renderPizzas(containerSelector = '#pizzas-grid') {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const porciones = this.getByCategory('pizzas');
        if (porciones.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="fa-solid fa-pizza-slice" style="font-size: 3rem; margin-bottom: 1rem; color: var(--primary-color);"></i>
                    <p>No hay porciones disponibles en este momento.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = porciones.map(p => this.createCardHTML(p)).join('');
    },

    /**
     * Renderiza las bebidas agrupadas o en sus secciones de bebidas.html
     */
    renderBebidas() {
        const sections = [
            { id: 'bebidas-grid-250', subcategory: '250ml-280ml' },
            { id: 'bebidas-grid-350', subcategory: '330ml-350ml' },
            { id: 'bebidas-grid-400', subcategory: '400ml' },
            { id: 'bebidas-grid-600', subcategory: '600ml' },
            { id: 'bebidas-grid-familiar', subcategory: '1L-2.25L' }
        ];

        const allBebidas = this.getByCategory('bebidas');

        // Si existen los contenedores específicos por sección
        let matchedAny = false;
        sections.forEach(sec => {
            const el = document.getElementById(sec.id);
            if (el) {
                matchedAny = true;
                const items = allBebidas.filter(b => b.subcategory === sec.subcategory);
                el.innerHTML = items.map(b => this.createCardHTML(b)).join('');
            }
        });

        // Contenedor genérico para otras bebidas agregadas dinámicamente
        const extraContainer = document.getElementById('bebidas-grid-extra');
        if (extraContainer) {
            const knownSubs = sections.map(s => s.subcategory);
            const extraItems = allBebidas.filter(b => !knownSubs.includes(b.subcategory));
            if (extraItems.length > 0) {
                extraContainer.innerHTML = extraItems.map(b => this.createCardHTML(b)).join('');
                const extraSection = document.getElementById('bebidas-section-extra');
                if (extraSection) extraSection.style.display = 'block';
            } else {
                extraContainer.innerHTML = '';
                const extraSection = document.getElementById('bebidas-section-extra');
                if (extraSection) extraSection.style.display = 'none';
            }
        }

        // Aplicar fondo Torre de Pisa característico de Delicius Pizza en bebidas
        const torrePisaImg = this.resolveImagePath('imagen/torre-pisa-bg.jpg');
        document.querySelectorAll('#bebidas .menu-card-img.contain').forEach(el => {
            const currentBg = el.style.backgroundImage;
            if (currentBg && !currentBg.includes('torre-pisa-bg')) {
                el.style.backgroundImage = `${currentBg}, url('${torrePisaImg}')`;
            }
        });
    },

    /**
     * Renderiza los encargos especiales en pedidoencargo.html
     */
    renderEncargos(containerSelector = '#encargos-grid') {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const encargos = this.getByCategory('encargos');
        if (encargos.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; color: var(--primary-color);"></i>
                    <p>No hay encargos especiales registrados actualmente.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = encargos.map(e => this.createCardHTML(e)).join('');
    }
};

// Exponer globalmente
window.ProductsManager = ProductsManager;

// Auto-inicializar si localStorage no tiene la clave
if (!localStorage.getItem(STORAGE_KEY)) {
    ProductsManager.reset();
}
