import axios from "axios";
import { mappls, mappls_plugin } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";

const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

const App = () => {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  const loadObject = { 
    map: true, 
    layer: 'raster', // Optional Default Vector
    version: '3.0', // // Optional, other version 3.5 also available with CSP headers
    libraries: ['polydraw'], //Optional for Polydraw and airspaceLayers
    plugins:['direction'] // Optional for All the plugins
};

  // const getRoute = () => {
  //   if (!source || !destination) {
  //     alert('Please enter both source and destination');
  //     return;
  //   }

  //   // Remove existing route layer if any
  //   if (mapRef.current.getLayer('route-layer')) {
  //     mapRef.current.removeLayer('route-layer');
  //   }
  //   if (mapRef.current.getSource('route-source')) {
  //     mapRef.current.removeSource('route-source');
  //   }

  //   mapplsPluginObject.direction({
  //     map: mapRef.current,
  //     destination: destination,
  //     source: source,
  //     routeColor: '#2196f3',
  //     routeWidth: 5,
  //     fitbounds: true,
  //     resource: 'route_adv',
  //     callback: function(data) {
  //       console.log("Route data:", data);
        
  //       if (data.routes && data.routes[0]) {
  //         const coordinates = data.routes[0].geometry.coordinates;
  //         console.log("Coordinates:", coordinates);

  //         // Wait for a small delay to ensure map is ready
  //         setTimeout(() => {
  //           try {
  //             // Add the route source and layer to the map
  //             mapRef.current.addSource('route-source', {
  //               type: 'geojson',
  //               data: {
  //                 type: 'Feature',
  //                 properties: {},
  //                 geometry: {
  //                   type: 'LineString',
  //                   coordinates: coordinates
  //                 }
  //               }
  //             });

  //             mapRef.current.addLayer({
  //               id: 'route-layer',
  //               type: 'line',
  //               source: 'route-source',
  //               layout: {
  //                 'line-join': 'round',
  //                 'line-cap': 'round'
  //               },
  //               // paint: {
  //               //   'line-color': '#2196f3',
  //               //   'line-width': 5
  //               // }
                
  //             });

  //             // Fit bounds only if coordinates exist
  //             if (coordinates.length > 0) {
  //               const bounds = new mapplsClassObject.LngLatBounds();
  //               coordinates.forEach(coord => {
  //                 bounds.extend(coord);
  //               });

  //               mapRef.current.fitBounds(bounds, {
  //                 padding: 50
  //               });
  //             }
  //           } catch (error) {
  //             console.error("Error adding route:", error);
  //           }
  //         }, 100);
  //       }
  //     }
  //   });
  // };

 async function getRoute(){
   try {
    const response = await axios.get('https://apis.mapmyindia.com/advancedmaps/v1/4bc7fb9f-d1e2-4b74-b1f7-ee0ada0c67b6/route_adv/driving/77.131123,28.552413;17ZUL7?')
    console.log("response", response.data);
    
   } catch (error) {
    console.log(error);
   }
 
  }

  useEffect(() => {
    mapplsClassObject.initialize("5f77713e966c956f5b8989bb5e089ab4", loadObject, () => {
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
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div>
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <input
          type="text"
          placeholder="Enter source location"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={getRoute}>Get Route</button>
      </div>
      <div
        id="map"
        style={{ width: "100vw", height: "calc(99vh - 60px)", display: "inline-block" }}
      >
        {isMapLoaded}
      </div>
    </div>
  );
};

export default App;