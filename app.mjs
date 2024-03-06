import express from "express";
import cache from "./cache.mjs";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// add product stock - request body should contain a IdProduct, NameProduct and an Stock
app.post("/product/stock", (req, res) => {
  const { IdProduct, NameProduct , Stock } = req.body;
  if (!IdProduct || !NameProduct || !Stock) {
    return res.status(400).json({ error: "IdProduct, NameProduct or Stock is empty" });
  }
  const value = { IdProduct, NameProduct , Stock };
  cache.set(IdProduct, value, 86400);
  return res.status(201).json({ IdProduct, NameProduct , Stock });
});


// update stock of a product by IdProduct
app.put("/product/stock", (req, res) => {
  const { IdProduct , Stock } = req.body;
  if (!IdProduct || !Stock) {
    return res.status(400).json({ error: "IdProduct or Stock is empty" });
  }
  const value = cache.get(IdProduct);
  value.Stock = Stock;
  cache.set(IdProduct, value);
  return res.json({ IdProduct, Stock });
});


// get the list of products with stock
app.get("/product/stock", (_, res) => {
  const keys = cache.keys();
  const allData = [];
  for (const key of keys) {
    allData.push(cache.get(key));
  }
  return res.json(allData);
});

// get a product stock by IdProduct
app.get("/product/stock/:IdProduct", (req, res) => {
  const IdProduct = req.params.IdProduct;
  if (!IdProduct || typeof IdProduct !== "string") {
    return res.status(400).json({ error: "missing or invalid IdProduct" });
  }
  if (!cache.has(IdProduct)) {
    return res.status(404).json({ error: "IdProduct does not exist" });
  }
  const value = cache.get(IdProduct);
  return res.json(value);
});

// health check
app.get("/healthz", (_, res) => {
  return res.sendStatus(200);
});

app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500);
  res.json({ error: err.message });
});

app.use("*", (_, res) => {
  return res
    .status(404)
    .json({ error: "the requested resource does not exist on this server" });
});

export default app;
