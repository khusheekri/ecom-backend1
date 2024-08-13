const port =5500;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt= require("jsonwebtoken");
const multer = require("multer"); 

const path = require("path"); // get access to backend
const cors = require("cors"); 


app.use(express.json()); //req automatically pass through json
app.use(cors()); //frontend connect to backend

//database connection with mongoDB
mongoose.connect("mongodb+srv://khusheesingh6:password04@cluster0.xtln1.mongodb.net/ecomm-backend").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});//removed some old repo and shit

//api creation
app.get("/", (req, res) => {
    res.send("express app is running");
});

// image storage

const storage = multer.diskStorage({
    destination: './uploads/images',
    filename:(req,file,cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const uploads = multer({storage: storage}); //upload function

// creating upload endpoint for image
app.use('/images', express.static('uploads/images')); // created static endpoint

app.post("/uploads", uploads.single('product'), (req, res) => {
     res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`  //using this url we can access the uploaded image
    });
});

// schema for creating products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
        unique: true // Ensures no duplicate product IDs
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

app.post('/addproduct', async (req, res) => {
 
    try {
        const product = new Product({  
            id: req.body.id,
            name: req.body.name,
            category: req.body.category,
            price: req.body.price
        });

        // Save the product to the database
        await product.save();

        console.log("Product saved successfully:", product);

        // Respond with success
        res.json({
            success: true,
            name: req.body.name
        });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({
            success: false,
            error: "An error occurred while saving the product."
        });
    }
});



// creating api for getting all products
app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

app.listen(port, (error) => {
    if (!error) {
        console.log("server running on port " + port);
    } else {
        console.log("error: " + error);
    }
});