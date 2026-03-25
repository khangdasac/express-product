const ProductModel = require("../models");
const { uploadFile, deleteFile } = require("../services/file.service");
const { validatePayload } = require("../utils/validate");

const Controller = {
    search: async (req, res) => {
        try {
            const { keyword } = req.query;
            const products = await ProductModel.search(keyword);
            return res.render("index", { products });

        } catch (error) {
            res.status(500).send("Error getting products");
        }
    },
    create: async (req, res) => {
        try {
            const data = req.body;
            const image = await uploadFile(req.file);
            data.image = image;

            const errors = validatePayload(data, false);
            if (errors) {
                res.send(errors.join(", "));
            }
            await ProductModel.create(data);
            res.redirect("/products");
        } catch (error) {
            res.status(500).send("Error creating product");
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await ProductModel.delete(id);
            res.redirect("/products");
        } catch (error) {
            res.status(500).send("Error deleting product");
        }
    },
    edit: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await ProductModel.getById(id);
            if (!product) {
                return res.status(404).send("Product not found");
            }
            res.render("edit", { product });
        } catch (error) {
            res.status(500).send("Error getting product");
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await ProductModel.getById(id);
            if (!product) {
                return res.status(404).send("Product not found");
            }
            const data = req.body;
            const errors = validatePayload(data, true);
            if (errors) {
                res.send(errors.join(", "));
            }
            const image = req.file;
            let imageUrl;
            if (image) {
                imageUrl = await uploadFile(image);
                await deleteFile(product.image);
            }
            await ProductModel.update(id, { ...data, image: imageUrl });
            res.redirect("/products");
        } catch (error) {
            res.status(500).send("Error updating product");
        }
    }
};

module.exports = Controller;