import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file for styles

const App = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [treatment, setTreatment] = useState(''); // State to hold the treatment message

  // Hardcoded treatment for early blight
  const earlyBlightTreatment = "Apply fungicide, such as Mancozeb or Chlorothalonil. Ensure proper crop rotation and remove infected leaves.";

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
    setResult(null); // Reset result when a new image is selected
    setError(''); // Reset error message
    setTreatment(''); // Reset treatment message
  };

  const uploadImage = async () => {
    if (!image) return; // Prevent upload if no image is selected
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const prediction = response.data;
      setResult(prediction);

      // Check if the prediction is "early blight" and show the treatment
      if (prediction.class === 'early blight') {
        setTreatment(earlyBlightTreatment);
      } else {
        setTreatment(''); // Clear treatment for other predictions
      }

    } catch (error) {
      setError('Failed to upload image. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="app-container">
      <h1>Potato Leaf Disease Prediction</h1>
      <input type="file" onChange={handleImageUpload} />
      <button onClick={uploadImage}>Upload Image</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div>
          <p>Disease: {result.class}</p>
          <p>Confidence: {result.confidence}</p>

          {/* Display treatment if it's available */}
          {treatment && (
            <div>
              <h3>Treatment for Early Blight:</h3>
              <p>{treatment}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
