import React, { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Data for technologies to display in the orbit
interface TechInfo {
  key: string;
  label: string;
  icon: string;
  description: string;
}

const TECHS: TechInfo[] = [
  {
    key: "html",
    label: "HTML",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    description: "Markup language for structuring web pages.",
  },
  {
    key: "css",
    label: "CSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    description: "Stylesheet language for designing web pages.",
  },
  {
    key: "js",
    label: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    description: "Programming language of the Web.",
  },
  {
    key: "vite",
    label: "Vite",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg",
    description: "Next generation, fast build tool.",
  },
  {
    key: "react",
    label: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    description: "Library for building user interfaces.",
  },
  {
    key: "node",
    label: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    description: "JavaScript runtime built on Chrome V8.",
  },
  {
    key: "mongodb",
    label: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    description: "NoSQL document database.",
  },
  {
    key: "express",
    label: "Express",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    description: "Minimal and flexible Node.js framework.",
  },
  {
    key: "nextjs",
    label: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    description: "React framework for production.",
  },
];

// Radius of the orbit in pixels
const ORBIT_RADIUS = 180;

interface TechOrbitProps {
  /**
   * React node rendered in the middle of the orbit. When not provided, a
   * default heading with the author name and subtitle is shown.
   */
  centerContent?: React.ReactNode;
}

const TechOrbit = ({ centerContent }: TechOrbitProps) => {
  const [activeTech, setActiveTech] = useState<TechInfo | null>(null);

  // Pre-compute icon positions so they stay immutable across renders
  const positions = useMemo(() => {
    return TECHS.map((_, idx) => {
      const angle = (idx / TECHS.length) * 2 * Math.PI; // distribute evenly 360°
      const x = Math.cos(angle) * ORBIT_RADIUS;
      const y = Math.sin(angle) * ORBIT_RADIUS;
      return { x, y };
    });
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Center content */}
      {centerContent !== undefined ? (
        <div className="pointer-events-none">{centerContent}</div>
      ) : (
        <div className="text-center pointer-events-none">
          <h2 className="font-display font-bold text-4xl md:text-6xl text-slate-800 dark:text-slate-100 leading-tight">
            Gourab <br /> Mullick
          </h2>
          <p className="mt-2 text-sm md:text-base font-light text-slate-500 dark:text-slate-400">
            Full Stack Dev + DevOps Enthusiast
          </p>
        </div>
      )}

      {/* Spinning orbit with icons */}
      <div className="absolute inset-0 flex items-center justify-center animate-spin-slow" style={{ perspective: "800px" }}>
        {TECHS.map((tech, idx) => (
          <button
            key={tech.key}
            onClick={() => setActiveTech(tech)}
            style={{
              transform: `translate(${positions[idx].x}px, ${positions[idx].y}px)`,
            }}
            className={cn(
              "absolute w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden transition-transform",
              "hover:scale-110 focus-visible:scale-110"
            )}
            aria-label={tech.label}
          >
            <Image
              src={tech.icon}
              alt={tech.label}
              width={56}
              height={56}
              className="object-contain drop-shadow-md"
            />
          </button>
        ))}
      </div>

      {/* Bottom info panel */}
      {activeTech && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 dark:bg-slate-800/90 text-green-400 font-mono px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-md">
          <Image
            src={activeTech.icon}
            alt={activeTech.label}
            width={24}
            height={24}
            className="object-contain"
          />
          <span>
            {activeTech.label}: {activeTech.description}
          </span>
        </div>
      )}
    </div>
  );
};

export default TechOrbit;