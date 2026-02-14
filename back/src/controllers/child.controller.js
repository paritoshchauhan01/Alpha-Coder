const { fetchRecipes } = require("../services/recipedb.service");
require("dotenv").config();

exports.getChildProtein = async (req, res, next) => {
  try {
    const { min, max } = req.query;

    const data = await fetchRecipes(
      `${process.env.RECIPE_DB_URL}/recipes`,
      { protein_min: min, protein_max: max }
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};
