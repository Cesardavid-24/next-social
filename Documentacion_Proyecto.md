# Documentación del Proyecto: Red Social (Soci-Start)

Este documento contiene un resumen de la estructura, archivos y funciones principales del proyecto, diseñado para ser explicado de forma clara y sencilla en una presentación estudiantil.

## 1. Visión General y Tecnologías 🚀
El proyecto es una aplicación web tipo **Red Social** (aparentemente enfocada al entorno universitario, con menciones a "UNEFA"). 

Está construida utilizando las siguientes tecnologías modernas:
- **Next.js (App Router):** El framework principal de React para construir la interfaz y manejar las rutas de las páginas.
- **Prisma (ORM):** Herramienta para comunicarse con la base de datos de manera sencilla usando código en lugar de consultas SQL manuales.
- **Clerk:** Servicio externo utilizado para manejar la autenticación (registro e inicio de sesión de los usuarios).
- **Tailwind CSS:** Para dar estilos y diseño a la aplicación de forma rápida.
- **Zod:** Para validar los datos (por ejemplo, comprobar que un texto no sea demasiado largo).

---

## 2. Estructura Principal de Carpetas 📁

El código fuente está organizado principalmente en la carpeta `src/` (código fuente) y `prisma/` (base de datos).

### Directorio `prisma/`
- **`schema.prisma`**: Es el corazón de la base de datos. Aquí se definen todas las "tablas" (llamadas modelos) que guardan la información de la aplicación, como los usuarios, las publicaciones, los "me gusta", los comentarios, mensajes y encuestas.

### Directorio `src/app/`
Aquí se manejan las "páginas" o pantallas que ve el usuario en su navegador. Cada subcarpeta representa una URL en la aplicación (ej. `/profile`, `/messages`).
- **`/profile`**: Pantalla del perfil del usuario.
- **`/messages`**: Pantalla para el chat privado entre usuarios.
- **`/settings`**: Pantalla de configuración de la cuenta.
- **`/red-unefa` / `/info-unefa`**: Secciones específicas para grupos o información de la universidad.
- **`/sign-in` & `/sign-up`**: Páginas para iniciar sesión y registrarse.
- **`layout.tsx`**: Es la plantilla base o "esqueleto" visual que comparten todas las páginas (por ejemplo, donde va la barra de navegación general).
- **`page.tsx`**: Es la página principal (el inicio o "feed" de la red social).

### Directorio `src/components/`
Contiene "bloques de construcción" visuales reutilizables. En lugar de escribir el mismo código muchas veces, se crea un componente y se usa donde se necesite.
- **`Navbar...`**: Componentes para la barra de navegación superior (notificaciones, historias, mensajes).
- **`AddPost.tsx`**: El cuadro de texto donde el usuario escribe una nueva publicación.
- **`ChatBox.tsx`**: La interfaz de chat para enviar mensajes a otros usuarios.
- **`StoryList.tsx` / `Stories.tsx`**: Componentes para ver las historias de los usuarios al estilo Instagram.
- **`SearchBar.tsx`**: La barra para buscar a otras personas.
- Carpetas como `feed`, `leftMenu`, `rightMenu`: Organizan la pantalla principal en diferentes columnas.

### Directorio `src/lib/`
Aquí se guarda la lógica "pesada" de la aplicación, las funciones que interactúan con el servidor y la base de datos.
- **`client.ts`**: Simplemente conecta la aplicación con la base de datos usando Prisma.
- **`actions.ts`**: Es uno de los archivos más importantes. Contiene **"Server Actions"** (Acciones del Servidor). Son funciones que modifican los datos.

---

## 3. Funcionalidades Principales (Lógica en `actions.ts`) ⚙️

El archivo `actions.ts` contiene las funciones que hacen que la red social tenga vida. Las más destacadas para mencionar son:

*   **`ensureUserExists`**: Se asegura de que cuando un usuario entra, su perfil esté creado en la base de datos.
*   **Gestión de Seguidores**: Funciones como `switchFollow`, `acceptFollowRequest` y `declineFollowRequest` manejan quién sigue a quién.
*   **Publicaciones y Reacciones**: 
    *   `addPost`: Guarda una nueva publicación (con texto, imagen o encuestas).
    *   `deletePost`: Borra una publicación.
    *   `switchLike`: Pone o quita un "me gusta".
    *   `addComment`: Añade un comentario a un post.
*   **Encuestas**: `votePoll` registra qué opción eligió un usuario en una encuesta.
*   **Mensajería Privada**: `sendMessage`, `getMessages` y `getConversations` permiten chatear en privado con otros estudiantes y ver la lista de chats activos.
*   **Búsqueda Inteligente**: `searchUsers` usa un algoritmo para buscar usuarios por su nombre de forma precisa.

---

## 4. Base de Datos (Modelos en Prisma) 🗄️

Para explicar cómo se guarda la información, se pueden mencionar las "Tablas" (Modelos) principales:
1.  **`User`**: Guarda el nombre, foto, universidad, biografía, etc.
2.  **`Post` & `Comment`**: Guardan las publicaciones del muro y las respuestas de la gente.
3.  **`Like`**: Relaciona a un usuario con un Post para saber a quién le gustó.
4.  **`Story`**: Guarda las imágenes temporales de las historias.
5.  **`Message`**: Guarda el texto enviado entre un remitente y un destinatario.
6.  **`Poll` & `PollVote`**: Para crear encuestas en los posts y guardar los votos.

---
*Fin del resumen.*
