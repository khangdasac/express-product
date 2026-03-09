const ProductModel = require("../models/index");

const Controller = {
    getAll: async (req, res) => {
        try {
            const products = await ProductModel.getAll();
            return res.status(200).json(products);
        } catch (error) {
            console.log(error);
            res.status(500).send("Error getting products");
        }
    },

    getOne: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await ProductModel.getOne(id);
            if (product) {
                return res.status(200).json(product);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Error getting product");
        }
    }
};

module.exports = Controller;
