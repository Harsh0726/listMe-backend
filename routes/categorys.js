const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Dummy data for categories
const categories = [
  {
    catname: '',
    price: '',
    urlAvatar: '',
  },
  // Add more categories as needed
];

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route to get categories
app.get('/categories', (req, res) => {
  res.json(categories);
});

// Route to add a new category
app.post('/categories', (req, res) => {
  const newCategory = req.body;
  categories.push(newCategory);
  res.json(newCategory);
});

// Route to handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
