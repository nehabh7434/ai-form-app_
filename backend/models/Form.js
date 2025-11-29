const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },
    schema: { type: Object, required: true },           // JSON schema produced by LLM
    summary: { type: String, required: true },          // Short text summary for retrieval context
    // Store the high-dimensional vector. 
    // The actual index is configured in MongoDB Atlas (Vector Search).
    embedding: { type: [Number], required: true }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Form', FormSchema);
