import React from "react";
import { cn } from "../../lib/utils";

/**
 * @name BorderBeam
 * @description A high-performance animated beam of light that travels along the border of its container.
 */
export const BorderBeam = ({
  className = "",
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
}) => {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        }
      }
      className={cn(
        "pointer-events-none border-beam-mask border-beam-effect",
        className
      )}
    />
  )
}
