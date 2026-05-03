import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  date: { type: String, required: true },
  purpose: { type: String, required: true },
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
}, { timestamps: true });

const scholarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  achievement: { type: String, required: true },
  year: { type: String, required: true },
  education: { type: String, required: true },
  imageUrl: { type: String },
}, { timestamps: true });

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  message: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'viewed', 'implemented'] },
}, { timestamps: true });

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['event', 'origin', 'other'], default: 'other' },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

export const Donor = mongoose.model('Donor', donorSchema);
export const Event = mongoose.model('Event', eventSchema);
export const Scholar = mongoose.model('Scholar', scholarSchema);
export const Feedback = mongoose.model('Feedback', feedbackSchema);
export const Gallery = mongoose.model('Gallery', gallerySchema);
