const artistaId = (name) => {
  fetch(`http://localhost:3000/artistas/${name}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error("Error al obtener el artista:", error.message);
      throw new Error("Error al cargar los perfiles");
    });
};
// pintar el artista en concreto
const printArtista = (artista) => {
  const list = document.getElementById("artista");
  list.innerHTML = "";
  artista.forEach((artista) => {
    const item = document.createElement("li");
    item.textContent = artista.name;
    list.appendChild(item);
  });
};
