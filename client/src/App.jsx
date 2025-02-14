import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [urlList, setUrlList] = useState([]);

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

      const urlsWithAnalytics = await Promise.all(
        data.map(async (urlObj) => {
          const clicks = await fetchAnalytics(urlObj.shortId);
          return { ...urlObj, clicks };
        })
      );

      setUrlList(urlsWithAnalytics);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Fetch all URL objects when the component mounts
  useEffect(() => {
    fetchAllUrls();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 flex flex-col items-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">URL Shortener</h1>

        {/* Input Field */}
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your URL here"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleShortenUrl}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
          >
            Shorten URL
          </button>
        </div>

      </div>

      {/* List of All URLs */}
      {urlList.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">All Shortened URLs</h2>
          <ul className="space-y-4">
            {urlList.map((urlObj) => (
              <li
                key={urlObj.shortId}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-800">Original:</span> {urlObj.redirectURL}
                  </p>
                  <a
                    href={`http://localhost:8000/url/${urlObj.shortId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {`http://localhost:8000/url/${urlObj.shortId}`}
                  </a>
                </div>
                <span className="ml-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {urlObj.clicks} clicks
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
