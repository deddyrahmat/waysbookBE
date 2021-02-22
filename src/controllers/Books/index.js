// data book from model Book
const {Book} = require('../../../models');

// delete file
const fs = require('fs');

// memanggil fungsi validation form
const formValidation = require('../../middlewares/formValidation');

const catchError = (err, res) => {
    console.log(err);
    return res.status(500).send({
        status : "Request Failed",
        error : {
            message : "Server Error"
        }
    })
}

exports.getBooks = async (req, res) => {
    try {
        const promoBooks = await Book.findAll({
            attributes : {
                exclude : ["createdAt","updatedAt", "cloudinary_id", "cloudinary_id_bookFile"]
            },
            order : [
                ["id", "DESC"]
            ]
        });

        if (!promoBooks) {
            return res.status(400).send({
                status : "Server Error",
                error : {
                    message : "Data Book Not Found"
                }
            })
        }

        res.send({
            statue:"Success",
            message:"Get Data Books Success",
            data : {promoBooks}
        });
    } catch (err) {
        catchError(err, res)
    }
}

exports.getBookById = async (req, res) => {
    try {
        // tangkap data id dari parameter
        const {id} = req.params;

        const book = await Book.findOne({
            where : {
                id
            },
            attributes:{
                exclude:["createdAt","updatedAt","cloudinary_id", "cloudinary_id_bookFile"]
            }
        });

        if (!book) {
            return res.status(400).send({
                status : "Server Error",
                error : {
                    message : "Data Book Not Found"
                }
            })
        }

        res.send({
            statue:"Success",
            message:"Data Book Success",
            data : {book}
        });
    } catch (err) {
        catchError(err, res)
    }
}

exports.updateBook = async (req, res) => {
    try {
        // tangkap data id dari parameter
        const {id} = req.params;

        const {body} = req;

        console.log("hasil body", body);
        const BookById = await Book.findOne({
            where : {
                id
            } 
        });

        if (!BookById) {
            return res.status(400).send({
                status : "Server Error",
                error : {
                    message : "Data Book Not Found"
                }
            })
        }

        const updateBook = await Book.update(body, {
            where : {
                id
            }
        })

        if (!updateBook) {
            return res.status(400).send({
                status : "Server Error",
                error : {
                    message : "Data Book Not Found"
                }
            })
        }

        const book = await Book.findOne({
            where : {
                id
            },
            attributes:{
                exclude:["createdAt","updatedAt"]
            }
        });

        res.send({
            statue:"Success",
            message:"Update Data Book Success",
            data : {book}
        });
    } catch (err) {
        catchError(err, res)
    }
}

exports.deleteBook = async (req, res) => {
    try {
        // tangkap data id dari parameter
        const {id} = req.params;

        const BookById = await Book.findOne({
            where : {
                id
            } 
        });

        if (!BookById) {
            return res.status(400).send({
                status : "Server Error",
                error : {
                    message : "Data Book Not Found"
                }
            })
        }

        // delete a file
        fs.unlink(`${BookById.bookFile}`, (err) => {
            if (err) {
                throw err;
            }
        });

        const deleteBook = await Book.destroy({
            where : {
                id
            }
        })

        res.send({
            statue:"Success",
            message:`Data Book id ${id} Success Deleted`,
            data : {id}
        });
    } catch (err) {
        catchError(err, res)
    }
}

exports.storeBook = async (req, res) => {
    try {
        const {body, files} = req;

        console.log("body books",body);
        console.log("files books",files);
        const {error} =  formValidation.bookValidation(body);

        if (error) {
            return res.status(400).send({
                status : "validation error",
                error : {
                    message : error.details.map((error) => error.message)
                }
            })
        }

        // if (files.bookFile.length > 0) {
            // const uploadBook = files.bookFile.map( async (filebook) => {
            //     // const result = await cloudinary.uploader.upload(filebook.path);//harus path karna menangkap data path saja
            // })
            const book = await Book.create({
                ...body,
                bookFile: files.bookFile[0].path,
                cloudinary_id_bookFile :  files.bookFile[0].filename,
                thumbnail: files.thumbnail[0].path,
                cloudinary_id :  files.thumbnail[0].filename,
            });
            
            console.log("upload book ke cloud", book);
            

            if (!book) {
                return res.status(400).send({
                    status : "Error",
                    error : {
                        message : "Upload failed"
                    }
                })
            }

            const response = await Book.findOne({
                where : {
                    id : book.id
                },
                attributes : {
                    exclude : ["cloudinary_id_bookFile","cloudinary_id","createdAt","updatedAt"]
                }
            })

            return res.send({
                status : "Success",
                message : "Book Success Created",
                data : {
                    book : response
                }
            });

    } catch (err) {
        catchError(err, res)
    }
}