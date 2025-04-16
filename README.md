# PromptCrafter - Generador de Prompts a partir de Archivos

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

PromptCrafter es una herramienta web sencilla y de código abierto diseñada para facilitar la creación de prompts complejos para Modelos de Lenguaje Grandes (LLMs) como GPT. Permite combinar instrucciones en texto plano con el contenido de múltiples archivos locales, generando un prompt unificado listo para ser utilizado.

Es ideal para tareas que requieren contexto de varios documentos o fragmentos de código, como:

*   Refactorizar código existente.
*   Generar documentación basada en código fuente.
*   Resumir o analizar múltiples documentos.
*   Crear contenido basado en varias fuentes de información.

## Características Principales

*   **Interfaz Intuitiva:** Diseño limpio y fácil de usar.
*   **Editor de Instrucciones:** Área dedicada para escribir las instrucciones específicas de la tarea.
*   **Selector de Archivos Múltiples:** Carga y gestiona fácilmente archivos de texto plano (`.txt`, `.md`, `.js`, `.py`, etc.) desde tu equipo.
*   **Previsualización del Prompt:** Visualiza en tiempo real el prompt final que se está generando.
*   **Estimador de Tokens:** Obtén una estimación de cuántos tokens consumirá tu prompt (basado en la tokenización de GPT).
*   **Copiar y Descargar:** Copia el prompt generado al portapapeles con un clic o descárgalo como archivo `.txt`.
*   **Modo Oscuro/Claro:** Adapta la apariencia a tu preferencia.

## ¿Cómo Usar PromptCrafter?

Usar PromptCrafter es muy sencillo:

1.  **Escribe tus Instrucciones:**
    *   Ve al panel izquierdo, sección "Instrucciones".
    *   Escribe una descripción clara y detallada de la tarea que quieres que el LLM realice con los archivos que proporcionarás.
    *   *Ejemplo:* "Analiza el siguiente código Python y sugiere mejoras de eficiencia."

2.  **Selecciona tus Archivos:**
    *   En el panel izquierdo, busca la sección "Archivos Seleccionados".
    *   Haz clic en "Seleccionar Archivos" o arrastra y suelta los archivos de texto plano que contienen el contexto necesario (código fuente, documentos, notas, etc.).
    *   Puedes seleccionar múltiples archivos.

3.  **Revisa el Prompt Final:**
    *   El panel derecho ("Prompt Final") se actualizará automáticamente.
    *   Mostrará tus instrucciones seguidas del contenido de cada archivo seleccionado, formateado claramente.
    *   Verás una estimación del recuento de tokens en la parte superior del panel derecho.

4.  **Utiliza el Prompt:**
    *   Una vez satisfecho con el prompt generado:
        *   Haz clic en el botón **"Copiar"** para copiarlo al portapapeles y pegarlo directamente en tu LLM favorito (ChatGPT, Claude, Gemini, etc.).
        *   Haz clic en el botón **"Descargar"** para guardarlo como un archivo `.txt` para uso futuro.

## Tecnologías Utilizadas

*   **Frontend:** [React](https://reactjs.org/) con [Vite](https://vitejs.dev/) y [TypeScript](https://www.typescriptlang.org/)
*   **UI:** [Tailwind CSS](https://tailwindcss.com/) y [shadcn/ui](https://ui.shadcn.com/)
*   **Iconos:** [Lucide React](https://lucide.dev/)
*   **Tokenización (Estimación):** Basada en librerías compatibles con GPT.

## Configuración para Desarrollo Local

Si deseas ejecutar PromptCrafter en tu máquina local para desarrollo o uso personal:

1.  **Requisitos Previos:**
    *   [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
    *   [npm](https://www.npmjs.com/) (generalmente viene con Node.js)
    *   [Git](https://git-scm.com/)

2.  **Clona el Repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/promptcrafter.git # Reemplaza con la URL real del repositorio
    cd promptcrafter
    ```

3.  **Instala las Dependencias:**

    ```bash
    npm install
    ```

4.  **Inicia el Servidor de Desarrollo:**

    ```bash
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique la consola).

## Ejecutar con Docker

También puedes ejecutar PromptCrafter usando Docker si lo tienes instalado. Esto evita tener que instalar Node.js localmente.

1.  **Requisitos Previos:**
    *   [Docker](https://www.docker.com/get-started) instalado y ejecutándose.

2.  **Construye la Imagen Docker:**
    Desde la raíz del proyecto, ejecuta:
    ```bash
    docker build -t promptcrafter:local .
    ```

3.  **Ejecuta el Contenedor:**
    ```bash
    # Mapea el puerto 8080 de tu máquina al puerto 80 del contenedor
    docker run -d -p 8080:80 --name promptcrafter-app promptcrafter:local
    ```
    *   `-d`: Ejecuta en segundo plano.
    *   `-p 8080:80`: Mapea el puerto local 8080 al puerto 80 del contenedor (donde Nginx sirve la app). Puedes cambiar el `8080` si ese puerto ya está en uso.
    *   `--name promptcrafter-app`: Asigna un nombre al contenedor.

4.  **Accede a la Aplicación:**
    Abre tu navegador y visita `http://localhost:8080` (o el puerto que hayas elegido).

5.  **Para Detener el Contenedor:**
    ```bash
    docker stop promptcrafter-app
    docker rm promptcrafter-app
    ```

## Contribuciones

¡Este es un proyecto de código abierto y las contribuciones son muy bienvenidas!

Si tienes ideas para nuevas características, mejoras en la interfaz, correcciones de errores o cualquier otra contribución:

1.  **Haz un Fork:** Crea tu propia copia del repositorio.
2.  **Crea una Rama:** `git checkout -b feature/tu-nueva-caracteristica`
3.  **Realiza tus Cambios:** Implementa tu mejora o corrección.
4.  **Haz Commit:** `git commit -am 'Añade nueva característica'`
5.  **Empuja la Rama:** `git push origin feature/tu-nueva-caracteristica`
6.  **Abre un Pull Request:** Describe tus cambios y por qué deberían ser incorporados.

También puedes abrir un *Issue* para discutir ideas o reportar problemas.

## Licencia

PromptCrafter está licenciado bajo la [Licencia MIT](LICENSE).

Eres libre de usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del software, sujeto a las condiciones de la licencia.

---

*Desarrollado con el objetivo de simplificar la creación de prompts.*
