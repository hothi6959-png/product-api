
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Model Product
const productSchema = new mongoose.Schema({
    pid: { type: Number, required: true, unique: true },
    pname: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 }
});

const Product = mongoose.model('Product', productSchema);

// CREATE: Thêm sản phẩm
app.post('/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ: Lấy danh sách sản phẩm
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READ: Lấy một sản phẩm theo pid
app.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findOne({
            pid: Number(req.params.pid)
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE: Cập nhật sản phẩm
app.put('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { pid: Number(req.params.pid) },
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Xóa sản phẩm
app.delete('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            pid: Number(req.params.pid)
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Khởi động server sau khi kết nối MongoDB thành công
mongoose.connection.once('open', () => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`API running at http://localhost:${process.env.PORT || 3000}`);
    });
});
