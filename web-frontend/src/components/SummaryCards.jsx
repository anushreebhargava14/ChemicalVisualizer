import React from "react";

export default function SummaryCards({ summary }) {
  if (!summary) return <p>No summary available yet.</p>;

  const { total_count, avg_flowrate, avg_pressure, avg_temperature } = summary;

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      <div style={{ padding: "15px", border: "1px solid gray", borderRadius: "10px" }}>
        <h4>Total Equipments</h4>
        <p>{total_count}</p>
      </div>
      <div style={{ padding: "15px", border: "1px solid gray", borderRadius: "10px" }}>
        <h4>Average Flowrate</h4>
        <p>{avg_flowrate.toFixed(2)}</p>
      </div>
      <div style={{ padding: "15px", border: "1px solid gray", borderRadius: "10px" }}>
        <h4>Average Pressure</h4>
        <p>{avg_pressure.toFixed(2)}</p>
      </div>
      <div style={{ padding: "15px", border: "1px solid gray", borderRadius: "10px" }}>
        <h4>Average Temperature</h4>
        <p>{avg_temperature.toFixed(2)}</p>
      </div>
    </div>
  );
}
