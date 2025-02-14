import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [urlList, setUrlList] = useState([]); // State to store all URL objects with analytics

  // Function to shorten the URL
  const handleShortenUrl = async () => {
    try {
      const response = await fetch("http://localhost:8000/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setShortenedUrl(`http://localhost:8000/url/${data.shortId}`);
      fetchAllUrls(); // Refresh the URL list after shortening a new one
    } catch (err) {
      console.error(err.message);
    }
  };

  // Function to fetch analytics for a specific shortened URL
  const fetchAnalytics = async (shortId) => {
    try {
      const response = await fetch(`http://localhost:8000/url/analytics/${shortId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.totalClicks; // Return the click count for this URL
    } catch (err) {
      console.error(err.message);
      return 0; // Default to 0 if there's an error
    }
  };

  // Function to fetch all URL objects and update them with click analytics
  const fetchAllUrls = async () => {
    try {
      const response = await fetch("http://localhost:8000/url");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("The URL LIst: ", data);

      // Fetch analytics for each URL and merge it with the URL object
      const urlsWithAnalytics = await Promise.all(
        data.map(async (urlObj) => {
          const clicks = await fetchAnalytics(urlObj.shortId);
          return { ...urlObj, clicks };
        })
      );

      setUrlList(urlsWithAnalytics); // Update state with URLs and analytics
    } catch (err) {
      console.error(err.message);
    }
  };

  // Fetch all URL objects when the component mounts
  useEffect(() => {
    fetchAllUrls();
  }, []);

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-100 rounded-xl shadow-md">
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

      {/* List of All URLs */}
      {urlList.length > 0 && (
        <div className="w-full p-4 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">All Shortened URLs</h2>
          <ul className="space-y-2">
            {urlList.map((urlObj) => (
              <li
                key={urlObj.shortId}
                className="flex justify-between items-center bg-white p-2 border rounded-lg"
              >
                <p>
                  <span className="font-semibold">Original URL:</span>{" "}
                  {urlObj.redirectURL}
                </p>
                <a
                  href={`http://localhost:8000/url/${urlObj.shortId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {`http://localhost:8000/url/${urlObj.shortId}`}
                </a>
                <span className="text-gray-600">{urlObj.clicks} clicks</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
