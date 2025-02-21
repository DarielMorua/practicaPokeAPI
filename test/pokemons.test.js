const {
  obtenerPokemon,
  obtenerVariosPokemons,
  adivinarPokemon,
  getRandomPoke,
  mostrarSprite,
} = require("../controllers/pokemonController");
const request = require("supertest");
const app = require("../app");
global.currentPokemon = {
  nombre: "pikachu",
  evo: "raichu",
  tipo1: "electric",
  tipo2: "",
};
describe("Pruebas unitarias", () => {
  describe.skip("Obtener Pokemons por nombre", () => {
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
  describe.skip("Obtener Pokemons por número de la Pokedex", () => {
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
  describe.skip("Obtener varios Pokemons", () => {
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
  describe("Adivinar Pokemon", () => {
    it("Debería retornar un mensaje de error si el usuario no adivina", async () => {
      global.currentPokemon = {
        numero: 25,
        nombre: "pikachu",
        evo: "raichu",
        tipo1: "electric",
        tipo2: "",
      };

      const res = await request(app).post("/jugar").send({
        numero: 23,
        nombre: "genaro",
        evolucion: "genarote",
        tipo: "hada",
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("No lo adivinaste :(, era: pikachu");
    });

    it("Debe retornar un error si no hay un Pokémon seleccionado", async () => {
      global.currentPokemon = "";
      const res = await request(app).post("/jugar").send({
        numero: 25,
        nombre: "pikachu",
        evolucion: "raichu",
        tipo: "electric",
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Primero debes obtener un Pokémon");
    });

    it("Debe retornar éxito si se adivina el nombre", async () => {
      global.currentPokemon = {
        numero: 25,
        nombre: "pikachu",
        evo: "raichu",
        tipo1: "electric",
        tipo2: "",
      };

      const res = await request(app).post("/jugar").send({
        numero: 25,
        nombre: "pikachu",
        evolucion: "",
        tipo: "",
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Omg lo adivinaste :o");
    });

    it("Debe retornar éxito si se adivina la evolución", async () => {
      global.currentPokemon = {
        numero: 25,
        nombre: "pikachu",
        evo: "raichu",
        tipo1: "electric",
        tipo2: "",
      };

      const res = await request(app).post("/jugar").send({
        numero: 25,
        nombre: "",
        evolucion: "raichu",
        tipo: "",
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Omg lo adivinaste :o");
    });

    it("Debe retornar éxito si se adivina el tipo", async () => {
      global.currentPokemon = {
        nombre: "pikachu",
        evo: "raichu",
        tipo1: "electric",
        tipo2: "",
      };

      const res = await request(app).post("/jugar").send({
        numero: 25,
        nombre: "",
        evolucion: "",
        tipo: "electric",
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Omg lo adivinaste :o");
    });

    it("Debe retornar error si la adivinanza es incorrecta", async () => {
      global.currentPokemon = {
        numero: 25,
        nombre: "pikachu",
        evo: "raichu",
        tipo1: "electric",
        tipo2: "",
      };

      const res = await request(app).post("/jugar").send({
        numero: 94,
        nombre: "charizard",
        evolucion: "venusaur",
        tipo: "fire",
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("No lo adivinaste :(, era: pikachu");
    });
  });
});
