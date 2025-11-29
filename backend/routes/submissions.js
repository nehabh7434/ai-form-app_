const express = require('express');
const Submission = require('../models/Submission.js');
const Form = require('../models/Form.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try { const p = jwt.verify(token, JWT_SECRET); req.userId = p.id; next(); } catch(e){ return res.status(401).json({ error:'Invalid' }); }
}

// submit form (public)
router.post('/submit/:formId', async (req, res) => {
  const { formId } = req.params;
  const { responses, uploadedImages } = req.body;
  const form = await Form.findById(formId);
  if (!form) return res.status(404).json({ error: 'Form not found' });
  const s = new Submission({ formId, responses, uploadedImages });
  await s.save();
  res.json({ submission: s });
});

// list submissions for a user (requires auth) grouped by form
router.get('/by-user', auth, async (req, res) => {
  // get user's forms
  const forms = await Form.find({ userId: req.userId }).select('_id prompt summary').lean();
  const formIds = forms.map(f => f._id);
  const submissions = await Submission.find({ formId: { $in: formIds } }).lean();
  // group
  const grouped = {};
  submissions.forEach(s => {
    const id = s.formId.toString();
    grouped[id] = grouped[id] || [];
    grouped[id].push(s);
  });
  res.json({ forms, grouped });
});

module.exports = router;
