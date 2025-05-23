"use client";

import React from "react";
import DynamicMap from "./dynamic-map";

export interface MapProps {
  posix: [number, number];
  zoom?: number;
}

const MapCaller: React.FC<MapProps> = (props) => {
  return <DynamicMap {...props} />;
};

export default MapCaller;
