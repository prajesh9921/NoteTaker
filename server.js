const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
dotenv.config();
app.use(cors());
app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Menu Item Schema
const NoteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Item = mongoose.model('Item', NoteSchema);

// Admin Routes


app.get('/api/menu-items', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Order Routes
app.post('/api/orders', async (req, res) => {
  try {
    const { items } = req.body;
    
    // Calculate total price
    const orderItems = await Promise.all(items.map(async (item) => {
      const menuItem = await MenuItem.findById(item.menuItemId);
      return {
        menuItem: menuItem._id,
        quantity: item.quantity
      };
    }));

    const totalPrice = await calculateTotalPrice(orderItems);

    const newOrder = new Order({
      items: orderItems,
      totalPrice
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Utility function to calculate total price
async function calculateTotalPrice(orderItems) {
  let total = 0;
  for (let item of orderItems) {
    const menuItem = await MenuItem.findById(item.menuItem);
    total += menuItem.price * item.quantity;
  }
  return total;
}

// Update Order Status
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Note CRUD Routes

// Get all notes for a specific email
app.get('/api/notes', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const notes = await Item.find({ email });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new note
app.post('/api/notes', async (req, res) => {
  try {
    const { email, title, content } = req.body;
    if (!email || !title || !content) {
      return res.status(400).json({ message: 'Email, title, and content are required' });
    }
    const newNote = new Item({ email, title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a note by ID
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, title, content } = req.body;
    const updatedNote = await Item.findOneAndUpdate(
      { _id: id, email },
      { title, content },
      { new: true }
    );
    if (!updatedNote) return res.status(404).json({ message: 'Note not found or email mismatch' });
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a note by ID
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const deletedNote = await Item.findOneAndDelete({ _id: id, email });
    if (!deletedNote) return res.status(404).json({ message: 'Note not found or email mismatch' });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});