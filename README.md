# Delicius Pizza - Versión Clásica

Versión principal del sitio web con pantalla de bienvenida cinematográfica con audio, catálogo interactivo y creador de pizzas.

Proyecto formativo de TICs - Delicius Pizza Tocaima.

---

## 🌐 Cómo Desplegar en GitHub Pages

1. **Crear o abrir tu repositorio en GitHub** y subir los archivos de esta carpeta.
2. En GitHub, ve a la pestaña **Settings** (Configuración) del repositorio.
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En la sección **Build and deployment**:
   - **Source**: Selecciona `Deploy from a branch`.
   - **Branch**: Selecciona `main` (o `master`) y carpeta `/(root)`.
   - Haz clic en **Save** (Guardar).
5. Espera 1 a 2 minutos y tu sitio estará disponible en:
   `https://<tu-usuario>.github.io/<nombre-del-repositorio>/`

---

## 📁 Estructura del Proyecto

- `index.html`: Punto de entrada principal compatible con GitHub Pages.
- `single_page.html`: Vista de una sola página integrada con iframes responsivos.
- `html/`: Páginas del sitio (`index.html`, `menu.html`, `pizzas.html`, `bebidas.html`, `nosotros.html`, `resenas.html`, `creadores.html`, `pedidoencargo.html`).
- `pizza/`: Aplicación interactiva de juego/configuración "Crea tu Pizza".
- `css/`: Hojas de estilo personalizadas.
- `js/`: Lógica interactiva, carrito de compras sincronizado y pedidos por WhatsApp.
- `imagen/`: Recursos multimedia, iconos e imágenes optimizadas en nombres compatibles con servidores Linux (GitHub).
- `.nojekyll`: Asegura que GitHub Pages sirva todos los recursos estáticos sin filtrado de Jekyll.
