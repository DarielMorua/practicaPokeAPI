const axios = require("axios");
const api = "https://pokeapi.co/api/v2/pokemon/";
const express = require("express");
const router = express.Router();

global.global.currentPokemon = null;

async function obtenerPokemon(nombre) {
  try {
    const response = await axios.get(api + nombre);
    return {
      nombre: response.data.name,
      peso: response.data.weight,
      altura: response.data.height,
      id: response.data.id,
      tipos: response.data.types.map((tipo) => tipo.type.name),
    };
  } catch (error) {
    return "Introduzca un Pokemon valido";
  }
}

async function obtenerVariosPokemons(cantidad, pokedex) {
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

  try {
    const response = await axios.get(
      `${api}?limit=${cantidad}&offset=${pokedex}`
    );
    return response.data.results.map((pokemon) => pokemon.name);
  } catch (error) {
    return "Introduzca un Pokemon valido";
  }
}
/*
async function adivinarPokemon(req, res) {
  try {
    const { nombre, evolucion, tipo } = req.body;

    const pokemon = await getRandomPoke();

    const usuario = {
      nombre: nombre.toLowerCase(),
      evo: evolucion ? evolucion.toLowerCase() : null,
      tipo: tipo.toLowerCase(),
    };

    if (
      usuario.nombre === pokemon.nombre ||
      usuario.evo === pokemon.evo ||
      [pokemon.tipo1, pokemon.tipo2].includes(usuario.tipo)
    ) {
      return res.status(200).json({ message: "Omg lo adivinaste :o" });
    } else {
      return res
        .status(200)
        .json({ message: "No lo adivinaste :(, era:" + pokemon.nombre });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
}
 */
async function adivinarPokemon(req, res) {
  try {
    if (!global.currentPokemon) {
      return res
        .status(400)
        .json({ message: "Primero debes obtener un Pokémon" });
    }

    const { numero, nombre, evolucion, tipo } = req.body;

    const usuario = {
      numero: numero,
      nombre: nombre ? nombre.toLowerCase() : null,
      evo: evolucion ? evolucion.toLowerCase() : null,
      tipo: tipo ? tipo.toLowerCase() : null,
    };
    if (
      (usuario.numero && usuario.numero === global.currentPokemon.numero) ||
      (usuario.nombre && usuario.nombre === global.currentPokemon.nombre) ||
      (usuario.evo && usuario.evo === global.currentPokemon.evo) ||
      (usuario.tipo &&
        [global.currentPokemon.tipo1, global.currentPokemon.tipo2].includes(
          usuario.tipo
        ))
    ) {
      return res.status(200).json({ message: "Omg lo adivinaste :o" });
    } else {
      return res.status(200).json({
        message: "No lo adivinaste :(, era: " + global.currentPokemon.nombre,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

async function mostrarSprite(req, res) {
  try {
    global.currentPokemon = await getRandomPoke();
    return res.status(200).json({ sprite: global.currentPokemon.sprite });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener el Pokémon" });
  }
}

async function getRandomPoke() {
  try {
    var random = Math.floor(Math.random() * 151) + 1;
    const response = await axios.get(api + random);
    const evoResponse = await axios.get(
      `https://pokeapi.co/api/v2/evolution-chain/${random}`
    );

    let evo = null;
    if (evoResponse.data.chain.evolves_to.length > 0) {
      evo = evoResponse.data.chain.evolves_to[0]?.species?.name || null;
    }
    return {
      numero: random,
      sprite: response.data.sprites.front_default,
      nombre: response.data.name,
      evo: evo || null,
      tipo1: response.data.types[0].type.name,
      tipo2: response.data.types[1]?.type.name || null,
    };
  } catch (error) {
    console.log("Error", error);
    return "Introduzca un Pokemon valido";
  }
}
module.exports = {
  obtenerPokemon,
  obtenerVariosPokemons,
  adivinarPokemon,
  getRandomPoke,
  mostrarSprite,
};
