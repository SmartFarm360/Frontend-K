const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Admin = require('../models/Admin');
const DroneController = require('../models/DroneController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// S3 Client (V3)
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// In-memory blacklist (for development)
let blacklistedTokens = [];

exports.register = async (req, res) => {
    const { name, email, mobile, password, confirmPassword, role } = req.body;

    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
            });
        }

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser;

        if (role === 'farmer') {
            const { landSize, location, experience, cropType } = req.body;

            if (!landSize || !location || !experience || !cropType) {
                return res.status(400).json({ message: 'All farmer fields are required.' });
            }

            let s3Url = null;
            let hash = null;

            if (req.file) {
                const fileBuffer = req.file.buffer;
                const fileKey = `land-documents/${Date.now()}-${req.file.originalname}`;

                const uploadParams = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: fileKey,
                    Body: fileBuffer,
                    ContentType: req.file.mimetype
                };

                await s3Client.send(new PutObjectCommand(uploadParams));

                s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
                hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
            }

            newUser = await Farmer.create({
                name,
                email,
                mobile,
                password: hashedPassword,
                role,
                landSize,
                location,
                cropType,
                experience,
                landDocumentUrl: s3Url,
                landDocumentHash: hash
            });

        // } else if (role === 'admin') {
        //     const { employeeId, adminArea, accessLevel } = req.body;

        //     if (!employeeId || !adminArea || !accessLevel) {
        //         return res.status(400).json({ message: 'All admin fields are required.' });
        //     }

        //     newUser = await Admin.create({
        //         name,
        //         email,
        //         mobile,
        //         password: hashedPassword,
        //         role,
        //         employeeId,
        //         adminArea,
        //         accessLevel
        //     });

        } else if (role === "drone_controller") { // FIXED: use space to match frontend
            const { licenseId, baseLocation, availableDrones, flightExperience } = req.body;

            if (!licenseId || !baseLocation || availableDrones === undefined || flightExperience === undefined) {
                return res.status(400).json({ message: 'All drone controller fields are required.' });
            }

            newUser = await DroneController.create({
                name,
                email,
                mobile,
                password: hashedPassword,
                role,
                licenseId,
                baseLocation,
                availableDrones,
                flightExperience
            });

        } else {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            message: 'User registered successfully',
            token
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role });
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.logout = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    blacklistedTokens.push(token);
    return res.status(200).json({ message: 'Logout successful' });
};

exports.isTokenBlacklisted = (token) => blacklistedTokens.includes(token);
