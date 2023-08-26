import React from "react";

function SubmitButton({ annotations }) {
  const handleDownload = () => {
    const json = JSON.stringify(annotations, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "annotations.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return <button onClick={handleDownload}>Submit</button>;
}

export default SubmitButton;