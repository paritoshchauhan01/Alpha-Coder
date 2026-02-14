export default function RecipeCard({ recipe }) {
  return (
    <div style={styles.card}>
      <h3>{recipe.name}</h3>
      <p>Calories: {recipe.calories}</p>
      <p>Protein: {recipe.protein}</p>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    margin: "10px",
    borderRadius: "8px",
  },
};
