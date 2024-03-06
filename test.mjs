import chai from "chai";
import chaiHttp from "chai-http";
import app from "./app.mjs";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Product List API", () => {
  describe("POST /product/stock", () => {
    it("should add a product stock to the product list", async () => {
      const newProduct = {
        "IdProduct": 123,
        "NameProduct": "IPhone 15",
        "Stock": 1000
      };
      const request = chai.request(app);
      const res = await request.post("/product/stock").send(newProduct);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("IdProduct");
      expect(res.body.NameProduct).to.equal(newProduct.NameProduct);
      expect(res.body.Stock).to.equal(newProduct.Stock);
    });
  });

  describe("PUT /product/stock", () => {
    it("should update the stock of a product", async () => {
      const newProduct = {
        "IdProduct": 124,
        "NameProduct": "IPhone 15 Pro",
        "Stock": 1000
      };
      const requestOne = chai.request(app);
      const addRes = await requestOne.post("/product/stock").send(newProduct);

      const requestTwo = chai.request(app);
      const updateRes = await requestTwo
        .put(`/product/stock`)
        .send({
          "IdProduct": 124,
          "Stock": 100
        });

      expect(updateRes).to.have.status(200);
      expect(updateRes.body.IdProduct).to.equal(addRes.body.IdProduct);
      expect(updateRes.body.Stock).to.equal(100);
    });

  });

  describe("GET /product/stock/:IdProduct", () => {
    it("should return a product by IdProduct", async () => {
      const newProduct = {
        "IdProduct": 125,
        "NameProduct": "IPhone 14 Pro",
        "Stock": 100
      };
      const requestOne = chai.request(app);
      const addRes = await requestOne.post("/product/stock").send(newProduct);

      const requestTwo = chai.request(app);
      const res = await requestTwo.get(
        `/product/stock/${addRes.body.IdProduct}`
      );

      expect(res).to.have.status(200);
      expect(res.body.IdProduct).to.equal(addRes.body.IdProduct);
      expect(res.body.NameProduct).to.equal(addRes.body.NameProduct);
      expect(res.body.Stock).to.equal(addRes.body.Stock);
    });

  });
});
