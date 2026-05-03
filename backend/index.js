import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Donor, Event, Scholar, Feedback, Gallery } from './models.js';

dotenv.config();
mongoose.set('strictQuery', false);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'seervi_samaj',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, crop: 'limit' }, { quality: 'auto' }, { fetch_format: 'auto' }]
  },
});

const upload = multer({ storage: storage });

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (username === adminUser && password === adminPass) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/seervi_samaj').then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- API ROUTES ---

// Donors
app.get('/api/donors', async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/donors', async (req, res) => {
  try {
    const newDonor = new Donor(req.body);
    const saved = await newDonor.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', upload.single('image'), async (req, res) => {
  try {
    const eventData = { ...req.body };
    if (req.file) {
      eventData.imageUrl = req.file.path; // Cloudinary URL
    }
    const newEvent = new Event(eventData);
    const saved = await newEvent.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Scholars
app.get('/api/scholars', async (req, res) => {
  try {
    const scholars = await Scholar.find().sort({ createdAt: -1 });
    res.json(scholars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scholars', upload.single('image'), async (req, res) => {
  try {
    const scholarData = { ...req.body };
    if (req.file) {
      scholarData.imageUrl = req.file.path; // Cloudinary URL
    }
    const newScholar = new Scholar(scholarData);
    const saved = await newScholar.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gallery', upload.single('image'), async (req, res) => {
  try {
    const galleryData = { ...req.body };
    if (req.file) {
      galleryData.imageUrl = req.file.path;
    }
    const newGallery = new Gallery(galleryData);
    const saved = await newGallery.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    const saved = await newFeedback.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/feedback/:id', async (req, res) => {
  try {
    const updated = await Feedback.findByIdAndUpdate(req.params.id, { status: req.body.status }, { returnDocument: 'after' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Donors - Delete & Update
app.delete('/api/donors/:id', async (req, res) => {
  try {
    await Donor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/donors/:id', async (req, res) => {
  try {
    const updated = await Donor.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Events - Delete & Update
app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/events/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }
    const updated = await Event.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Scholars - Delete & Update
app.delete('/api/scholars/:id', async (req, res) => {
  try {
    await Scholar.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/scholars/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }
    const updated = await Scholar.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  res.status(500).json({ error: err.message || 'Internal Server Error', details: err });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
