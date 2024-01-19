import "./Tooltip.css";
import ReactDOM from "react-dom";

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

export default Tooltip;
