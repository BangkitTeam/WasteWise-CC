'use strict'
const {Storage} = require('@google-cloud/storage')
const fs = require('fs')
const dateFormat = require('dateformat')
const path = require('path');

const pathKey = path.resolve('./serviceaccountkey.json')

// TODO: Sesuaikan konfigurasi Storage
const gcs = new Storage({
    projectId: 'project_id_Anda',
    keyFilename: pathKey
})

// TODO: Tambahkan nama bucket yang digunakan
const bucketName = 'nama_GCS_bucket_Anda'
const bucket = gcs.bucket(bucketName)

function getPublicUrl(filename) {
    return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let ImgUpload = {}

ImgUpload.uploadToGcs = (req, res, next) => {
    if (!req.file) return next()

    const gcsname = dateFormat(new Date(), "yyyymmdd-HHMMss")
    const file = bucket.file(gcsname)

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    })

    stream.on('error', (err) => {
        req.file.cloudStorageError = err
        next(err)
    })

    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsname
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
        next()
    })

    stream.end(req.file.buffer)
}

// upload file jika berhasil atau tidak
app.post('/upload', upload.single('file'), ImgUpload.uploadToGcs, (req, res) => {
    if (req.file && req.file.cloudStoragePublicUrl) {
        return res.status(200).json({
            message: 'File uploaded successfully!',
            url: req.file.cloudStoragePublicUrl
        });
    }
    res.status(400).send('No file uploaded.');
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:8080');
});

module.exports = ImgUpload