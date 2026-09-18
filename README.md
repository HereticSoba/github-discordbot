# 🚀 GitHub a Discord - Bot de Notificaciones

Bot diseñado como una **Serverless Function** alojada en **Vercel**, que escucha eventos en tiempo real mediante **GitHub Webhooks** (`push` e `issues`) y publica notificaciones formateadas directamente en un canal de **Discord**.

---

## 🛠️ Tecnologías Utilizadas

- Node.js
- Vercel Serverless Functions
- Axios
- GitHub Webhooks API
- Discord Webhooks API

---

## ⚡ Funciones

1. **Push (`push`):** Detecta cuando se suben nuevos commits a cualquier rama, indicando el usuario, la cantidad de commits y el enlace a la diferencia (`compare URL`).
2. **Issues (`issues`):** Notifica cuando se abre, edita o cierra un issue, indicando el título, el autor y el enlace directo.
3. **Ping (`ping`):** Responde con éxito a la prueba de conexión inicial de GitHub.

---

## 🔧 Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/HereticSoba/github-discordbot.git
   cd github-discordbot
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
Crea un archivo .env.local en la raíz con la URL de tu Webhook de Discord:
   ```bash
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/TU_WEBHOOK
   ```

---

## 🌐 Despliegue en Vercel
- Importa el repositorio en Vercel.
- Configura la Variable de entorno DISCORD_WEBHOOK_URL en el panel de Vercel.
- Copia la URL pública entregada por Vercel y agrégala en la configuración de Webhooks de tu repositorio de GitHub:
  
  ```bash
   https://tu-proyecto.vercel.app/api/github-webhook
   ```

---

<div align="center">
  <p>👨‍💻 Autor: <b>HereticSoba</b></p>
  <p>
    <a href="https://www.linkedin.com/in/its-diego-solorzano/">LinkedIn</a> • 
    <a href="https://diego-portfolio-one.vercel.app/">Portfolio</a>
  </p>
</div>
