const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
require('dotenv').config();
const mongoose = require('mongoose');
const Contact = require('../models/contact');

async function importCsv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const rows = parse(raw, { columns: true, skip_empty_lines: true });

  for (const row of rows) {
    const doc = {
      name: row.name,
      specialties: (row.specialty || row.specialties || '')
        .split(';')
        .map(s => s.trim())
        .filter(Boolean),
      hospital: row.hospital,
      address: row.address,
      city: row.city,
      latitude: row.latitude ? Number(row.latitude) : undefined,
      longitude: row.longitude ? Number(row.longitude) : undefined,
      fee_usd: row.fee_usd ? Number(row.fee_usd) : undefined,
      rating: row.rating ? Number(row.rating) : undefined,
      reviews_count: row.reviews_count ? Number(row.reviews_count) : 0,
      phone: row.phone,
      email: row.email
    };

    await Contact.findOneAndUpdate(
      { name: doc.name, address: doc.address },
      doc,
      { upsert: true, new: true }
    );

    console.log('Imported:', doc.name);
  }
}

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const filePath = path.resolve(__dirname, '../../data/contacts_sample.csv');
    await importCsv(filePath);

    console.log('Finished importing CSV');
    process.exit(0);
  } catch (err) {
    console.error('Import error:', err);
    process.exit(1);
  }
}

main();
