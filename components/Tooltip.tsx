import { useState, ReactNode } from "react";

interface TooltipProps {
  text: string;
  direction?: "top" | "bottom" | "left" | "right" | "none";
  children: ReactNode;
  icon?: ReactNode; 
  width?: string; 
}

const Tooltip: React.FC<TooltipProps> = ({ text, direction = "top", children,icon, width = "auto" }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const tooltipStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
  };

  const tooltipContentStyle: React.CSSProperties = {
    position: "absolute",
    color: "textPrimary-grey",
    padding: "5px",
    borderRadius: "4px",
    zIndex: 999,
    display: isTooltipVisible ? "flex" : "none", // Tooltip show/hide
    textAlign: "center",
    backgroundColor: "#fff",
    width: width,
  };

//   const overlayStyle: React.CSSProperties = {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "red", // Dimmed effect
//     zIndex: 1000,  // Below tooltip but above other content
//   };
  

  const arrowStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 1000,
  };

  const getTooltipPosition = (): React.CSSProperties => {
    const offset = 10; // Adjust the spacing between tooltip and element
    switch (direction) {
      case "top":
        return { top: `calc(-100% - ${offset}px)`, left: "50%", transform: "translateX(-50%)" };
      case "right":
        return { top: "50%", left: `calc(100% + ${offset}px)`, transform: "translateY(-50%)" };
      case "bottom":
        return { top: `calc(100% + ${offset}px)`, left: "90%", transform: "translateX(-50%)" };
      case "left":
        return { top: "50%", right: `calc(100% + ${offset}px)`, transform: "translateY(-50%)" };
      default:
        return { top: "100%", left: "50%", transform: "translateX(-50%)" };
    }
  };

  const getArrowPosition = (): React.CSSProperties => {
    switch (direction) {
      case "top":
        return {
          bottom: "-5px",
          left: "50%",
          marginLeft: "-5px",
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "5px solid #fff",  // White arrow
        };
      case "bottom":
        return {
          top: "-10px",
          left: "90%",
          marginLeft: "-5px",
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderBottom: "10px solid #fff", // White arrow
        };
      case "right":
        return {
          top: "50%",
          left: "-5px",
          marginTop: "-5px",
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderRight: "5px solid #fff", // White arrow
        };
      case "left":
        return {
          top: "50%",
          right: "-5px",
          marginTop: "-5px",
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderLeft: "5px solid #fff", // White arrow
        };
      default:
        return {};
    }
  };
  

  return (
    <>
     {/* {isTooltipVisible && <div style={overlayStyle} />} */}
    <span
      style={tooltipStyle}
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
    >
       {children}
      {text && (
        <span className="p-4" style={{ ...tooltipContentStyle, ...getTooltipPosition() }}>
          {icon && <span className="mr-2">{icon}</span>}
          {direction !== 'none' && (
            <span
            
              style={{ ...arrowStyle, ...getArrowPosition() }}
            ></span>
          )}
          {text}
        </span>
      )}
    </span>
    </>
  );
};

export default Tooltip;
