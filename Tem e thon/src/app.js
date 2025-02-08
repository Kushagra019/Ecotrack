import React, { useState } from "react";

function App() {
  const [transport, setTransport] = useState(0);
  const [electricity, setElectricity] = useState(0);
  const [carbonFootprint, setCarbonFootprint] = useState(null);

  const calculateFootprint = () => {
    const footprint = transport * 2.3 + electricity * 0.85;
    setCarbonFootprint(footprint.toFixed(2)); // Rounds to 2 decimal places
  };

  return (
    <div style={styles.container}>
      <h1>Carbon Footprint Tracker</h1>

      <div style={styles.inputGroup}>
        <label>Transport (km per day):</label>
        <input
          type="number"
          value={transport}
          onChange={(e) => setTransport(Number(e.target.value))}
        />
      </div>

      <div style={styles.inputGroup}>
        <label>Electricity Usage (kWh per month):</label>
        <input
          type="number"
          value={electricity}
          onChange={(e) => setElectricity(Number(e.target.value))}
        />
      </div>

      <button style={styles.button} onClick={calculateFootprint}>
        Calculate Carbon Footprint
      </button>

      {carbonFootprint !== null && (
        <p>Your estimated carbon footprint: {carbonFootprint} kg CO₂</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  inputGroup: {
    margin: "10px 0",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px",
    border: "none",
    cursor: "pointer",
  },
};

export default App;
