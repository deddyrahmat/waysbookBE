const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});

exports.uploadImage = (image) => {

    const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'windowofworld',
            // format: ["jpg","jpeg","png"]
        };
        },
    });

    const fileFilter = function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|png|PNG|jpeg|JPEG)$/)) {
            req.fileValidationError = {
            message: "Only file image files are allowed!"
            }
            return cb(new Error("Only file image are allowed!"), false)
        }
        cb(null, true)
    }

    const maxSize = 10 * 1000 * 1000; //Maximum file size 10 MB

    const upload = multer({
        storage,
        fileFilter,
        limits: {
        fileSize: maxSize,
        },
    }).fields([
        {
        name: image,
        maxCount: 1,
        }
    ])

    //middleware handler
    return (req, res, next) => {
        upload(req, res, function (err) {
        //munculkan error jika validasi gagal
        if (req.fileValidationError)
            return res.status(400).send(req.fileValidationError)

        //munculkan error jika file tidak disediakan
        if (!req.files && !err)
            return res.status(400).send({
            message: "Please select image to upload",
            })

        //munculkan error jika melebihi max size
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).send({
                message: "Max file sized 10MB",
            })
            }
            return res.status(400).send(err)
        }
        //jika oke dan aman lanjut ke controller
        //akses nnti pake req.files
        return next();
        })
    }

}