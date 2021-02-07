const express = require('express');
const multer = require('multer');


exports.uploadEpub = (fileEpub) => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, "uploads")
        },
        filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
        },
    });

    const fileFilter = function (req, file, cb) {
        if (!file.originalname.match(/\.(epub)$/)) {
            req.fileValidationError = {
            message: "Only file EPUB files are allowed!"
            }
            return cb(new Error("Only file EPUB are allowed!"), false)
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
        name: fileEpub,
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
            message: "Please select file to upload",
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