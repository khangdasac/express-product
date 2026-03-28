const Model = require("../models");
const { uploadFile, deleteFile } = require("../services/file.service");
const { validatePayload } = require("../validate");

const Controller = {
    search: async (req, res) => {
        try {
            const { keyword } = req.query;
            const items = await Model.search(keyword);
            return res.render("index", { items });

        } catch (error) {
            res.render("index", { error: "Error" });
        }
    },

    filter: async (req, res) => {
        try {
            const { type } = req.query;
            const items = await Model.filter(type);
            return res.render("index", { items });

        } catch (error) {
            res.render("index", { error: "Error" });
        }
    },

    detail: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Model.getById(id);
            if (!item) {
                return res.status(404).send("Item not found");
            }
            res.render("detail", { item });
        } catch (error) {
            res.render("index", { error: "Error" });
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
            await Model.create(data);
            res.redirect("/");
        } catch (error) {
            console.error(error);
            res.render("index", { error: "Error" });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Model.getById(id);
            if (item) {
                await deleteFile(item.image);
            }
            await Model.delete(id);
            res.redirect("/");
        } catch (error) {
            res.render("index", { error: "Error" });
        }
    },
    
    edit: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Model.getById(id);
            if (!item) {
                return res.status(404).send("Item not found");
            }
            res.render("edit", { item });
        } catch (error) {
            res.render("index", { error: "Error" });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Model.getById(id);
            if (!item) {
                return res.status(404).send("Item not found");
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
                await deleteFile(item.image);
            }
            await Model.update(id, { ...data, image: imageUrl });
            res.redirect("/");
        } catch (error) {
            console.error(error);
            res.render("index", { error: "Error" });
        }
    }
};

module.exports = Controller;