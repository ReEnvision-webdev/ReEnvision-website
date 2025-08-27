"use client";
import { useState, KeyboardEvent } from "react";

export default function ValueCard(props: {
  title: string;
  description: string;
  aosDelay?: number;
}) {
  const { title, description, aosDelay } = props;
  const [flipped, setFlipped] = useState(false);

  const toggle = () => {
    setFlipped(flipped => !flipped);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className="group [perspective:1000px]"
      data-aos="fade-up"
      data-aos-delay={aosDelay ?? 0}
    >
      <div
        className={`relative h-40 w-full rounded-lg transition-transform duration-500 bg-white [transform-style:preserve-3d] transform-gpu hover:[transform:rotateY(180deg)] focus-within:[transform:rotateY(180deg)] shadow-md hover:shadow-lg border border-gray-200 ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        <div className="absolute inset-0 rounded-lg bg-white [backface-visibility:hidden] flex items-center justify-center p-4 text-center">
          <div
            role="button"
            tabIndex={0}
            aria-pressed={flipped ? "true" : "false"}
            aria-label={`${title} details`}
            onClick={toggle}
            onKeyDown={onKey}
            className="absolute inset-0 cursor-pointer touch-manipulation rounded-lg"
            style={{ backfaceVisibility: "hidden" }}
          />
          <div className="text-[#1f639e] font-semibold">{title}</div>
        </div>

        <div className="absolute inset-0 rounded-lg bg-white [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center p-4 text-center text-gray-600 text-sm leading-relaxed">
          <div
            role="button"
            tabIndex={0}
            aria-pressed={flipped ? "true" : "false"}
            aria-label={`${title} details`}
            onClick={toggle}
            onKeyDown={onKey}
            className="absolute inset-0 cursor-pointer touch-manipulation rounded-lg"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          />
          <div>{description}</div>
        </div>
      </div>
    </div>
  );
}
