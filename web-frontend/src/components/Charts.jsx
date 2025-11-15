import React from "react";

export default function Charts({ typeDistribution }) {
  if (!typeDistribution) return null;

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Equipment Type Distribution</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Type</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(typeDistribution).map(([type, count]) => (
            <tr key={type}>
              <td>{type}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
