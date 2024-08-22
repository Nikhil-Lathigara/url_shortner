const shortid = require('shortid');
const URL = require('../models/url');

async function handleGenerateNewShortUrl(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'url is required' });
    const shortId = shortid.generate();
    await URL.create({
        shortId: shortId, // Ensure this matches the schema field name
        redirectURL: body.url,
        visitHistory: [],
    });
    const allUrls = await URL.find({});
    return res.render('home', { id: shortId, urls: allUrls });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId
    const result = await URL.findOne({ shortId });
    return res.json({
        totatClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    })
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics,
};