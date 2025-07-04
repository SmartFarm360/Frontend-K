const express = require('express');
const app = require('./app'); // Your main app export
const cors = require('cors');
const multer = require('multer');
const exifr = require('exifr');
const axios = require('axios');
const upload = multer();

// const blogRoutes = require('./routes/blogRoutes');

const PORT = process.env.PORT || 5000;

// 🛡️ Enable CORS (IMPORTANT: do this BEFORE routes)
app.use(cors());

// 🧭 GPS Upload Route
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const gps = await exifr.gps(req.file.buffer);
    if (gps?.latitude && gps?.longitude) {
      res.json({
        message: 'GPS coordinates extracted',
        latitude: gps.latitude,
        longitude: gps.longitude,
      });
    } else {
      res.json({ message: 'No GPS data found in image' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🌐 Translation Proxy Route (fixes CORS)
app.post('/translate', express.json(), async (req, res) => {
  const { q, target, source = 'en' } = req.body;

  try {
    const response = await axios.post('https://libretranslate.de/translate', {
      q,
      source,
      target,
      format: 'text',
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Translation error:", error.message);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// app.use(express.json());

// app.use('/api/blog', blogRoutes); // 👈 THIS MUST EXIST

// // Default
// app.listen(5000, () => console.log("Server running on port 5000"));
// app.post("/translate-batch", (req, res) => {
//   const { keys, lang } = req.body;

//   // Basic fallback translation mock
//   const translations = {
//     en: {
//       dashboard: "Dashboard",
//       temperature: "Temperature",
//       humidity: "Humidity",
//       moisture: "Moisture",
//       login: "Login",
//       register: "Register",
//       // Add more keys as needed
//     },
//     hi: {
//       dashboard: "डैशबोर्ड",
//       temperature: "तापमान",
//       humidity: "नमी",
//       moisture: "माटी की नमी",
//       login: "लॉगिन करें",
//       register: "रजिस्टर करें",
//     },
//   };

//   const result = {};
//   keys.forEach((key) => {
//     result[key] = translations[lang]?.[key] || key;
//   });

//   res.json(result);
// });

