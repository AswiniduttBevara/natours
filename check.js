const express = require('express');

const app = express();

// const router = express.Router();

app.get('/api/v1/checks', (req, res) => {
    res.status(200).json({
        status:"success"
    })
})

app.listen(3000, () => {
    console.log('server is listening on 3000');
})