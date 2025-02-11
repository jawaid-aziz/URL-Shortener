const express = require('express')
const connectToMongoDB = require('./database')
const URLRoute = require('./routes/url')
const app = express();
const PORT = 8000;

connectToMongoDB("mongodb://localhost:27017/url-shortener")
.then(() => { console.log("Connected to Database") })
.catch((error) => { console.log("Error: ", error) })

app.use(express.json());

app.use("/url", URLRoute);

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
})