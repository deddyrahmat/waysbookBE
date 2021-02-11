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
        const Books = await Book.findAll({
            attributes : {
                exclude : ["createdAt","updatedAt"]
            }
        });

        if (!Books) {
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
            data : {Books}
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
                exclude:["createdAt","updatedAt"]
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

        if (files.bookFile.length > 0) {
            // const uploadBook = files.bookFile.map( async (filebook) => {
            //     // const result = await cloudinary.uploader.upload(filebook.path);//harus path karna menangkap data path saja
            // })
            const uploadBook = await Book.create({
                ...body,
                bookFile: files.bookFile[0].path,
                cloudinary_id_bookFile :  files.bookFile[0].filename,
                thumbnail: files.thumbnail[0].path,
                cloudinary_id :  files.thumbnail[0].filename,
            });
            
            console.log("upload book ke cloud", uploadBook);

            if (uploadBook) {
                return res.send({
                        status : "Success",
                        message : "Book Success Created",
                        data : {
                            book : {
                                id : uploadBook.id,
                                title : uploadBook.title,
                                publicationData : uploadBook.publicationData,
                                pages : uploadBook.pages,
                                author : uploadBook.author,
                                isbn : uploadBook.isbn,
                                about : uploadBook.about,
                                thumbnail : uploadBook.thumbnail,
                                bookFile : uploadBook.bookFile
                            }
                        }
                    });
            }else{
                return res.status(400).send({
                status : "validation error",
                error : {
                    message : "Upload failed"
                }
            })
            }
        }

        res.status(400).send({
            status : "validation error",
            error : {
                message : "File Not Found"
            }
        }
        )

    } catch (err) {
        catchError(err, res)
    }
}