const ProductModel = require("../models");

const Controller = {
    search: async (req, res) => {
        try {
            const { keyword } = req.query;
            const products = await ProductModel.search(keyword);
            return res.render("index", { products });
            
        } catch (error) {
            console.log(error);
            res.status(500).send("Error getting products");
        }
    },
};

module.exports = Controller;