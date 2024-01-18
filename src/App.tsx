import Navbar from "./components/Navbar";
import Container from "./components/Container";
import { useState } from "react";
import "./App.css";

const App = () => {
  const [menuPosition, setMenuPosition] = useState("top");

  return (
    <div className="app">
      <Navbar setMenuPosition={setMenuPosition} />
      <Container toolTipPos={menuPosition} />
    </div>
  );
};

export default App;
