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

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/doctor_reco';
mongoose.connect(MONGO)
  .then(() => {
    const port = process.env.PORT || 4000;
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log("Server running on port", port));
  })
  .catch(err => console.error("Mongo connect error:", err));
