const express = require("express");
const app  = express();

app.use(express.json());  // middleware function that helps parse JSON from requests to javascript object and assign to req.body

//In-memory storage
let products = [{id: 1, name:"vivo", price: 600}];
let currentId = 2;

app.get("/", (req, res)=>{
  res.send("Welcome to the Home Page.")
})

// create product
app.post("/products", (req, res)=>{
  const body = req.body;

  const createProducts = ({name,price}) => {
    if (!name || !price) {
      return res.status(400).json({message: "Name and price are required"});
    }

    const product = {id: currentId++, name, price}
    products.push(product);
  }
  
  if (Array.isArray(body)){
    body.forEach(createProducts)
  }else{
    createProducts(body)
  }

  res.status(201).json(products.filter((pr => body.map((p=> p.name)).includes(pr.name))));  
  });
  



//Get all products
app.get('/products', (req, res)=>{
  res.json(products);
})

//Get products by id
app.get('/products/:id', (req, res)=>{
  const id = parseInt(req.params.id)
  const product = products.find(prod => prod.id === id);

  if (!products){
    return res.status(404).json({message: "Product not found!"})
  }

  res.json(product);

})


//Update Product
app.put('/products/:id', (req, res)=>{
  const id = parseInt(req.params.id)
  const {name, price} = req.body
  const product = products.find(prod => prod.id === id);
  
  console.log({name, price})
  if (!product){
    return res.status(404).json({message: "Product not found!"})
  }

  if (name) product.name = name 
  if (price) product.price = price
  
  res.json(products);

})

// Deleting a product
app.delete('/products/:id', (req, res)=>{
  const id = parseInt(req.params.id)
  const index = products.findIndex(prod => prod.id === id);

  if (index === -1) {
    return res.status(404).json({message: "Product not found"});
  }
  const deletedProduct = products.splice(index, 1)
  res.json(deletedProduct)

})

const PORT = 3000
app.listen(PORT, ()=>{console.log(`server listening at port ${PORT}...`)})