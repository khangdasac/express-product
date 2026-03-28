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
            req.session.message = { type: "danger", text: "Error" };
            return res.redirect("/");
        }
    },

    filter: async (req, res) => {
        try {
            const { type } = req.query;
            const items = await Model.filter(type);
            return res.render("index", { items });

        } catch (error) {
            req.session.message = { type: "danger", text: "Error" };
            return res.redirect("/");
        }
    },

    detail: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Model.getById(id);
            if (!item) {
                req.session.message = { type: "warning", text: "Not found" };
                return res.redirect("/");
            }
            res.render("detail", { item });
        } catch (error) {
            req.session.message = { type: "danger", text: "Error" };
            return res.redirect("/");
        }
    },

    create: async (req, res) => {
        try {
            const data = req.body;
            const image = await uploadFile(req.file);
            data.image = image;

            const errors = validatePayload(data, false);
            if (errors) {
                req.session.message = {
                    type: "danger",
                    text: errors.join(", ")
                };
                return res.redirect("/");
            }
            await Model.create(data);
            req.session.message = { type: "success", text: "Successfully" };
            res.redirect("/");
        } catch (error) {
            console.error(error);
            req.session.message = { type: "danger", text: "Error" };
            res.redirect("/");
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
            req.session.message = { type: "success", text: "Successfully" };
            res.redirect("/");
        } catch (error) {
            req.session.message = { type: "danger", text: "Error" };
            res.redirect("/");
        }
    },

    edit: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Model.getById(id);
            if (!item) {
                req.session.message = { type: "warning", text: "Not found" };
                return res.redirect("/");
            }
            res.render("edit", { item });
        } catch (error) {
            req.session.message = { type: "danger", text: "Error" };
            return res.redirect("/");
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Model.getById(id);
            if (!item) {
                req.session.message = { type: "warning", text: "Not found" };
                return res.redirect("/");
            }
            const data = req.body;
            const errors = validatePayload(data, true);
            if (errors) {
                req.session.message = { type: "danger", text: errors.join(", ") };
                return res.redirect("/" + id);
            }
            const image = req.file;
            let imageUrl = item.image;
            if (image) {
                imageUrl = await uploadFile(image);
                await deleteFile(item.image);
            }
            await Model.update(id, { ...data, image: imageUrl });
            req.session.message = { type: "success", text: "Successfully" };
            res.redirect("/");
        } catch (error) {
            console.error(error);
            req.session.message = { type: "danger", text: "Error" };
            res.redirect("/");
        }
    }
};

module.exports = Controller;