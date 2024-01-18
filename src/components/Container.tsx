import React, { useState, useEffect, MouseEvent } from "react";
import ReactDOM from "react-dom";

const Tooltip: React.FC<{
  pos: { x: number; y: number };
  toolTipPos: string;
}> = ({ pos, toolTipPos }) => {
  let style: React.CSSProperties = {
    position: "fixed",
    backgroundColor: "black",
    color: "orange",
    padding: "5px",
    borderRadius: "5px",
    width: "50px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
  };

  switch (toolTipPos) {
    case "top":
      style = {
        ...style,
        top: `${pos.y + 45}px`,
        left: `${pos.x + 440}px`,
      };
      if (pos.y < 35) {
        style = {
          ...style,
          top: `${pos.y + 190}px`,
        };
      }
      break;

    case "bottom":
      style = {
        ...style,
        top: `${pos.y + 190}px`,
        left: `${pos.x + 440}px`,
      };
      if (pos.y > 460) {
        style = {
          ...style,
          top: `${pos.y + 45}px`,
        };
      }
      break;

    case "left":
      style = {
        ...style,
        top: `${pos.y + 120}px`,
        left: `${pos.x + 355}px`,
      };
      if (pos.x < 65) {
        style = {
          ...style,
          left: `${pos.x + 525}px`,
        };
      }
      break;

    case "right":
      style = {
        ...style,
        top: `${pos.y + 120}px`,
        left: `${pos.x + 525}px`,
      };
      if (pos.x > 435) {
        style = {
          ...style,
          left: `${pos.x + 355}px`,
        };
      }
      break;
  }

  return ReactDOM.createPortal(<div style={style}>Hello!</div>, document.body);
};

const Container: React.FC<{ toolTipPos: string }> = ({ toolTipPos }) => {
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rel, setRel] = useState<{ x: number; y: number } | null>(null);
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
        border: "1px solid orangered",
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
          backgroundColor: "orangered",

          borderRadius: "5px",
          position: "absolute",
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          cursor: "move",
        }}
      ></div>
      {hovering && !dragging && <Tooltip pos={pos} toolTipPos={toolTipPos} />}
    </div>
  );
};

export default Container;
