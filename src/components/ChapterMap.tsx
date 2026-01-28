"use client";

import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl = "/maps/world-110m.json";

interface MarkerType {
  markerOffset: number;
  name: string;
  location: string;
  description: string;
  coordinates: [number, number];
}

const markers: MarkerType[] = [
  {
    markerOffset: -15,
    name: "Main Chapter",
    location: "Houston, TX",
    description:
      "Our main chapter, located in Houston, open to all members globally.",
    coordinates: [-95.3698, 29.7604],
  },
  {
    markerOffset: 25,
    name: "Bogota",
    location: "Bogota, Colombia",
    description: "A growing chapter in the heart of Colombia.",
    coordinates: [-74.0721, 4.711],
  },
  {
    markerOffset: 25,
    name: "San Diego",
    location: "San Diego, CA",
    description: "Connecting members in Southern California.",
    coordinates: [-117.1611, 32.7157],
  },
  {
    markerOffset: -15,
    name: "Enterprise",
    location: "Enterprise, AL",
    description: "A hub for innovation in Alabama.",
    coordinates: [-85.858, 31.3157],
  },
];

const ChapterMap = () => {
  const [tooltip, setTooltip] = useState<MarkerType | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%" }}
      onMouseMove={handleMouseMove}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [0, 20],
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
              />
            ))
          }
        </Geographies>
        {markers.map(marker => (
          <Marker
            key={marker.name}
            coordinates={marker.coordinates}
            onMouseEnter={() => {
              setTooltip(marker);
            }}
            onMouseLeave={() => {
              setTooltip(null);
            }}
          >
            <circle r={8} fill="#F5A623" stroke="#fff" strokeWidth={2} />
          </Marker>
        ))}
      </ComposableMap>
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: mousePosition.x + 10,
            top: mousePosition.y + 10,
            background: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
            zIndex: 999,
          }}
        >
          <h3 style={{ fontWeight: "bold", color: "#333" }}>{tooltip.name}</h3>
          <p style={{ color: "#555" }}>{tooltip.location}</p>
          <p style={{ color: "#777" }}>{tooltip.description}</p>
        </div>
      )}
    </div>
  );
};

export default ChapterMap;
