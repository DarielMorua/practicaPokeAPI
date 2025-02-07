var api = "https://pokeapi.co/api/v2/pokemon/";

function obtenerPokemon(nombre) {
  return fetch(api + nombre)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Introduzca un Pokemon valido");
      }
      return response.json();
    })
    .then((data) => {
      return {
        nombre: data.name,
        peso: data.weight,
        altura: data.height,
        id: data.id,
        tipos: data.types.map((tipo) => tipo.type.name),
      };
    })
    .catch(() => "Introduzca un Pokemon valido");
}

function obtenerVariosPokemons(cantidad, pokedex) {
  if (
    typeof cantidad !== "number" ||
    typeof pokedex !== "number" ||
    cantidad < 1 ||
    pokedex < 0 ||
    pokedex > 151
  ) {
    return "Introduzca un Pokemon valido";
  }

  // ajustar cantidad si se excede el lim de la gen 1
  cantidad = Math.min(cantidad, 20, 151 - pokedex);

  return fetch(api + "?limit=" + cantidad + "&offset=" + pokedex)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Introduzca un Pokemon valido");
      }
      return response.json();
    })
    .then((data) => {
      return data.results.map((pokemon) => pokemon.name);
    })
    .catch(() => "Introduzca un Pokemon valido");
}
module.exports = { obtenerPokemon, obtenerVariosPokemons };
