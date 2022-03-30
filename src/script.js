const { Router } = require("express");
const router = Router();
const { json, urlencoded } = require("express");

class ApiProducts {
  constructor() {
    this.products = [
      {
        title: "Escuadra",
        price: 123.45,
        thumbnail:
          "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
        id: 1,
      },
      {
        title: "Calculadora",
        price: 234.56,
        thumbnail:
          "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
        id: 2,
      },
      {
        title: "Globo Terráqueo",
        price: 345.67,
        thumbnail:
          "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
        id: 3,
      },
    ];

    router.use(json());
    router.use(urlencoded({ extended: true }));

    this.showProducts();
    this.showProduct();
    this.router = router;
  }

  showProducts() {
    const products = this.products;
    router
      .route("/")
      .get((req, res) => {
        res.render("table", { products });
      })
      .post((req, res) => {
        const newProduct = req.body;
        newProduct.price = parseInt(newProduct.price);

        if (!this.products.length) {
          newProduct.id = 1;
        } else {
          newProduct.id = this.products.at(-1).id + 1;
        }

        this.products.push(newProduct);
        res.render("table", { products });
      });
  }

  showProduct() {
    router
      .route("/:id")
      .get((req, res) => {
        const product = this.products.find(
          (product) => product.id == req.params.id
        );

        if (product) {
          res.json(product);
        } else {
          res.json({ error: "producto no encontrado" });
        }
      })
      .put((req, res) => {
        const product = this.products.find(
          (product) => product.id == req.params.id
        );

        if (product) {
          this.products = this.products.filter(
            (product) => product.id != req.params.id
          );

          this.products.push(req.body);
          console.log(this.products);
          res.json(
            `El producto con el id:${req.params.id} ha sido actualizado`
          );
        } else {
          res.json({ error: "producto no encontrado" });
        }
      })
      .delete((req, res) => {
        const product = this.products.find(
          (product) => product.id == req.params.id
        );
        if (product) {
          this.products = this.products.filter(
            (product) => product.id != req.params.id
          );

          console.log(this.products);

          res.json(`El producto con el id:${req.params.id} ha sido eliminado`);
        } else {
          res.json({ error: "producto no encontrado" });
        }
      });
  }
}

const api = new ApiProducts();

module.exports = api;
