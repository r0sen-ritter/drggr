import React from "react";
import Navbar from "./components/Navbar";
import Container from "./components/Container";
import { useState } from "react";
import "./App.css";

const App = () => {
  const [menuPosition, setMenuPosition] = useState("top");
  const [show, setShow] = useState(false);

  return (
    <div className="app">
      <Navbar setMenuPosition={setMenuPosition} />
      <Container />
    </div>
  );
};

export default App;
