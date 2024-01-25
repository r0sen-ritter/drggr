import React, { useState, useEffect, MouseEvent, useRef } from "react";
import Tooltip from "./Tooltip";
import { MdDragIndicator } from "react-icons/md";
import "./Container.css";

const Container: React.FC<{ toolTipPos: string }> = ({ toolTipPos }) => {
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);

  const [pos, setPos] = useState({ x: 250, y: 250 });
  const [rel, setRel] = useState<{ x: number; y: number } | null>(null);

  const [containerPos, setContainerPos] = useState({ x: 420, y: 80 });
  const [containerRel, setContainerRel] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const innerRectangleRef = useRef<HTMLDivElement>(null);

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
    setContainerPos({
      x: containerRef.current?.offsetLeft || 0,
      y: containerRef.current?.offsetTop || 0,
    });
    e.stopPropagation();
    e.preventDefault();
    setPos({
      x: innerRectangleRef.current?.offsetLeft || 0,
      y: innerRectangleRef.current?.offsetTop || 0,
    });
  };

  let totalShiftX = 0;
  let totalShiftY = 0;
  let throttleTimeout: number | null = null;

  const onResizeMouseMove = (e: globalThis.MouseEvent) => {
    if (throttleTimeout) return;

    throttleTimeout = setTimeout(() => {
      throttleTimeout = null;
      if (!resizing) return;
      setHovering(false);
      let dx = e.clientX - initialMousePos.x;
      let dy = e.clientY - initialMousePos.y;
      let newWidth = containerWidth;
      let newHeight = containerHeight;

      if (resizeHandle.includes("left")) {
        newWidth -= dx;
        if (newWidth < 100) {
          newWidth = 100;
          dx = containerWidth - newWidth;
        }
        containerRef.current?.style.setProperty(
          "left",
          `${containerPos.x + dx}px`
        );
        containerRef.current?.style.setProperty("width", `${newWidth}px`);

        let newPos = pos.x - dx - totalShiftX;
        if (newPos < 0) {
          totalShiftX += newPos;
          newPos = 0;
        }

        innerRectangleRef.current?.style.setProperty("left", `${newPos}px`);
      }

      if (resizeHandle.includes("right")) {
        newWidth += dx;
        if (newWidth < 100) {
          newWidth = 100;
          dx = containerWidth - newWidth;
        }
        containerRef.current?.style.setProperty("width", `${newWidth}px`);

        const innerItemPos = innerRectangleRef.current?.offsetLeft || 0;
        const innerItemWidth = innerRectangleRef.current?.offsetWidth || 0;

        if (newWidth < innerItemPos + innerItemWidth) {
          innerRectangleRef.current?.style.setProperty(
            "left",
            `${newWidth - innerItemWidth}px`
          );
        }
      }
      if (resizeHandle.includes("top")) {
        newHeight -= dy;
        if (newHeight < 100) {
          newHeight = 100;
          dy = containerHeight - newHeight;
        }
        containerRef.current?.style.setProperty(
          "top",
          `${containerPos.y + dy}px`
        );
        containerRef.current?.style.setProperty("height", `${newHeight}px`);

        let newPos = pos.y - dy - totalShiftY;
        if (newPos < 0) {
          totalShiftY += newPos;
          newPos = 0;
        }

        innerRectangleRef.current?.style.setProperty("top", `${newPos}px`);
      }
      if (resizeHandle.includes("bottom")) {
        newHeight += dy;
        if (newHeight < 100) {
          newHeight = 100;
          dy = containerHeight - newHeight;
        }
        containerRef.current?.style.setProperty("height", `${newHeight}px`);

        const innerItemPos = innerRectangleRef.current?.offsetTop || 0;
        const innerItemHeight = innerRectangleRef.current?.offsetHeight || 0;

        if (newHeight < innerItemPos + innerItemHeight) {
          innerRectangleRef.current?.style.setProperty(
            "top",
            `${newHeight - innerItemHeight}px`
          );
        }
      }
      containerRef.current?.style.setProperty("width", `${newWidth}px`);
      containerRef.current?.style.setProperty("height", `${newHeight}px`);

      e.stopPropagation();
      e.preventDefault();
    }, 10);
  };

  const onResizeMouseUp = (e: globalThis.MouseEvent) => {
    setResizing(false);
    e.stopPropagation();
    e.preventDefault();

    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      setContainerHeight(containerRef.current.offsetHeight);
    }

    setPos({
      x: innerRectangleRef.current?.offsetLeft || 0,
      y: innerRectangleRef.current?.offsetTop || 0,
    });
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
    if (containerRef.current) {
      var posX = e.clientX - containerRef.current.offsetLeft;
      var posY = e.clientY - containerRef.current.offsetTop;
      setContainerDragging(true);
      setContainerRel({ x: posX, y: posY });
    }
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
    document.addEventListener("mouseup", onContainerMouseUp);
  };

  const onContainerMouseUp = (e: globalThis.MouseEvent) => {
    setContainerDragging(false);
    e.stopPropagation();
    e.preventDefault();
    document.removeEventListener("mouseup", onContainerMouseUp);
  };

  useEffect(() => {
    document.addEventListener("mousemove", onContainerMouseMove);

    return () => {
      document.removeEventListener("mousemove", onContainerMouseMove);
    };
  }, [containerDragging, onContainerMouseMove]);

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
    document.addEventListener("mouseup", onMouseUp);
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
    document.removeEventListener("mouseup", onMouseUp);
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [dragging, onMouseMove]);

  return (
    <div
      ref={containerRef}
      className="container"
      style={{
        left: `${containerPos.x}px`,
        top: `${containerPos.y}px`,
      }}
    >
      <div onMouseDown={onContainerMouseDown} className="drag-handle">
        <MdDragIndicator style={{ scale: "2", color: "orange" }} />
      </div>
      <div
        ref={innerRectangleRef}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="item"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
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
