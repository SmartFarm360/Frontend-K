const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/mongo');
const path = require('path');
const cors = require('cors');

dotenv.config();
connectDB();

const blogRoutes = require('./routes/blogRoutes');
const app = express();

app.use(cors({
    origin:  "http://localhost:5173",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', blogRoutes);

app.use('/api/images', require('./routes/imageRoutes'));

app.get('/', (req, res) => res.send('API Running'));

module.exports = app;
