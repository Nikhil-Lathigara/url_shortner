const express = require('express')
const { connectToMongoDB } = require("./connect")
const urlRoute = require('./routes/url')
const URL = require('./models/url')
const app = express();
const port = 8001;

connectToMongoDB('mongodb://localhost:27017/shortUrl').then(() => console.log("connected to mongoDB"))

app.use(express.json())
app.use("/url", urlRoute)

app.get("/:shortId", async(req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        },
    })
    res.redirect(entry.redirectURL)
})


app.listen(port, () => {
    console.log(`server started at port ${port}`);
})