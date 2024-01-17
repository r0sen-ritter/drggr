import React, { useState, useEffect, MouseEvent } from "react";

const Container: React.FC = () => {
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rel, setRel] = useState<{ x: number; y: number } | null>(null);

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
      }}
    >
      <div
        onMouseDown={onMouseDown}
        style={{
          height: "100px",
          width: "100px",
          backgroundColor: "blanchedalmond",
          position: "absolute",
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          cursor: "move",
        }}
      ></div>
    </div>
  );
};

export default Container;
