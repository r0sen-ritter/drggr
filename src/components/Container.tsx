import React, { useState, useEffect, MouseEvent } from "react";
import ReactDOM from "react-dom";

const Tooltip: React.FC<{ pos: { x: number; y: number } }> = ({ pos }) => {
  let style = {
    position: "fixed",
    top: `${pos.y + 45}px`,
    left: `${pos.x + 440}px`,
    backgroundColor: "lightgray",
    padding: "5px",
    borderRadius: "5px",
    width: "50px",
    height: "20px",
  };

  if (pos.y < 35) {
    style = {
      ...style,
      top: `${pos.y + 190}px`,
    };
  } else if (pos.y + 440 + 20 > 600) {
    style = {
      ...style,
      top: `${pos.y + 190}px`,
    };
  }

  return ReactDOM.createPortal(<div style={style}>Tooltip</div>, document.body);
};

const Container: React.FC = () => {
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rel, setRel] = useState<{ x: number; y: number } | null>(null);
  const [toolTipPos, setToolTipPos] = useState("top");
  const [hovering, setHovering] = useState(false);

  const onMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    setHovering(true);
  };

  const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    setHovering(false);
  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    var posX = e.clientX - pos.x;
    var posY = e.clientY - pos.y;
    setDragging(true);
    setRel({ x: posX, y: posY });
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseMove = (e: globalThis.MouseEvent) => {
    if (!dragging || !rel) return;
    let newX = e.clientX - rel.x;
    let newY = e.clientY - rel.y;
    newX = Math.max(0, Math.min(600 - 100, newX));
    newY = Math.max(0, Math.min(600 - 100, newY));
    setPos({
      x: newX,
      y: newY,
    });
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseUp = (e: globalThis.MouseEvent) => {
    setDragging(false);
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

  return (
    <div
      style={{
        height: "600px",
        width: "600px",
        border: "2px solid blanchedalmond",
        position: "relative",
        borderRadius: "10px",
      }}
    >
      <div
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          height: "100px",
          width: "100px",
          backgroundColor: "blanchedalmond",
          borderRadius: "5px",
          position: "absolute",
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          cursor: "move",
        }}
      >
        item
      </div>
      {hovering && !dragging && <Tooltip pos={pos} />}
    </div>
  );
};

export default Container;
