const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// ---------------------
// 1️⃣ SEARCH CONTACTS
// ---------------------
router.get('/search', async (req, res) => {
  try {
    const { specialty, city, maxFee, lat, lng } = req.query;

    let query = {};
    if (specialty) query.specialties = { $regex: specialty, $options: 'i' };
    if (city) query.city = { $regex: city, $options: 'i' };
    if (maxFee) query.fee_usd = { $lte: Number(maxFee) };

    let contacts = await Contact.find(query);

    // Optional: calculate distance and score if lat/lng provided
    if (lat && lng) {
      const userLat = Number(lat);
      const userLng = Number(lng);

      contacts = contacts.map(c => {
        if (c.latitude && c.longitude) {
          const dLat = c.latitude - userLat;
          const dLng = c.longitude - userLng;
          // Rough distance in km
          c.distance_km = Math.sqrt(dLat * dLat + dLng * dLng) * 111;
        }
        // Simple score: rating minus distance penalty
        c.score = (c.rating || 0) - (c.distance_km || 0) / 50;
        return c;
      }).sort((a, b) => b.score - a.score);
    }

    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------------
// 2️⃣ GET CONTACT BY ID
// ---------------------
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// ---------------------
// 3️⃣ CREATE CONTACT
// ---------------------
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid data', details: err.message });
  }
});

// ---------------------
// 4️⃣ UPDATE CONTACT
// ---------------------
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid ID or data', details: err.message });
  }
});

// ---------------------
// 5️⃣ DELETE CONTACT
// ---------------------
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid ID' });
  }
});

module.exports = router;
