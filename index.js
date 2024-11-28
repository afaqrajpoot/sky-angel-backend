const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());
app.use(cors())
// Path to the JSON file where data will be stored
const FILE_PATH = path.join(__dirname, 'rankings.json');

// Function to read rankings from the file
const readRankings = () => {
        try {
                if (fs.existsSync(FILE_PATH)) {
                        const data = fs.readFileSync(FILE_PATH, 'utf-8');
                        return JSON.parse(data);
                }
                return [];
        } catch (error) {
                console.error('Error reading file:', error);
                return [];
        }
};

// Function to write rankings to the file
const writeRankings = (rankings) => {
        try {
                fs.writeFileSync(FILE_PATH, JSON.stringify(rankings, null, 2));
        } catch (error) {
                console.error('Error writing file:', error);
        }
};

// POST route to register user flight data
app.post('/register', (req, res) => {
        const { name, time, stars } = req.body;

        // Validate the inputs
        if (!name || typeof time !== 'number' || typeof stars !== 'number') {
                return res.status(400).json({ error: 'Invalid input data' });
        }

        // Read current rankings from the file
        const rankings = readRankings();

        // Create a new entry
        const newEntry = {
                id: rankings.length + 1, // Auto-increment ID
                name,
                time: String(time), // Convert to string to match example JSON
                stars: String(stars),
        };

        // Add the new entry to the rankings
        rankings.push(newEntry);

        // Write updated rankings to the file
        writeRankings(rankings);

        // Return updated rankings
        res.status(200).json({
                data: rankings
        });
});

// Start the server
app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
});
