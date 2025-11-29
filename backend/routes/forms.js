const express = require("express");
const router = express.Router();
const Form = require("../models/Form");
const auth = require("../middleware/auth"); // use correct middleware file

// CREATE NEW FORM
router.post("/", auth, async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        // Temporary schema for working system
        const schema = {
            title: "Generated Form",
            fields: [
                {
                    label: "Name",
                    type: "text",
                    required: true
                }
            ]
        };

        const form = new Form({
            userId: req.user.id,
            prompt,
            schema,
            summary: prompt.slice(0, 50)
        });

        await form.save();

        res.json({
            message: "Form created!",
            formId: form._id,
            schema
        });

    } catch (err) {
        console.error("FORM CREATE ERROR:", err);
        res.status(500).json({ error: "Failed to create form" });
    }
});

// GET ALL FORMS FOR LOGGED-IN USER
router.get("/", auth, async (req, res) => {
    try {
        const forms = await Form.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json(forms);
    } catch (err) {
        console.error("FETCH FORMS ERROR:", err);
        res.status(500).json({ error: "Failed to fetch forms" });
    }
});

// GET SINGLE FORM PUBLICLY
router.get("/:id", async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);

        if (!form)
            return res.status(404).json({ error: "Form not found" });

        res.json(form);
    } catch (err) {
        console.error("FETCH SINGLE FORM ERROR:", err);
        res.status(500).json({ error: "Error fetching form" });
    }
});

module.exports = router;
