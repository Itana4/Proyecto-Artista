function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
document.getElementById("perfilForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Evita el comportamiento por defecto del formulario

  const form = event.target;
  const formData = new FormData(form);

  // Crear un objeto con los datos del formulario (sin los archivos aún)
  const nuevoArtista = {
    name: formData.get("name"),
    category: formData.get("category"),
    information: formData.get("information"),
    shortInformation: formData.get("shortInformation"),
    links: formData.get("links").split(",").map(link => link.trim()), // Separar los enlaces por comas
  };
  // Función para convertir una imagen a Base64

  const profilePhoto = document.getElementById("profilePhoto"); // Input de imagen
  // Manejo de la imagen (conversión a Base64)
  let imagen = "";
  if (profilePhoto.files.length > 0) {
    const file = fileInput.files[0];
    imagen = await convertToBase64(file); // Convertimos la imagen a Base64
  }
  try {
    // Subir la imagen de perfil, si existe
    const profilePhoto = formData.get("profilePhoto");
    if (profilePhoto && profilePhoto.size > 0) {
      const photoFormData = new FormData();
      photoFormData.append("file", profilePhoto);

      const photoResponse = await fetch("http://localhost:3000/artistas/upload", {
        method: "POST",
        body: photoFormData,
      });

      if (!photoResponse.ok) throw new Error("Error al subir la foto de perfil");

      const { filePath } = await photoResponse.json(); // Asegúrate de que el backend devuelve 'filePath'
      nuevoArtista.profilePhoto = filePath;
    }

    // Enviar los archivos de galería, si existen
    const galleryFiles = formData.getAll("gallery");
    if (galleryFiles.length > 0) {
      const galleryUploads = galleryFiles.map(async (file) => {
        const galleryFormData = new FormData();
        galleryFormData.append("file", file);

        const galleryResponse = await fetch("http://localhost:3000/artistas/upload", {
          method: "POST",
          body: galleryFormData,
        });

        if (!galleryResponse.ok) throw new Error("Error al subir un archivo de la galería");

        const { filePath } = await galleryResponse.json();
        return filePath;
      });

      // Esperar a que todas las promesas se resuelvan en paralelo
      nuevoArtista.gallery = await Promise.all(galleryUploads);
    }

    // Ahora usar FormData para enviar todos los datos, incluidos los archivos
    const perfilFormData = new FormData();
    perfilFormData.append("name", nuevoArtista.name);
    perfilFormData.append("category", nuevoArtista.category);
    perfilFormData.append("information", nuevoArtista.information);
    perfilFormData.append("shortInformation", nuevoArtista.shortInformation);
    perfilFormData.append("links", JSON.stringify(nuevoArtista.links)); // Enviar los enlaces como una cadena JSON

    if (nuevoArtista.profilePhoto) {
      perfilFormData.append("profilePhoto", nuevoArtista.profilePhoto); // Agregar la URL de la foto de perfil
    }

    if (nuevoArtista.gallery) {
      nuevoArtista.gallery.forEach(url => {
        perfilFormData.append("gallery", url); // Enviar galería como array
      });
    }

    // Enviar los datos del artista al backend usando FormData
    const response = await fetch("http://localhost:3000/artistas", {
      method: "POST",
      body: perfilFormData, // Usar FormData aquí
    });

    if (!response.ok) throw new Error("Error al crear el perfil");

    const data = await response.json();
    console.log("Perfil creado exitosamente:", data);

    // Agregar la tarjeta a la categoría correspondiente en la página
    agregarTarjeta(nuevoArtista, data.perfilURL);

    alert("¡Perfil creado con éxito!");
    // Redirigir al perfil creado
    window.location.href = data.perfilURL;
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
