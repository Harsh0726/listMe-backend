const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

const express = require("express");
const { connectToDb, getDb } = require("./db");

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// mongoose.connect(process.env.MONGO_URL)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.error("Error connecting to MongoDB:", error);
//   });

// mongoose.connection.on('error', (err) => {
//   console.error('MongoDB connection error:', err);
// });

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

const productList = [];
const feedbackData = [];

// Declare db in the outer scope
let db;

// Middleware to check if the database connection is ready
app.use((req, res, next) => {
  if (!getDb()) {
    return res.status(500).json({ error: "Database connection is not ready" });
  }
  next();
});

// connect to the server
app.listen(3000, () => {
  console.log("Connected to server at 3000");
});

// post api

app.post("/api/add_product", (req, res) => {
  console.log("Result", req.body);

  // const itemArray = req.body.items.map(item => {
  //     return {
  //         "pname": item,
  //         "pimage": item,
  //         "pprice": item,
  //         "pquantity": item,
  //     }
  // })

  const pdata = {
    // "id": productList.length + 1,
    lTitle: req.body.ltitle,
    items: req.body.items,
    id: req.body.id,
  };

  // productList.push(pdata);
  // console.log("Final", pdata);

  res.status(200).send({
    status_code: 200,
    message: "Product added successfully",
    product: pdata,
  });

  // Save pdata to the SavedLists collection
  const savedListsCollection = getDb().collection("SavedLists");
  savedListsCollection.insertOne(pdata);
});

//post api for feedback
app.post("/api/add_feedback", (req, res) => {
  console.log("Request Body:", req.body);

  const pdata = {
    id: feedbackData.length + 1,
    // "pfeedback": req.body.pfeedback,

    pfeedback: req.body.pfeedback,

    // "pfeedback": req.body.pdata,
  };

  feedbackData.push(pdata);
  console.log("Final", pdata);

  res.status(200).send({
    status_code: 200,
    message: "Feedback added successfully",
    feedback: pdata,
  });
});

// get Api

// app.get("/api/get_product", (req, res) => {

//     if (productList.length > 0) {
//         res.status(200).send({
//             'status_code': 200,
//             'products': productList
//         });
//     } else {
//         res.status(200).send({
//             'status_code': 200,
//             'products': []

//         })

//     }
// })
app.get("/api/get_product", async (req, res) => {
  const savedListsCollection = getDb().collection("SavedLists");
  try {
    const products = await savedListsCollection.find({}).toArray();
    res.status(200).json({
      status_code: 200,
      products: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Could not fetch the products" });
  }
});

// check connect to the database
connectToDb((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err);
  } else {
    console.log("Connected to the database successfully.");

    db = getDb();
  }
});

// suggestions

app.get("/api/items", async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || ""; // Get user input from query parameter
    const db = getDb();
    // Use a regular expression to perform a case-insensitive search on the item_name field
    const items = await db
      .collection("items")
      .find({ item_name: { $regex: new RegExp(searchTerm, "i") } })
      .sort({ item_name: 1 })
      .toArray();
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Could not fetch the documents" });
  }
});

// POST route for adding items
// app.post('/api/items', (req, res) => {

//     const item = req.body;

//     db.collection('items')
//         .insertOne(item)
//         .then(result => {
//             res.status(201).json(result);
//         })
//         .catch(err => {
//             res.status(500).json({ err: 'Could not create a new document' });
//         });
// });

// update api
app.post("/api/update/:id", (req, res) => {
  let id = req.params.id * 1;
  let productToUpdate = productList.find((p) => q.id === id);
  let index = productList.indexOf(productToUpdate);

  productList[index] = req.body;
});

//delete api

app.post("/api/delete/:id", (req, res) => {
  let pid = req.params.id;
  console.log(pid);

  try {
    const savedListsCollection = getDb().collection("SavedLists");
    savedListsCollection.deleteOne({ id: pid });
  } catch (error) {
    console.log(error);
  }

  res.status(200).send({
    status: "success",
    message: "product deleted",
  });
  console.log("Delete data", res.data);
});

// Delete API - Harsh
// app.post("/api/delete/:id", async (req, res) => {
//     const id = parseInt(req.params.id);

//     // Get the SavedLists collection
//     const savedListsCollection = getDb().collection('SavedLists');

//     try {
//         // Find and delete the document with the matching ID
//         const result = await savedListsCollection.deleteOne({ id : id});

//         if (result.deletedCount === 1) {
//             // Document was deleted successfully
//             res.status(200).send({
//                 status: 'success',
//                 message: 'Product deleted'
//             });
//         } else {
//             // No matching document found
//             res.status(404).send({
//                 status: 'error',
//                 message: 'Product not found'
//             });
//         }
//     } catch (error) {
//         console.error('Error deleting product:', error);
//         res.status(500).send({
//             status: 'error',
//             message: 'Internal server error'
//         });
//     }
//     console.log("Delete data",id);
// });
