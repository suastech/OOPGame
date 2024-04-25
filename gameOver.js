fetch('https://api.chucknorris.io/jokes/random')
  .then(response => {

    if (!response.ok) {
      throw new Error('No se pudo obtener la broma de Chuck Norris');
    }

    return response.json();
  })
  .then(data => {
    document.getElementById("joke").textContent = data.value
  })
  .catch(error => {
    // Manejar errores de la solicitud
    console.error('Error al obtener la broma de Chuck Norris:', error);
  });
