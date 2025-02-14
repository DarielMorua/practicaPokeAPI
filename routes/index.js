var express = require("express");
var router = express.Router();
const pokemonController = require("../controllers/pokemonController");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/jugar", pokemonController.adivinarPokemon);
router.get("/inicio", pokemonController.mostrarSprite);

module.exports = router;
