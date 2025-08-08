const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = 8080;

app.use((req, res, next) => {
    if (req.url.includes('/css/') || req.url.includes('/js/')) {
        setTimeout(next, 4000);
    } else if (req.url.includes('/fonts/')) {
        setTimeout(next, 2500);
    } else {
        next();
    }
});

app.use('/assets/:dateNow', express.static(path.join(__dirname, 'assets')));

async function renderPageHandler(req, res, next) {
    const pageFile = `${req.params.pageName || 'index'}.html`;

    res.setHeader('Content-Type', 'text/html');

    try {
        let htmlContent = await fs.readFile(path.join(__dirname, 'pages', pageFile), 'utf8');
        const dateNowString = String(Date.now());
        htmlContent = htmlContent.replace(/\$dateNow/g, dateNowString);
        return res.send(htmlContent);
    } catch {
    }

    next(); // processed to Express.js builtin not found handler
}

app.get('/', renderPageHandler);
app.get('/:pageName', renderPageHandler);


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}/with-stylesheet-blocking`);
    console.log(`http://localhost:${PORT}/with-script-blocking`);
});
