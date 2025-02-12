const getArtistas = () => {
  fetch("http://localhost:3000/artistas")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Ocurrió un error:", error.message);
      throw new Error("Error al cargar los perfiles");
    });
};
getArtistas();
const printArtistas = (artistas) => {
  const list = document.getElementById("artistas");
  list.innerHTML = "";
  artistas.forEach((artista) => {
    const item = document.createElement("li");
    item.textContent = artista.name;
    list.appendChild(item);
  });
};
const artistaId = () => {
  fetch(`http://localhost:3000/artistas/${artistaId}`)
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
const addArtista = () => {
  fetch("http://localhost:3000/addArtista")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error("Error al añadir el artista:", error.message);
      throw new Error("Error al añadir al artista");
    });
};
