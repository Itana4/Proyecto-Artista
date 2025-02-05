const getArtistas = () => fetch("http://localhost:3000/artistas");
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
