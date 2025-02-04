/* eslint-disable no-await-in-loop */
document.getElementById("perfilForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Evita el comportamiento por defecto del formulario

  // Obtener datos del formulario
  const form = event.target;
  const formData = new FormData(form);

  // Crear un objeto con los datos del formulario
  const nuevoArtista = {
    name: formData.get("name"),
    category: formData.get("category"),
    information: formData.get("information"),
    shortInformation: formData.get("shortInformation"),
    links: formData.get("links").split(",").map(link => link.trim()), // Separar los enlaces
  };

  // Manejar subida de archivos (imagen de perfil y galería)
  const profilePhoto = formData.get("profilePhoto");
  const galleryFiles = formData.getAll("gallery");

  try {
    // Subir archivos al servidor si existen
    if (profilePhoto.size > 0) {
      const photoFormData = new FormData();
      photoFormData.append("file", profilePhoto);

      const photoResponse = await fetch("http://localhost:3000/artistas/upload", {
        method: "POST",
        body: photoFormData,
      });

      if (!photoResponse.ok) throw new Error("Error al subir la foto de perfil");

      const { url: photoURL } = await photoResponse.json();
      nuevoArtista.profilePhoto = photoURL;
    }

    if (galleryFiles.length > 0) {
      const galleryURLs = [];

      for (const file of galleryFiles) {
        const galleryFormData = new FormData();
        galleryFormData.append("file", file);

        const galleryResponse = await fetch("http://localhost:3000/addArtista", {
          method: "POST",
          body: galleryFormData,
        });

        if (!galleryResponse.ok) throw new Error("Error al subir un archivo de la galería");

        const { url } = await galleryResponse.json();
        galleryURLs.push(url);
      }

      nuevoArtista.gallery = galleryURLs;
    }

    // Enviar datos del artista al backend
    const response = await fetch("http://localhost:3000/artistas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoArtista),
    });

    if (!response.ok) throw new Error("Error al crear el perfil");

    const data = await response.json();
    console.log("Perfil creado exitosamente:", data);

    // Agregar la tarjeta a la categoría correspondiente en la página
    agregarTarjeta(nuevoArtista, data.perfilURL);

    alert("¡Perfil creado con éxito!");
  } catch (error) {
    console.error("Error:", error);
    alert("Ocurrió un error al crear el perfil. Intenta nuevamente.");
  }
});

// Función para agregar la tarjeta a la categoría correspondiente
function agregarTarjeta(artista, perfilURL) {
  const seccion = document.getElementById(artista.category); // Encuentra la sección correspondiente

  if (seccion) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");

    tarjeta.innerHTML = `
      <img src="${artista.profilePhoto || "default.jpg"}" alt="Imagen de ${artista.name}" class="imagen">
      <div class="nombre-artista">
        <h3>${artista.name}</h3>
      </div>
      <p class="categoria">${artista.category}</p>
      <p>${artista.shortInformation}</p>
      <a href="${perfilURL}">Explora su arte</a>
    `;

    // Insertar la tarjeta en la sección correcta
    seccion.appendChild(tarjeta);
  }
}
