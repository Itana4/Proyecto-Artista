// Obtener la lista de artistas desde el backend
fetch("http://localhost:3000/artistas")
  .then(response => response.json())
  .then(data => {
    console.log(data); // Aquí puedes procesar y mostrar los datos de los artistas
  })
  .catch(error => {
    console.error("Error al obtener los artistas:", error);
  });

// Obtener los detalles de un artista específico (por ejemplo, con ID 1)
const artistaId = ""; // Cambia este valor según el artista que quieras obtener
fetch(`http://localhost:3000/artistas/${artistaId}`)
  .then(response => response.json())
  .then(data => {
    console.log(data); // Aquí puedes procesar los detalles del artista
  })
  .catch(error => {
    console.error("Error al obtener el artista:", error);
  });

const nuevoArtista = {
  id: "7",
  name: "Nuevo Artista",
  category: "Pintor",
  profilePhoto: "imgNuevoArtista.jpg",
  information: "Información detallada sobre el nuevo artista",
  shortInformation: "Breve descripción del nuevo artista",
  gallery: ["imgNuevoArtista1.jpg", "imgNuevoArtista2.jpg"],
  links: ["https://instagram.com/nuevoartista"]
};

// Enviar los datos del nuevo artista al backend
fetch("http://localhost:3000/addArtista", {
  method: "PUT", //
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(nuevoArtista) // Convertir el objeto a JSON
})
  .then(response => response.json())
  .then(data => {
    console.log(data.message); // Mensaje de éxito, "Artista añadido con éxito"
  })
  .catch(error => {
    console.error("Error al añadir el artista:", error);
  });
