require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/forms');
const submissionRoutes = require('./routes/submissions');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

mongoose.connect(process.env.MONGODB_URI, { }).then(() => console.log('mongo connected')).catch(e => console.error(e));

app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/submissions', submissionRoutes);

app.get('/', (req, res) => res.send('AI Form Backend'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('server started on', PORT));