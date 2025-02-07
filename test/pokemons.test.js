const {
  obtenerPokemon,
  obtenerVariosPokemons,
} = require("../controllers/pokemonController");

describe("Pruebas unitarias", () => {
  describe("Obtener Pokemons por nombre", () => {
    it("Deberia retornar un objeto con los datos del pokemon", async () => {
      const pokemon = await obtenerPokemon("gengar");
      expect(pokemon).toEqual({
        nombre: "gengar",
        peso: 405,
        altura: 15,
        id: 94,
        tipos: ["ghost", "poison"],
      });
    });
    it("Deberia retornar un mensaje de error si el pokemon no existe", async () => {
      const pokemon = await obtenerPokemon("genaro");
      expect(pokemon).toBe("Introduzca un Pokemon valido");
    });
  });
  describe("Obtener Pokemons por número de la Pokedex", () => {
    it("Deberia retornar un objeto con los datos del pokemon", async () => {
      const pokemon = await obtenerPokemon(94);
      expect(pokemon).toEqual({
        nombre: "gengar",
        peso: 405,
        altura: 15,
        id: 94,
        tipos: ["ghost", "poison"],
      });
    });
    it("Deberia retornar un mensaje de error si el pokemon no existe", async () => {
      const pokemon = await obtenerPokemon(9000);
      expect(pokemon).toBe("Introduzca un Pokemon valido");
    });
  });
  describe("Obtener varios Pokemons", () => {
    it("Deberia retornar un array con los nombres de los pokemons", async () => {
      const pokemons = await obtenerVariosPokemons(5, 0);
      expect(pokemons).toEqual([
        "bulbasaur",
        "ivysaur",
        "venusaur",
        "charmander",
        "charmeleon",
      ]);
    });
    it("Deberia retornar un mensaje de error si la pokedex no existe", async () => {
      const pokemons = await obtenerVariosPokemons(5, 10000);
      expect(pokemons).toBe("Introduzca un Pokemon valido");
    });
  });
});
