import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import NewMother from "./pages/NewMother";
import General from "./pages/General";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/new-mother" element={<NewMother />} />
        <Route path="/general" element={<General />} />
      </Routes>
    </Router>
  );
}

export default App;
