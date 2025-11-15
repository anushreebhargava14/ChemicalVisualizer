import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export default function Record() {
  const [datasets, setDatasets] = useState([]);

  // Fetch datasets from Django API
  const fetchDatasets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/datasets/`);
      if (!response.ok) throw new Error("Failed to fetch datasets");
      const data = await response.json();
      setDatasets(data);
    } catch (error) {
      console.error("Error loading datasets:", error);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>📁 Uploaded Dataset History</h3>

      {datasets.length === 0 ? (
        <p>No datasets uploaded yet.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            textAlign: "left",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th>File Name</th>
              <th>Uploaded At</th>
              <th>Total Equipments</th>
              <th>Avg Flowrate</th>
              <th>Avg Pressure</th>
              <th>Avg Temperature</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map((d) => (
              <tr key={d.id}>
                <td>{d.filename}</td>
                <td>{new Date(d.uploaded_at).toLocaleString()}</td>
                <td>{d.summary?.total_count ?? "N/A"}</td>
                <td>{d.summary?.avg_flowrate?.toFixed(2) ?? "N/A"}</td>
                <td>{d.summary?.avg_pressure?.toFixed(2) ?? "N/A"}</td>
                <td>{d.summary?.avg_temperature?.toFixed(2) ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
