import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";

function App() {
  const [inputs, setInputs] = useState({
    N: "", P: "", K: "", temperature: "",
    humidity: "", ph: "", rainfall: ""
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/predict", inputs);
      setResult(res.data);
    } catch {
      alert("Backend not running.");
    }
  };

  return (
    <div className="container">
      <h1>🌾 Crop Recommendation</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(inputs).map((key) => (
          <input
            key={key}
            name={key}
            type="number"
            step="any"
            placeholder={key.toUpperCase()}
            value={inputs[key]}
            onChange={handleChange}
            required
          />
        ))}
        <button type="submit">Predict</button>
      </form>

      {result && (
        <div className="result">
          <h2>Top Crop Predictions</h2>
          <Bar
            data={{
              labels: result.crops,
              datasets: [{
                label: "Probability",
                data: result.scores,
                backgroundColor: "#66bb6a"
              }]
            }}
            options={{
              scales: {
                y: { beginAtZero: true, max: 1 }
              },
              responsive: true,
              animation: { duration: 1000 }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
