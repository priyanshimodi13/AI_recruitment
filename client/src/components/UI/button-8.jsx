import React, { useEffect, useMemo, useState } from "react";
import { Sparkle } from "lucide-react";
import { loadFull } from "tsparticles";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { Link } from "react-router-dom";

const options = {
 key: "star",
 name: "Star",
 particles: {
  number: {
   value: 20,
   density: {
    enable: false,
   },
  },
  color: {
   value: ["#7c3aed", "#bae6fd", "#a78bfa", "#93c5fd", "#0284c7", "#fafafa", "#38bdf8"],
  },
  shape: {
   type: "star",
   options: {
    star: {
     sides: 4,
    },
   },
  },
  opacity: {
   value: 0.8,
  },
  size: {
   value: { min: 1, max: 4 },
  },
  rotate: {
   value: {
    min: 0,
    max: 360,
   },
   enable: true,
   direction: "clockwise",
   animation: {
    enable: true,
    speed: 10,
    sync: false,
   },
  },
  links: {
   enable: false,
  },
  reduceDuplicates: true,
  move: {
   enable: true,
   center: {
    x: 120,
    y: 45,
   },
  },
 },
 interactivity: {
  events: {},
 },
 smooth: true,
 fpsLimit: 120,
 background: {
  color: "transparent",
  size: "cover",
 },
 fullScreen: {
  enable: false,
 },
 detectRetina: true,
 absorbers: [
  {
   enable: true,
   opacity: 0,
   size: {
    value: 1,
    density: 1,
    limit: {
     radius: 5,
     mass: 5,
    },
   },
   position: {
    x: 110,
    y: 45,
   },
  },
 ],
 emitters: [
  {
   autoPlay: true,
   fill: true,
   life: {
    wait: true,
   },
   rate: {
    quantity: 5,
    delay: 0.5,
   },
   position: {
    x: 110,
    y: 45,
   },
  },
 ],
};

export const SparkleButton = ({ children, to, onClick, className = "" }) => {
 const [particleState, setParticlesReady] = useState();
 const [isHovering, setIsHovering] = useState(false);

 useEffect(() => {
  initParticlesEngine(async (engine) => {
   await loadFull(engine);
  }).then(() => {
   setParticlesReady("loaded");
  });
 }, []);

 const modifiedOptions = useMemo(() => {
  options.autoPlay = isHovering;
  return options;
 }, [isHovering]);

 const innerContent = (
  <>
   <div className="relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-400 via-blue-600 via-40% to-purple-600 px-8 py-4 text-white w-full h-full font-bold shadow-lg shadow-blue-500/25">
    <Sparkle className="w-5 h-5 -translate-y-0.5 animate-sparkle fill-white" />
    <Sparkle
     style={{ animationDelay: "1s" }}
     className="absolute bottom-2.5 left-3.5 z-20 w-2 h-2 rotate-12 animate-sparkle fill-white"
    />
    <Sparkle
     style={{ animationDelay: "1.5s", animationDuration: "2.5s" }}
     className="absolute left-5 top-2.5 w-1 h-1 -rotate-12 animate-sparkle fill-white"
    />
    <Sparkle
     style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
     className="absolute left-3 top-3 w-1.5 h-1.5 animate-sparkle fill-white"
    />
    <span className="font-semibold text-lg flex items-center gap-2">{children}</span>
   </div>
   {!!particleState && (
    <Particles
     id="sparkle-particles"
     className={`pointer-events-none absolute -inset-4 z-0 transition-opacity duration-300 ${
      particleState === "ready" && isHovering ? "opacity-100" : "opacity-0"
     }`}
     particlesLoaded={async () => {
      setParticlesReady("ready");
     }}
     options={modifiedOptions}
    />
   )}
  </>
 );

 const wrapperClasses = `group relative inline-block rounded-full bg-gradient-to-r from-blue-300/30 via-blue-500/30 via-40% to-purple-500/30 p-[2px] text-white transition-transform hover:scale-105 active:scale-95 ${className}`;

 if (to) {
  return (
   <Link
    to={to}
    className={wrapperClasses}
    onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
   >
    {innerContent}
   </Link>
  );
 }

 return (
  <button
   className={wrapperClasses}
   onClick={onClick}
   onMouseEnter={() => setIsHovering(true)}
   onMouseLeave={() => setIsHovering(false)}
  >
   {innerContent}
  </button>
 );
};
