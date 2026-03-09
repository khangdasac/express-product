const ProductModel = require("../models/index");

const Controller = {
    search: async (req, res) => {
        try {
            const { keyword } = req.query;
            const products = await ProductModel.search(keyword);
            return res.status(200).json(products);
        } catch (error) {
            console.log(error);
            res.status(500).send("Error getting products");
        }
    }
};

module.exports = Controller;