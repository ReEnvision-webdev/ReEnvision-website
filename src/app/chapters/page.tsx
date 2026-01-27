
"use client";

import React, { useState } from "react";
import ChapterMap from "@/components/ChapterMap";

const ChaptersPage = () => {
  return (
    <div className="flex flex-col min-h-screen items-center pt-[64px] bg-[#f0f8ff]">
      <div className="h-[50vh] flex flex-col items-center justify-center relative chapters-hero-img">
        <h1 className="text-3xl md:text-6xl font-bold mb-6 text-[#E0E0E0] mt-8 text-center z-1">
          Our Chapters
        </h1>
      </div>
      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-[#1f639e] mb-6">Find a Chapter</h2>
          <p className="text-center text-lg text-gray-700 leading-relaxed mb-12">
            ReEnvision chapters are local hubs where you can connect with other members, participate in events, and contribute to projects. Hover over a pin on the map to learn more about each chapter.
          </p>
          <div style={{ width: "100%", height: "500px" }}>
            <ChapterMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChaptersPage;

