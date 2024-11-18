var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../public/products.json'); 
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la lecture du fichier products.json' });
        }

        try {
            const products = JSON.parse(data); 
            res.json(products); 
        } catch (parseError) {
            console.error(parseError);
            res.status(500).json({ error: 'Erreur de parsing du fichier JSON' });
        }
    });
});


router.get('/:id', (req, res) => {
    const filePath = path.join(__dirname, '../public/products.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la lecture du fichier products.json' });
        }

        try {
            const products = JSON.parse(data); 
            const productId = req.params.id.toUpperCase(); 
            const product = products[productId]; 

            if (!product) {
                return res.status(404).json({ error: 'Produit non trouvé' });
            }

            res.json(product); 
        } catch (parseError) {
            console.error('Erreur de parsing JSON:', parseError);
            res.status(500).json({ error: 'Erreur de parsing du fichier JSON' });
        }
    });
});



router.get('/:id/:qt', (req, res) => {
    const filePath = path.join(__dirname, '../public/products.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la lecture du fichier products.json' });
        }

        try {
            const products = JSON.parse(data); 
            const productId = req.params.id.toUpperCase(); 
            const quantity = parseInt(req.params.qt, 10); 
            const product = products[productId]; 
            if (!product) {
                return res.status(404).json({ error: 'Produit non trouvé' });
            }

            if (isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ error: 'Quantité invalide' });
            }

            const totalPrice = product.price * quantity;
            res.json({ 
                productId,
                quantity,
                unitPrice: product.price,
                totalPrice: totalPrice.toFixed(2) 
            });
        } catch (parseError) {
            console.error('Erreur de parsing JSON:', parseError);
            res.status(500).json({ error: 'Erreur de parsing du fichier JSON' });
        }
    });
});



router.get('/instock/:qt', (req, res) => {
    const filePath = path.join(__dirname, '../public/products.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la lecture du fichier products.json' });
        }

        try {
            const products = JSON.parse(data); 
            const minStock = parseInt(req.params.qt, 10); 

            if (isNaN(minStock) || minStock <= 0) {
                return res.status(400).json({ error: 'Quantité invalide' });
            }

            const inStockProducts = Object.values(products).filter(product => product.stock >= minStock);

            if (inStockProducts.length === 0) {
                return res.status(404).json({ error: 'Aucun produit en stock avec cette quantité' });
            }

            res.json(inStockProducts);
        } catch (parseError) {
            console.error('Erreur de parsing JSON:', parseError);
            res.status(500).json({ error: 'Erreur lors de l\'analyse du fichier JSON' });
        }
    });
});

module.exports = router;
