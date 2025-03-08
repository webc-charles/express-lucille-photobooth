const express = require('express');
const path = require('path');
const s3Service = require('./services/s3Service');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, './views'));

app.use('/public', express.static(path.join(__dirname, '../public')));

app.get('/', async (_, res) => {
    const images = await s3Service.getImages();

    res.render('main', { images });
});

app.get('/api/images', async (_, res) => {
    const images = await s3Service.getImages();

    console.log({images});

    res.json(images);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
