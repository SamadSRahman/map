import { mappls, mappls_plugin } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";
import RoutePolyline from "./components/RoutePolyline";

const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

const App = () => {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const loadObject = {
    map: true,
    plugins: ["direction"],
    layers: ["route", "raster"],
    libraries: ["polyline", "polydraw"],
  };

  useEffect(() => {
    mapplsClassObject.initialize(
      "4bc7fb9f-d1e2-4b74-b1f7-ee0ada0c67b6",
      loadObject,
      () => {
        const newMap = mapplsClassObject.Map({
          id: "map",
          properties: {
            center: [28.633, 77.2194],
            zoom: 4,
          },
        });

        newMap.on("load", () => {
          setIsMapLoaded(true);
          mapRef.current = newMap;
        });
      }
    );

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const getRoute = () => {
    mapplsPluginObject.direction({
      map: mapRef.current,
      destination: destination,
      source: source,
      // pod: 'none',

      callback: function (data) {
        if (data.routes && data.routes[0]) {
          setRouteCoordinates(data.routes[0].geometry.coordinates);
        }
      },
    });
  };

  return (
    <div>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f5f5f5",
          display: "flex",
          gap: "15px",
        }}
      >
        <input
          type="text"
          placeholder="Enter source location"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button onClick={getRoute}>Get Route</button>
      </div>
      <div
        id="map"
        style={{
          width: "100vw",
          height: "calc(99vh - 60px)",
          display: "inline-block",
        }}
      >
        {isMapLoaded && routeCoordinates && (
          <RoutePolyline map={mapRef.current} coordinates={routeCoordinates} />
        )}
      </div>
    </div>
  );
};

export default App;