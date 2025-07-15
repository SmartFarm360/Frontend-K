import React, { useEffect } from "react";

const MapComponent = () => {
  useEffect(() => {
    // 1. Create script tag for loading MapmyIndia SDK
    const script = document.createElement("script");
    script.src =
      "https://apis.mapmyindia.com/advancedmaps/v1/890b927c2d4d2642a7179eca68750ce4/map_load?v=1.5";
    script.async = true;

    // 2. After the script loads, initialize the map
    script.onload = () => {
      const map = new window.MapmyIndia.Map("map", {
        center: [28.61, 77.23], // Set your default location here
        zoom: 10,
      });

      window.L.marker([28.61, 77.23])
        .addTo(map)
        .bindPopup("Welcome to Delhi")
        .openPopup();
    };

    document.body.appendChild(script);
  }, []);

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default MapComponent;
