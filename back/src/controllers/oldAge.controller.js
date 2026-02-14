const { fetchRecipes } = require("../services/recipedb.service");
require("dotenv").config();

exports.getOldAgeProtein = async (req, res, next) => {
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
