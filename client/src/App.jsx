import React, { useState } from "react";
import './App.css'

function App() {

  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [clicks, setClicks] = useState(0);

  // Function to handle URL shortening
  const handleShortenUrl = () => {
    if (url.trim() === "") {
      alert("Please enter a valid URL");
      return;
    }

    // Mock API call to "shorten" the URL
    const mockShortUrl = `https://short.ly/${Math.random().toString(36).substring(7)}`;
    setShortenedUrl(mockShortUrl);

    // Reset click count for new shortened URL
    setClicks(0);

    // Clear input
    setUrl("");
  };

  // Function to simulate a click on the shortened URL
  const handleSimulateClick = () => {
    setClicks(clicks + 1);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-100 rounded-xl shadow-md w-96">
      <h1 className="text-xl font-semibold">URL Shortener</h1>

      {/* Input Field */}
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter your URL here"
        className="w-full p-2 border border-gray-300 rounded-lg"
      />

      {/* Shorten Button */}
      <button
        onClick={handleShortenUrl}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Shorten URL
      </button>

      {/* Display Shortened URL */}
      {shortenedUrl && (
        <div className="w-full p-4 bg-white rounded-lg shadow-md">
          <p className="font-medium">Shortened URL:</p>
          <a
            href={shortenedUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSimulateClick}
            className="text-blue-500 hover:underline"
          >
            {shortenedUrl}
          </a>
        </div>
      )}

      {/* Display Click Count */}
      {shortenedUrl && (
        <div className="w-full p-4 bg-gray-200 rounded-lg">
          <p className="text-sm font-medium">
            Total Clicks: <span className="text-blue-500">{clicks}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default App
