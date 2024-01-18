import React, { useState, useEffect, MouseEvent } from "react";
import ReactDOM from "react-dom";
import { MdDragIndicator } from "react-icons/md";

const Tooltip: React.FC<{
  pos: { x: number; y: number };
  toolTipPos: string;
  containerRef: React.RefObject<HTMLDivElement>;
}> = ({ pos, toolTipPos, containerRef }) => {
  let style: React.CSSProperties = {
    position: "absolute",
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
        top: `${pos.y - 40}px`,
        left: `${pos.x + 20}px`,
      };
      if (pos.y < 40) {
        style = {
          ...style,
          top: `${pos.y + 110}px`,
        };
      }
      break;

    case "bottom":
      style = {
        ...style,
        top: `${pos.y + 110}px`,
        left: `${pos.x + 20}px`,
      };
      if (pos.y > 460) {
        style = {
          ...style,
          top: `${pos.y - 40}px`,
        };
      }
      break;

    case "left":
      style = {
        ...style,
        top: `${pos.y + 35}px`,
        left: `${pos.x - 70}px`,
      };
      if (pos.x < 70) {
        style = {
          ...style,
          left: `${pos.x + 110}px`,
        };
      }
      break;

    case "right":
      style = {
        ...style,
        top: `${pos.y + 35}px`,
        left: `${pos.x + 110}px`,
      };
      if (pos.x > 430) {
        style = {
          ...style,
          left: `${pos.x - 70}px`,
        };
      }
      break;
  }

  return containerRef.current
    ? ReactDOM.createPortal(
        <div style={style}>Hello!</div>,
        containerRef.current
      )
    : null;
};

const Container: React.FC<{ toolTipPos: string }> = ({ toolTipPos }) => {
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 250, y: 250 });
  const [rel, setRel] = useState<{ x: number; y: number } | null>(null);
  const [hovering, setHovering] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [containerPos, setContainerPos] = useState({ x: 420, y: 80 });
  const [containerRel, setContainerRel] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [containerDragging, setContainerDragging] = useState(false);

  const onContainerMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    var posX = e.clientX - containerPos.x;
    var posY = e.clientY - containerPos.y;
    setContainerDragging(true);
    setContainerRel({ x: posX, y: posY });
    e.stopPropagation();
    e.preventDefault();
  };

  const onContainerMouseMove = (e: globalThis.MouseEvent) => {
    if (!containerDragging || !containerRel) return;
    let newX = e.clientX - containerRel.x;
    let newY = e.clientY - containerRel.y;
    setContainerPos({
      x: newX,
      y: newY,
    });
    e.stopPropagation();
    e.preventDefault();
  };

  const onContainerMouseUp = (e: globalThis.MouseEvent) => {
    setContainerDragging(false);
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener("mousemove", onContainerMouseMove);
    document.addEventListener("mouseup", onContainerMouseUp);

    return () => {
      document.removeEventListener("mousemove", onContainerMouseMove);
      document.removeEventListener("mouseup", onContainerMouseUp);
    };
  }, [containerDragging, onContainerMouseMove, onContainerMouseUp]);

  const onMouseEnter = () => {
    setHovering(true);
  };

  const onMouseLeave = () => {
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
      ref={containerRef}
      style={{
        height: "600px",
        width: "600px",
        border: "1px solid orangered",
        position: "absolute",
        borderRadius: "10px",
        left: `${containerPos.x}px`,
        top: `${containerPos.y}px`,
      }}
    >
      <div
        onMouseDown={onContainerMouseDown}
        style={{
          height: "25px",
          width: "25px",
          border: "solid 1px orangered",
          cursor: "move",
          borderRadius: "5px",
          left: "95%",
          top: "0.5%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <MdDragIndicator style={{ scale: "1.5", color: "orange" }} />
      </div>
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
      {hovering && !dragging && (
        <Tooltip
          pos={pos}
          toolTipPos={toolTipPos}
          containerRef={containerRef}
        />
      )}
    </div>
  );
};

export default Container;
