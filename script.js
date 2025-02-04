document.getElementById("perfilForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Evita el comportamiento por defecto

  // Obtener datos del formulario
  const nombre = document.getElementById("nombre").value;
  const categoria = document.getElementById("categoria").value;
  const descripcion = document.getElementById("descripcion").value;
  const imagen = document.getElementById("imagen").value;
  const instagram = document.getElementById("instagram").value;
  const spotify = document.getElementById("spotify").value;

  // Crear objeto con los datos
  const nuevoArtista = {
    nombre,
    categoria,
    descripcion,
    imagen,
    instagram,
    spotify
  };

  try {
    // Enviar datos al backend
    const response = await fetch("http://localhost:3000/artistas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoArtista)
    });

    if (!response.ok) throw new Error("Error al crear el perfil");

    const data = await response.json();
    console.log("Perfil creado:", data);

    // Agregar tarjeta a la categoría correspondiente
    agregarTarjeta(nuevoArtista, data.perfilURL);
  } catch (error) {
    console.error("Error:", error);
  }
});

// Función para agregar la tarjeta a la categoría correcta
function agregarTarjeta(artista, perfilURL) {
  const seccion = document.getElementById(artista.categoria); // Encuentra la sección correcta

  if (seccion) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");

    tarjeta.innerHTML = `
            <img src="${artista.imagen}" alt="Imagen de ${artista.nombre}" class="imagen">
            <div class="nombre-artista">
                <h3>${artista.nombre}</h3>
            </div>
            <p class="categoria">${artista.categoria}</p>
            <p>${artista.descripcion}</p>
            <a href="${perfilURL}">Explora su arte</a>
        `;

    // Insertar la tarjeta en la categoría correspondiente
    seccion.appendChild(tarjeta);
  }
}
