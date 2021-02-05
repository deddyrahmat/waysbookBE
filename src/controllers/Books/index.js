// data book from model Book
const {Book} = require('../../../models');

// memanggil fungsi validation form
const formValidation = require('../../middlewares/formValidation');

exports.storeBook = async (req, res) => {
    try {
        const {body, files} = req;

        console.log("form validation function", formValidation);

        console.log("file dari book",files);

        const {error} =  formValidation.bookValidation(body);

        if (error) {
            return res.status(400).send({
                status : "validation error",
                error : {
                    message : error.details.map((error) => error.message)
                }
            })
        }

        if (files.length > 0) {
            const uploadBook = files.map( async (filebook) => {
                // const result = await cloudinary.uploader.upload(filebook.path);//harus path karna menangkap data path saja
                const book = await Book.create({...body, bookFile: filebook.path, cloudinary_id: filebook.filename, });
            })

            console.log("upload book ke cloud", uploadBook);

            if (uploadBook) {
                return res.send({
                        status : "Success",
                        message : "Book Success Created",
                        data : {
                            uploadBook
                        }
                    });
            }else{
                return res.status(400).send({
                status : "validation error",
                error : {
                    message : "upload failed"
                }
            })
            }
        }

        res.status(400).send({
            status : "validation error",
            error : {
                message : "Image Not Found"
            }
        }
        )

    } catch (err) {
        console.log(err)
        res.status(500).send({
            status : "Request Failed",
            error : {
                message : "Server Error"
            }
        })
    }
}