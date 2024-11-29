import { useEffect, useRef } from "react";
import { mappls } from "mappls-web-maps";

const mapplsClassObject = new mappls();

const RoutePolyline = ({ map, coordinates }) => {
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!coordinates || coordinates.length < 2) return;

    // Remove previous polyline if exists
    if (polylineRef.current) {
      mapplsClassObject.removeLayer({ map: map, layer: polylineRef.current });
    }

    // Convert coordinates array to required format
    const path = coordinates.map(coord => ({
      lat: coord[1],  // MapplsAPI returns [lng, lat]
      lng: coord[0]
    }));

    // Create new polyline
    polylineRef.current = mapplsClassObject.Polyline({
      map: map,
      path: path,
      fitbounds: true,
      strokeColor: '#2196f3',
      strokeWeight: 5,
    });
  }, [coordinates, map]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        mapplsClassObject.removeLayer({ map: map, layer: polylineRef.current });
      }
    };
  }, [map]);

  return null; // This component doesn't render anything visible
};

export default RoutePolyline; 