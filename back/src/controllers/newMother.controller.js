const { fetchRecipes } = require("../services/recipedb.service");
require("dotenv").config();

exports.getByProtein = async (req, res, next) => {
  try {
    const { min } = req.query;

    const data = await fetchRecipes(
      `${process.env.RECIPE_DB_URL}/recipes`,
      { protein_min: min }
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getByCalories = async (req, res, next) => {
  try {
    const { min, max } = req.query;

    const data = await fetchRecipes(
      `${process.env.RECIPE_DB_URL}/recipes`,
      { calorie_min: min, calorie_max: max }
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};
