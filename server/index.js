import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Grocify API is running');
});

// Search dishes
app.get('/api/search', async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching from TheMealDB:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Get dish by name (using search as TheMealDB doesn't have a direct name lookup other than search)
app.get('/api/dish/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(name)}`);
        const data = await response.json();
        // Return the first match if found
        const meal = data.meals ? data.meals.find(m => m.strMeal.toLowerCase() === name.toLowerCase()) || data.meals[0] : null;
        res.json({ meals: meal ? [meal] : null });
    } catch (error) {
        console.error('Error fetching dish:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
