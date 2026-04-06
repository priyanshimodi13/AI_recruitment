import React from "react";

/**
 * @name Shine Border
 * @description It is an animated background border effect component with easy to use and configurable props.
 * @param borderRadius defines the radius of the border.
 * @param borderWidth defines the width of the border.
 * @param duration defines the animation duration to be applied on the shining border
 * @param color a string or string array to define border color.
 * @param className defines the class name to be applied to the component
 * @param children contains react node elements.
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  className = "",
  children,
}) {
  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
          borderRadius: `${borderRadius}px`,
        }
      }
      className={`rounded-[--border-radius] bg-[var(--color-bg)] text-[var(--color-text)] relative ${className}`}
    >
      <div
        style={
          {
            "--border-width": `${borderWidth}px`,
            "--border-radius": `${borderRadius}px`,
            "--duration": `${duration}s`,
            "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            "--background-radial-gradient": `radial-gradient(transparent,transparent, ${color instanceof Array ? color.join(",") : color},transparent,transparent)`,
          }
        }
        className="pointer-events-none shine-layer absolute inset-0 z-10"
      ></div>
      {children}
    </div>
  )
}
