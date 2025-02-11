const express = require('express')
const connectToMongoDB = require('./database')
const URLRoute = require('./routes/url')
const URL = require('./models/url')
const app = express();
const PORT = 8000;

connectToMongoDB("mongodb://localhost:27017/url-shortener")
.then(() => { console.log("Connected to Database") })
.catch((error) => { console.log("Error: ", error) })

app.use(express.json());

app.use("/url", URLRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHisotry: {
                    timestamp: Date.now()
                },
            },
        }
    );

    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
})