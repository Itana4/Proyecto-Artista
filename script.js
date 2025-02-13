document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("perfilForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que se recargue la pag del formulario

    // Recoger los datos del formulario
    const name = form.name.value;
    const category = form.category.value;
    const profilePhoto = form.profilePhoto.value;
    const information = form.information.value;
    const shortInformation = form.shortInformation.value;
    const gallery = form.gallery.value.split(","); // las fotos de galería están separadas por comas
    const links = form.links.value.split(","); // los enlaces están separados por comas

    // Enviar los datos al backend para guardar el artista
    fetch("http://localhost:3000/addArtista", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        category,
        profilePhoto,
        information,
        shortInformation,
        gallery,
        links,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Artista añadido con éxito") {
          alert("Artista creado con éxito");
          // se agrega la tarjeta a la categoría correspondiente en categorias.html
          createArtistCard({
            name,
            category,
            profilePhoto,
            shortInformation
          });
        }
      })
      .catch((error) => {
        console.error("Error al enviar el formulario:", error);
        alert("Hubo un problema al crear el artista");
      });
  });
});

// Función para crear la tarjeta en la página de categorías
function createArtistCard(artist) {
  // Crear los elementos de la tarjeta
  const artistCard = document.createElement("div");
  artistCard.classList.add("tarjeta");

  artistCard.innerHTML = `
      <img src="${artist.profilePhoto}" alt="${artist.name}" class="artist-card-img">
      <h3>${artist.name}</h3>
      <p><strong>Categoría:</strong> ${artist.category}</p>
      <p><strong>Descripción:</strong> ${artist.shortInformation}</p>
      <a href="/perfil/${artist.name}" class="explore-btn">Explora su arte</a>
  `;
  // Agregar la tarjeta al contenedor de la categoría correspondiente
  const categorySection = document.querySelector(`#${artist.category} .tarjetas`);// Busca la categoria a la que pertenece y la agrega
  if (categorySection) {
    categorySection.appendChild(artistCard);
  } else {
    console.error("Contenedor de categoría no encontrado");
  }
}
