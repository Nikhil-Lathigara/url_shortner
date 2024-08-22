const express = require('express')
const path = require('path')
const { connectToMongoDB } = require("./connect")
const urlRoute = require('./routes/url')
const staticRouter = require('./routes/staticRouter')
const URL = require('./models/url')
const app = express();
const port = 8001;

connectToMongoDB('mongodb://localhost:27017/shortUrl').then(() => console.log("connected to mongoDB"))

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/test",async(req,res)=>{
    const allUrls=await URL.find({});
    return res.render("home",{
        urls:allUrls,
    })
})

app.use("/url", urlRoute)
app.use("/", staticRouter)

app.get("/url/:shortId", async(req, res) => {
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