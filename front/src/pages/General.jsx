import { useState } from "react";
import API from "../services/api";
import RecipeCard from "../components/RecipeCard";

export default function General() {
  const [recipes, setRecipes] = useState([]);
  const [country, setCountry] = useState("india");

  const fetchCuisine = async () => {
    try {
      const res = await API.get(`/general/cuisine?country=${country}`);
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>General Recipes</h2>

      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <button onClick={fetchCuisine}>Search</button>

      {recipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
    </div>
  );
}
