"use client";

import { MapProps } from "@/src/components/ui/map";
import dynamic from "next/dynamic";

const LazyMap = dynamic(() => import("@/src/components/ui/map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

function MapCaller(props: MapProps) {
  return <LazyMap {...props} />;
}

export default MapCaller;
