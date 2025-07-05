// components/MapWithGrids.jsx
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapWithGrids = () => {
  const center = [22.5726, 88.3639]; // Kolkata center as example
  const gridSize = 0.001; // degrees, roughly ~111m

  const createGrids = (rows, cols) => {
    const grids = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const lat = center[0] + i * gridSize;
        const lng = center[1] + j * gridSize;
        grids.push([
          [lat, lng],
          [lat + gridSize, lng],
          [lat + gridSize, lng + gridSize],
          [lat, lng + gridSize],
        ]);
      }
    }
    return grids;
  };

  const grids = createGrids(5, 5); // 5x5 grid

  return (
    <MapContainer center={center} zoom={16} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {grids.map((polygon, index) => (
        <Polygon key={index} positions={polygon} pathOptions={{ color: "green" }} />
      ))}
    </MapContainer>
  );
};

export default MapWithGrids;
