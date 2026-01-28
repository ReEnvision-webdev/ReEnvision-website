"use client";

import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl = "/maps/world-110m.json";

interface Chapter {
  id: string;
  name: string;
  location: string;
  description: string;
  website: string | null;
  coordinates: [number, number]; // longitude, latitude
}

interface MarkerType {
  markerOffset: number;
  name: string;
  location: string;
  description: string;
  website: string | null;
  coordinates: [number, number];
}

const ChapterMap = () => {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [tooltip, setTooltip] = useState<MarkerType | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChaptersAndGeocode = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/chapters");

        if (!response.ok) {
          throw new Error("Failed to fetch chapters");
        }

        const result = await response.json();
        const chapters: Chapter[] = result.data;

        // Process each chapter to get coordinates
        const processedMarkers: MarkerType[] = [];

        for (const chapter of chapters) {
          // Attempt to geocode the location to get coordinates
          const coords = await geocodeLocation(chapter.location);

          if (coords) {
            processedMarkers.push({
              markerOffset: -15,
              name: chapter.name,
              location: chapter.location,
              description: chapter.description,
              website: chapter.website,
              coordinates: coords,
            });
          }
        }

        setMarkers(processedMarkers);
      } catch (err) {
        console.error("Error fetching chapters:", err);
        setError("Failed to load chapters.");

        // Show no markers if API fails
        setMarkers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChaptersAndGeocode();
  }, []);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };

  // Function to geocode location using a free geocoding service
  const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
    try {
      // Using OpenStreetMap Nominatim API (free tier)
      // Note: In production, you might want to cache results or use a paid service
      const encodedLocation = encodeURIComponent(location);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}&limit=1`
      );

      if (!response.ok) {
        console.error(`Geocoding failed for location: ${location}`);
        return null;
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        if (!isNaN(lat) && !isNaN(lon)) {
          return [lon, lat]; // Nominatim returns [lat, lon], but react-simple-maps expects [lon, lat]
        }
      }

      console.error(`No coordinates found for location: ${location}`);
      return null;
    } catch (error) {
      console.error(`Error geocoding location: ${location}`, error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>Loading chapters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

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
        {markers.map((marker, index) => (
          <Marker
            key={`${marker.name}-${index}`}
            coordinates={marker.coordinates}
            onMouseEnter={() => {
              setTooltip(marker);
            }}
            onMouseLeave={() => {
              setTooltip(null);
            }}
            onClick={() => {
              if (marker.website) {
                window.open(marker.website, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            <circle r={8} fill="#F5A623" stroke="#fff" strokeWidth={2} style={{ cursor: marker.website ? 'pointer' : 'default' }} />
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
            maxWidth: "300px",
          }}
        >
          <h3 style={{ fontWeight: "bold", color: "#333", margin: 0 }}>{tooltip.name}</h3>
          <p style={{ color: "#555", margin: "5px 0 0" }}>{tooltip.location}</p>
          <p style={{ color: "#777", margin: "5px 0" }}>{tooltip.description}</p>
          {tooltip.website && (
            <a
              href={tooltip.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1f639e", fontSize: "14px", textDecoration: "underline", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering marker click
              }}
            >
              Click to visit website
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ChapterMap;
