import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa"; // Camera icon

function App() {
  const [customerNumber, setCustomerNumber] = useState("");
  const [status, setStatus] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const webcamRef = useRef(null);

  // Handle normal SMS delivery form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Uploading...");
    try {
      const response = await fetch("https://driver-dashboard-backend.onrender.com/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerNumber }),
      });
      const data = await response.json();
      if (data.success) {
        setStatus("Delivery confirmed and notifications sent!");
        setCustomerNumber("");
      } else {
        setStatus("There was an error: " + (data.error || "unknown error"));
      }
    } catch (error) {
      setStatus("Failed to submit: " + error.message);
    }
  };

  // Open camera
  const handleCameraOpen = () => {
    setShowCamera(true);
    setCapturedPhoto(null);
    setStatus("");
  };

  // Capture photo
  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedPhoto(imageSrc);
    }
  };

  // Retry
  const handleRetry = () => {
    setCapturedPhoto(null);
    setStatus("");
  };

  // Submit photo to backend
  const handlePhotoSubmit = async () => {
    if (!capturedPhoto) return;
    setStatus("Uploading photo...");
    // Convert base64 to Blob
    const res = await fetch(capturedPhoto);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append("photo", blob, "delivery-photo.jpg");
    try {
      const response = await fetch("https://driver-dashboard-backend.onrender.com/api/upload-photo", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setStatus("Photo uploaded successfully!");
        setShowCamera(false);
      } else {
        setStatus("Error uploading photo: " + (data.error || "unknown error"));
      }
    } catch (err) {
      setStatus("Photo upload failed: " + err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "linear-gradient(120deg, #fff 0%, #ffd6d6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "36px",
          boxShadow: "0 10px 50px 0 rgba(190,34,44,0.15)",
          padding: "56px 36px 48px 36px",
          maxWidth: 440,
          width: "100%",
          margin: "48px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <h1
          style={{
            color: "#BE222C",
            fontWeight: 800,
            fontSize: "2.3rem",
            letterSpacing: 0,
            marginBottom: 8,
            fontFamily: "inherit",
            textAlign: "center",
          }}
        >
          Kterings Krier
        </h1>
        <h2
          style={{
            color: "#BE222C",
            fontWeight: 600,
            fontSize: "1.25rem",
            marginBottom: 38,
            marginTop: 0,
            textAlign: "center",
            opacity: 0.85,
          }}
        >
          Delivery Dashboard
        </h2>
        {/* Camera Icon */}
        <button
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            background: "#fff4f4",
            border: "none",
            borderRadius: "50%",
            padding: 10,
            cursor: "pointer",
            boxShadow: "0 2px 8px 0 rgba(190,34,44,0.13)",
          }}
          title="Take Delivery Photo"
          onClick={handleCameraOpen}
        >
          <FaCamera color="#BE222C" size={22} />
        </button>

        {/* CAMERA MODAL */}
        {showCamera && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.20)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 32,
                borderRadius: 20,
                boxShadow: "0 6px 40px 0 rgba(190,34,44,0.17)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 320,
                minHeight: 380,
              }}
            >
              <h3 style={{ color: "#BE222C", marginBottom: 18 }}>
                {capturedPhoto ? "Preview" : "Take a Photo"}
              </h3>
              {!capturedPhoto ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={300}
                    height={220}
                    videoConstraints={{
                      facingMode: "environment", // Use rear camera on mobile
                    }}
                    style={{
                      borderRadius: 14,
                      background: "#eee",
                      marginBottom: 12,
                    }}
                  />
                  <button
                    onClick={handleCapture}
                    style={{
                      marginTop: 8,
                      padding: "10px 34px",
                      background: "#BE222C",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 14,
                      border: "none",
                      fontSize: "1.05rem",
                      cursor: "pointer",
                      marginBottom: 4,
                    }}
                  >
                    Capture
                  </button>
                  <button
                    onClick={() => setShowCamera(false)}
                    style={{
                      marginTop: 8,
                      padding: "8px 18px",
                      background: "#bbb",
                      color: "#fff",
                      fontWeight: 500,
                      borderRadius: 10,
                      border: "none",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <img
                    src={capturedPhoto}
                    alt="Captured"
                    style={{
                      width: 300,
                      height: 220,
                      objectFit: "cover",
                      borderRadius: 12,
                      marginBottom: 14,
                    }}
                  />
                  <button
                    onClick={handlePhotoSubmit}
                    style={{
                      marginTop: 8,
                      padding: "10px 34px",
                      background: "#27a444",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 14,
                      border: "none",
                      fontSize: "1.07rem",
                      cursor: "pointer",
                      marginBottom: 6,
                    }}
                  >
                    Submit Photo
                  </button>
                  <button
                    onClick={handleRetry}
                    style={{
                      marginTop: 4,
                      padding: "8px 18px",
                      background: "#BE222C",
                      color: "#fff",
                      fontWeight: 500,
                      borderRadius: 10,
                      border: "none",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                    }}
                  >
                    Retry
                  </button>
                </>
              )}
              {status && (
                <div
                  style={{
                    marginTop: 18,
                    color: status.toLowerCase().includes("fail") || status.toLowerCase().includes("error")
                      ? "#BE222C"
                      : "#27a444",
                    fontWeight: 600,
                  }}
                >
                  {status}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Form */}
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <div style={{ marginBottom: 22 }}>
            <label
              style={{
                color: "#BE222C",
                fontWeight: 600,
                marginBottom: 6,
                display: "block",
              }}
            >
              Customer Number:
            </label>
            <input
              type="text"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
              required
              style={{
                width: "95%",
                padding: "13px 16px",
                fontSize: "1.15rem",
                borderRadius: 9,
                border: "1.5px solid #BE222C",
                marginTop: 2,
                outline: "none",
                background: "#fff8f8",
                color: "#7e1a22",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px 0",
              background: "#BE222C",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 16,
              border: "none",
              fontSize: "1.17rem",
              cursor: "pointer",
              boxShadow: "0 2px 12px 0 rgba(190,34,44,0.08)",
              marginTop: 10,
              transition: "background 0.2s",
              letterSpacing: ".01em",
            }}
          >
            Submit
          </button>
        </form>
        <div
          style={{
            marginTop: 32,
            minHeight: 24,
            color: status.includes("error") ? "#BE222C" : "#27a444",
            fontWeight: 600,
            fontSize: "1rem",
            textAlign: "center",
            width: "100%",
          }}
        >
          {!showCamera && status}
        </div>
      </div>
    </div>
  );
}

export default App;
