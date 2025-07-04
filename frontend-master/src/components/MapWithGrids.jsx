import { MapContainer, TileLayer, Rectangle } from 'react-leaflet';
import { useState } from 'react';

const MapWithGrids = ({ center, gridSize = 0.001, rows = 5, cols = 5 }) => {
  const [bounds, setBounds] = useState([]);

  const generateGrid = () => {
    const grid = [];
    const [lat, lng] = center;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const southWest = [lat + i * gridSize, lng + j * gridSize];
        const northEast = [lat + (i + 1) * gridSize, lng + (j + 1) * gridSize];
        grid.push({
          id: `GRID-${i * cols + j + 1}`,
          bounds: [southWest, northEast],
        });
      }
    }

    setBounds(grid);
  };

  return (
    <MapContainer center={center} zoom={17} scrollWheelZoom={false} style={{ height: "400px", width: "100%" }} whenCreated={generateGrid}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {bounds.map((cell, idx) => (
        <Rectangle key={idx} bounds={cell.bounds} pathOptions={{ color: "green" }} />
      ))}
    </MapContainer>
  );
};

export default MapWithGrids;
