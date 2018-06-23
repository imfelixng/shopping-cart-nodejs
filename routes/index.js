var express = require('express');
var router = express.Router();

var CategoryModel = require('../models/category.js');
var ProductModel = require('../models/product.js');
var CartModel = require('../models/cart.js');
var CartDetailModel = require('../models/cart_detail.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  ProductModel.find().sort({id : -1}).limit(4).then(products => {
    res.render('index', {products: products});
  });
});

router.get('/menu', (req, res, next) => {
  CategoryModel.find().then(categories => {
    ProductModel.find().then(products => {
      let data = {
        categories,
        products
      }
      res.json(data);
    });

  });
});


router.get('/danh-muc', function(req, res, next) {
  let id = parseInt(req.query.catogery ? req.query.catogery : -1);
  CategoryModel.find().then(categories => {
      if(id !== -1){
        CategoryModel.findOne({id: id}).then(category => {
          ProductModel.find({category_id: id}).sort({id: -1}).then(products => {
            res.render('categories', {catogeries : categories, id: id, products : products, category: category});
          });
        });
      }else{
        ProductModel.find().sort({id : -1}).then(products => {
          res.render('categories', {catogeries : categories, id : id, products : products, category: null});
        });
      }
  });
});



router.get('/chi-tiet-san-pham/:danhmuc/:id', function(req, res, next) {
  let id = req.params.id;
  let status = req.query.buy;

  if(!status){
    ProductModel.findOne({id: id}).then(product => {
      let category_id = product.category_id;
      CategoryModel.find().then(catogeries => {
        ProductModel.find({category_id: category_id}).limit(4).then(productsCatogery => {
          res.render('product_detail', {product: product, catogeries: catogeries, productsCatogery: productsCatogery});
        })
      });
    });
  }else{
    if(status === '1'){

      ProductModel.findOne({id: id}).then(product => {
        let cart = {
          product,
          quantity : 1
        }
        let products = req.cookies.products ? req.cookies.products : [];
        if(products.length > 0){
          let index = findIndex(product.id, products);
          if(index !== -1){
            let quantity = products[index].quantity;
            products[index].quantity = quantity + 1;
          }else{
            products.push(cart);
          }
        }else{
          products.push(cart);
        }
        res.cookie('products',products);
        res.redirect('/gio-hang');
      });

    }
  }
});

router.get('/gio-hang', function(req, res, next) {
  let products = req.cookies.products ? req.cookies.products : [];
  res.render('cart', {products : products});
});

router.get('/gio-hang/buy', (req, res, next) => {
  res.clearCookie('products');
  res.send("Mua hang thanh cong");

});

router.get('/gio-hang/delete/:id', function(req, res, next) {
  let id = parseInt(req.params.id);
  let products = req.cookies.products ? req.cookies.products : [];
  let index = findIndex(id, products);
  if(index !== -1){
    products.splice(index,1);
  }
  res.cookie('products',products);
  res.redirect('/gio-hang');
});

router.post('/gio-hang/change/:id', function(req, res, next) {
  let id = parseInt(req.params.id);
  let quantity = parseInt(req.body.quantity_product);
  quantity  = (quantity <= 0) ? 1 : quantity;
  let products = req.cookies.products ? req.cookies.products : [];
  let index = findIndex(id, products);
  products[index].quantity = quantity;
  res.cookie('products',products);
  res.redirect('/gio-hang');
});

const findIndex = (id, products) => {
  let index = -1;
  products.forEach((cart, i) => {
    if(cart.product.id === id){
      index = i;
    }
  });
  return index;
}




module.exports = router;
