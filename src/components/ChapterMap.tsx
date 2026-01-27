
"use client";

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, Annotation } from "react-simple-maps";

const geoUrl = "/maps/world-110m.json";

const markers = [
  {
    markerOffset: -15,
    name: "Main Chapter",
    location: "Houston, TX",
    description: "Our main chapter, located in Houston, open to all members globally.",
    coordinates: [-95.3698, 29.7604] as [number, number],
  },
  {
    markerOffset: 25,
    name: "Bogota",
    location: "Bogota, Colombia",
    description: "A growing chapter in the heart of Colombia.",
    coordinates: [-74.0721, 4.7110] as [number, number],
  },
  {
    markerOffset: 25,
    name: "San Diego",
    location: "San Diego, CA",
    description: "Connecting members in Southern California.",
    coordinates: [-117.1611, 32.7157] as [number, number],
  },
  {
    markerOffset: -15,
    name: "Enterprise",
    location: "Enterprise, AL",
    description: "A hub for innovation in Alabama.",
    coordinates: [-85.8580, 31.3157] as [number, number],
  },
];

const ChapterMap = () => {
  const [tooltip, setTooltip] = useState<any>(null);

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 120,
        center: [0, 20]
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#EAEAEC"
              stroke="#D6D6DA"
            />
          ))
        }
      </Geographies>
      {markers.map((marker) => (
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
      {tooltip && (
        <Annotation
          subject={tooltip.coordinates}
          dx={-90}
          dy={-30}
          connectorProps={{
            stroke: "#FF5533",
            strokeWidth: 2,
            strokeLinecap: "round",
          }}
        >
          <div style={{ position: 'relative', zIndex: 999, background: "white", padding: "10px", borderRadius: "5px", boxShadow: "0px 0px 10px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontWeight: "bold", color: "#333" }}>{tooltip.name}</h3>
            <p style={{color: "#555"}}>{tooltip.location}</p>
            <p style={{color: "#777"}}>{tooltip.description}</p>
          </div>
        </Annotation>
      )}
    </ComposableMap>
  );
};

export default ChapterMap;
