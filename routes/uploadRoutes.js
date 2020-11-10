const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();
require('dotenv').config();

const sharp = require('sharp');
const googleStorage = require('../config/');

const storage = multer.memoryStorage();

/* const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'uploads/');
	},
	filename(req, file, cb) {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
		);
	},
}); */

function checkFileType(file, cb) {
	const filetypes = /jpg|jpeg|png/;
	const extname = filetypes.test(
		path.extname(file.originalname).toLowerCase(),
	);
	const mimetype = filetypes.test(file.mimetype);

	if (extname && mimetype) {
		return cb(null, true);
	} else {
		cb('Images only!');
	}
}

const upload = multer({
	storage,
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
});

router.post('/', upload.single('image'), (req, res) => {
	const file = req.file;

	try {
		const bucket = googleStorage.bucket('student_rides_images');
		const blob = bucket.file(file.originalname);
		const remoteWriteStream = blob.createWriteStream();
		sharp(file.buffer)
			.resize({ width: 600 })
			.pipe(remoteWriteStream)
			.on('error', () => {
				throw new Error('Error while uploading image');
			})
			.on('finish', async () => {
				const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
				res.send(publicUrl);
			});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
