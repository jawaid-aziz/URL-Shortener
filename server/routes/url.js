const express = require('express');
const { handleGetAllURLs, handleGenerateNewShortURL, handleRedirectToURL, handleGetAnalytics } = require("../controllers/url");

const router = express.Router();

router.get("/", handleGetAllURLs);

router.post("/", handleGenerateNewShortURL);

router.get("/:shortId", handleRedirectToURL);

router.get("/analytics/:shortId", handleGetAnalytics);
module.exports = router;