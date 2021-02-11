const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

exports.uploadImage = (imageFile, bookFile) => {

    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            // console.log("file dari cloudinary storage", file);
            // cek file apa yang diupload user
            if (file.fieldname === "bookFile") {
                // simpan file hasil upload ke folder windowofworld dari clodynary
                // karna file yang diupload berbentuk epub maka tambahkan param dengan type raw
                // dan hanya mengizikan jenis file type epub dan saat diupload beri ext .epub
                return {
                    folder: 'windowofworld',
                    resource_type: "raw",
                    allowedFormats: "epub",
                    format: "epub"
                };                
            }else if (file.fieldname === "thumbnail" || file.fieldname === "transferProof"){
                // simpan file hasil upload ke folder windowofworld dari clodynary
                // dan hanya mengizikan jenis file type image dan sisanya otomatis di create cloudinary
                return {
                    folder: 'windowofworld',
                    allowedFormats: ["jpg", "jpeg", "png"],
                };
            }
        }
    });   


    const fileFilter = function (req, file, cb) {
        if (file.fieldname ===  imageFile) {
            if (!file.originalname.match(/\.(jpg|JPG|png|PNG|jpeg|JPEG)$/)) {
                req.fileValidationError = {
                message: "Only image files are allowed!"
                }
                return cb(new Error("Only image are allowed!"), false)
            }            
        }

        if (file.fieldname ===  bookFile) {
            if (!file.originalname.match(/\.(epub|EPUB|ZIP|zip)$/)) {
                req.fileValidationError = {
                message: "Only EPUB files are allowed!"
                }
                return cb(new Error("Only EPUB are allowed!"), false)
            }            
        }
        

        cb(null, true)
    }

    const maxSize = 3 * 1000 * 1000; //Maximum file size 3 MB

    const upload = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSize,
            },
        }).fields([
            {
            name: imageFile,
            maxCount: 1,
            },
            {
            name: bookFile,
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