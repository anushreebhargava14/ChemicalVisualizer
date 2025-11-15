import React, { useEffect, useState } from "react";
import UploadSection from "./components/UploadSection";
import { API_BASE_URL } from "./config";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function App() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const loadDatasets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/datasets/`);
      if (!res.ok) throw new Error("Failed to fetch datasets");
      const data = await res.json();
      setDatasets(data);

      if (data.length > 0) setSelectedDataset(data[0]);
    } catch (err) {
      console.error("Error loading datasets:", err);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  const downloadPDF = (id) => {
    window.open(`${API_BASE_URL}/datasets/${id}/pdf/`, "_blank");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        overflowY: "auto",
        background: darkMode ? "#1a1a1a" : "#f2f2f2",
        color: darkMode ? "white" : "black",
        transition: "0.3s",
        padding: "0",
        maxWidth: "100vw",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <span className="material-symbols-outlined" style={{ color: "#136dec", fontSize: "30px" }} > bubble_chart </span>
        <h1 style={{ margin: 5 }}>Chemical Equipment Parameter Visualizer</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ marginRight: 10,
            padding: "20px 30px",
            borderRadius: "6px",
            cursor: "pointer",
            border: "1px solid #888",
            background: darkMode ? "#333" : "#fff",
          }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* UPLOAD SECTION */}
      <UploadSection onUploadComplete={loadDatasets} />

      <br />

      {/* DATASET TABLE */}
      <h2>Uploaded Datasets (Latest 5)</h2>

      <table
        style={{
          width: "100%",
          minWidth: "1000px",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr style={{ background: darkMode ? "#333" : "#ddd" }}>
            <th style={thStyle}>File Name</th>
            <th style={thStyle}>Total Rows</th>
            <th style={thStyle}>Avg Flowrate</th>
            <th style={thStyle}>Avg Pressure</th>
            <th style={thStyle}>Avg Temperature</th>
            <th style={thStyle}>PDF</th>
          </tr>
        </thead>

        <tbody>
          {datasets.map((ds) => (
            <tr
              key={ds.id}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedDataset(ds)}
            >
              <td style={tdStyle}>{ds.filename}</td>
              <td style={tdStyle}>{ds.summary.total_count}</td>
              <td style={tdStyle}>{ds.summary.avg_flowrate.toFixed(2)}</td>
              <td style={tdStyle}>{ds.summary.avg_pressure.toFixed(2)}</td>
              <td style={tdStyle}>{ds.summary.avg_temperature.toFixed(2)}</td>

              <td style={tdStyle}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadPDF(ds.id);
                  }}
                  style={pdfBtn}
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CHART AREA */}
      {selectedDataset ? (
        <div
          style={{
            padding: "20px",
            background: darkMode ? "#222" : "white",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        >
          <h3>{selectedDataset.filename} – Summary Trend</h3>

          <Line
            data={{
              labels: ["Flowrate", "Pressure", "Temperature"],
              datasets: [
                {
                  label: "Averages",
                  data: [
                    selectedDataset.summary.avg_flowrate,
                    selectedDataset.summary.avg_pressure,
                    selectedDataset.summary.avg_temperature,
                  ],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: true } },
            }}
          />
        </div>
      ) : (
        <p>No dataset selected.</p>
      )}
    </div>
  );
}

// SIMPLE STYLES
const thStyle = {
  padding: "10px",
  border: "1px solid #999",
};

const tdStyle = {
  padding: "8px",
  border: "1px solid #ccc",
};

const pdfBtn = {
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer",
  background: "#0066ff",
  color: "white",
  border: "none",
};
