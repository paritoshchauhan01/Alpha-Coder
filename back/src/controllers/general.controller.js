const { fetchRecipes } = require("../services/recipedb.service");
const { fetchFlavorData } = require("../services/flavordb.service");
require("dotenv").config();

exports.getByCuisine = async (req, res, next) => {
  try {
    const { country } = req.query;

    const data = await fetchRecipes(
      `${process.env.RECIPE_DB_URL}/recipes`,
      { cuisine: country }
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getByFlavor = async (req, res, next) => {
  try {
    const { ingredient } = req.query;

    const data = await fetchFlavorData(
      `${process.env.FLAVOR_DB_URL}/flavors`,
      { ingredient }
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};
