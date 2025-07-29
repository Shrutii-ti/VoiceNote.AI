const express = require('express');
const bodyParser = require('body-parser');
const transcribeRoutes = require('./routes/transcribe');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/transcribe', transcribeRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});