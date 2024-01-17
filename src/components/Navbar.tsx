import React from "react";
import "./Navbar.css";

interface NavbarProps {
  setMenuPosition: (position: string) => void;
}

const Navbar = ({ setMenuPosition }: NavbarProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMenuPosition(e.target.value);
    console.log(e.target.value);
  };
  return (
    <div className="navbar">
      <h4>Menu Position:</h4>
      <select name="position" id="position" onChange={handleChange}>
        <option value="top">Top</option>
        <option value="bottom">Bottom</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
      </select>
    </div>
  );
};

export default Navbar;
