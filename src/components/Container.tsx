import React, { useState, useEffect, MouseEvent } from "react";
import Tooltip from "./Tooltip";
import { MdDragIndicator } from "react-icons/md";
import "./Container.css";

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

  const [resizing, setResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState("");
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });

  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHeight, setContainerHeight] = useState(600);

  const onResizeMouseDown = (handle: string, e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setResizing(true);
    setResizeHandle(handle);
    setInitialMousePos({ x: e.clientX, y: e.clientY });
    setContainerWidth(containerRef.current?.offsetWidth || 0);
    setContainerHeight(containerRef.current?.offsetHeight || 0);
    e.stopPropagation();
    e.preventDefault();
  };
  const onResizeMouseMove = (e: globalThis.MouseEvent) => {
    if (!resizing) return;
    let dx = e.clientX - initialMousePos.x;
    let dy = e.clientY - initialMousePos.y;
    let newWidth = containerWidth;
    let newHeight = containerHeight;

    if (resizeHandle.includes("left")) {
      newWidth -= dx;
      containerRef.current?.style.setProperty(
        "left",
        `${containerPos.x + dx}px`
      );
      if (pos.x < dx) {
        setPos({ ...pos, x: 0 });
      } else {
        setPos({ ...pos, x: pos.x - dx });
      }
    }
    if (resizeHandle.includes("right")) newWidth += dx;
    if (resizeHandle.includes("top")) {
      newHeight -= dy;

      if (pos.y < dy) {
        setPos({ ...pos, y: 0 });
      } else {
        setPos({ ...pos, y: pos.y - dy });
      }
    }
    if (resizeHandle.includes("bottom")) newHeight += dy;

    containerRef.current?.style.setProperty("width", `${newWidth}px`);
    containerRef.current?.style.setProperty("height", `${newHeight}px`);

    if (pos.x > newWidth - 100) {
      setPos({ ...pos, x: newWidth - 100 });
    }
    if (pos.y > newHeight - 100) {
      setPos({ ...pos, y: newHeight - 100 });
    }

    e.stopPropagation();
    e.preventDefault();
  };

  const onResizeMouseUp = (e: globalThis.MouseEvent) => {
    setResizing(false);
    e.stopPropagation();
    e.preventDefault();

    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      setContainerHeight(containerRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", onResizeMouseMove);
    document.addEventListener("mouseup", onResizeMouseUp);

    return () => {
      document.removeEventListener("mousemove", onResizeMouseMove);
      document.removeEventListener("mouseup", onResizeMouseUp);
    };
  }, [resizing, onResizeMouseMove, onResizeMouseUp]);

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
    newX = Math.max(0, Math.min(containerWidth - 100, newX));
    newY = Math.max(0, Math.min(containerHeight - 100, newY));
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
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };

    containerRef.current?.addEventListener("resize", handleResize);

    return () => {
      containerRef.current?.removeEventListener("resize", handleResize);
    };
  }, []);

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
        resize: "both",
        overflow: "auto",
      }}
    >
      <div onMouseDown={onContainerMouseDown} className="drag-handle">
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

      <div
        onMouseDown={(e) => onResizeMouseDown("top-left", e)}
        className="top-left"
      />
      <div onMouseDown={(e) => onResizeMouseDown("top", e)} className="top" />
      <div
        onMouseDown={(e) => onResizeMouseDown("top-right", e)}
        className="top-right"
      />
      <div
        onMouseDown={(e) => onResizeMouseDown("right", e)}
        className="right"
      />
      <div
        onMouseDown={(e) => onResizeMouseDown("bottom-right", e)}
        className="bottom-right"
      />
      <div
        onMouseDown={(e) => onResizeMouseDown("bottom", e)}
        className="bottom"
      />
      <div
        onMouseDown={(e) => onResizeMouseDown("bottom-left", e)}
        className="bottom-left"
      />
      <div onMouseDown={(e) => onResizeMouseDown("left", e)} className="left" />
    </div>
  );
};

export default Container;
