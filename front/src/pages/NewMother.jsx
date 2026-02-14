import { useState } from "react";
import API from "../services/api";
import RecipeCard from "../components/RecipeCard";

export default function NewMother() {
  const [recipes, setRecipes] = useState([]);
  const [protein, setProtein] = useState(25);

  const fetchRecipes = async () => {
    try {
      const res = await API.get(`/new-mother/protein?min=${protein}`);
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>New Mother Recipes</h2>

      <input
        type="number"
        value={protein}
        onChange={(e) => setProtein(e.target.value)}
      />
      <button onClick={fetchRecipes}>Search</button>

      <div>
        {recipes.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
