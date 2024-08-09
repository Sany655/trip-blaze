// server with Express

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// api endpoints to get data
app.get('/api', (req, res) => {
    // simulate a delay
    setTimeout(() => {
        res.json({ message: 'Data 1 received' });
    }, 2000);
});

app.listen(port, () => console.log(`Server running on port ${port}`));

