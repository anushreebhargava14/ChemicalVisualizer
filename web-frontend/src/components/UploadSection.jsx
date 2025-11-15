import React, { useState } from "react";
import { API_BASE_URL } from "../config";

export default function UploadSection({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Upload successful!");
        onUploadComplete(); // refresh summary data
      } else {
        setMessage("Upload failed!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Error occurred while uploading.");
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h3>Upload Equipment CSV</h3>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
}
