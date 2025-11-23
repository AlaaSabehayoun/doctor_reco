require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const contactsRoute = require('./routes/contacts');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/contacts', contactsRoute);

// Use MongoDB URI from environment variable (set in Azure)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/doctor_reco';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Azure requires process.env.PORT
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("Mongo connect error:", err));
