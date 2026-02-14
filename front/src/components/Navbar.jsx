import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2>Alpha Coder</h2>
      <div>
        <Link to="/new-mother">New Mother</Link>
        <Link to="/child">Child</Link>
        <Link to="/general">General</Link>
        <Link to="/old-age">Old Age</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    background: "#2c3e50",
    color: "white",
  },
};
