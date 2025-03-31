import React from "react";

const MarqueeText = ({ text }) => {
  return (
    <div
      className="relative overflow-hidden w-full h-5 flex items-center justify-center mb-8"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
      }}
    >
      <div className="flex animate-marquee">
        {text.split("").map((letter, index) => (
          <span
            key={index}
            className="inline-block text-2xl font-semibold mr-1"
            style={{
              animation: `fadeOut 8s linear infinite`,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;