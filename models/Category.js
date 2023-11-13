// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

// // Dummy data for categories
// const categories = [
//   {
//     catname: 'Grocery',
//     price: 5125,
//     urlAvatar: 'assets/images/logo.png',
//   },
//   // Add more categories as needed
// ];

// // Endpoint to get categories
// app.get('/categories', (req, res) => {
//   res.json(categories);
// });

// // Endpoint to add a new category
// app.post('/categories', (req, res) => {
//   const newCategory = req.body;
//   categories.push(newCategory);
//   res.json(newCategory);
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let catagorys = [
  {
    catname: 'Grosery',
    price: 5125,
    urlAvatar: 'assets/images/logo.png',
  },
];

// Get all categories
app.get('/api/categories', (req, res) => {
  res.json(catagorys);
});

// Get a specific category
app.get('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const category = catagorys.find((c, index) => index === id);
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

// Create a new category
app.post('/api/categories', (req, res) => {
  const newCategory = req.body;
  catagorys.push(newCategory);
  res.status(201).json(newCategory);
});

// Update a category
app.put('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedCategory = req.body;

  if (catagorys[id]) {
    catagorys[id] = updatedCategory;
    res.json(updatedCategory);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

// Delete a category
app.delete('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (catagorys[id]) {
    catagorys.splice(id, 1);
    res.json({ message: 'Category deleted successfully' });
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
