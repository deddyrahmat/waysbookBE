// data book from model Book
const {Transaction, User, PurchaseBook, Book, BookUser} = require('../../../models');

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

exports.getTransaction = async (req, res) => {
    try {

        const transactions = await Transaction.findAll({
            attributes:{
                exclude:["createdAt","updatedAt","cloudinary_id"]
            },
            order : [
                ["id", "DESC"]
            ],
            include : [
                {
                    model : User,
                    as : "user",
                    attributes:{
                        exclude:["createdAt","updatedAt","cloudinary_id","password"]
                    }
                },
                {
                    model : Book,
                    as : "purchasedbooks",
                    attributes : {
                        exclude:["createdAt","updatedAt","cloudinary_id", "cloudinary_id_bookFile","BookId"]
                        // include:["bookId","Book"]
                    },
                    through: {
                        attributes: [],
                    },
                }

            ]
        })
        
        if (!transactions) {
            return res.status(400).send({
                status : "Server Error",
                error : {
                    message : "Data Transaction Not Found"
                }
            })
        }

        res.send({
            statue:"Success",
            message:"Data Transaction Success",
            data : {transactions}
        });
    } catch (err) {
        catchError(err, res)
    }
}

exports.getTransactionById = async (req, res) => {
    try {
        // tangkap data id dari parameter
        const {id} = req.params;

        const transaction = await Transaction.findAll({
            where : {
                id
            },
            attributes:{
                exclude:["createdAt","updatedAt","cloudinary_id"]
            },
            include : [
                {
                    model : User,
                    as : "user",
                    attributes:{
                        exclude:["createdAt","updatedAt","cloudinary_id","password"]
                    }
                },
                {
                    model : Book,
                    as : "purchasedbooks",
                    attributes : {
                        exclude:["createdAt","updatedAt","cloudinary_id", "cloudinary_id_bookFile","BookId"]
                        // include:["bookId","Book"]
                    },
                    through: {
                        attributes: [],
                    },
                }

            ]
        })
        
        if (!transaction) {
            return res.status(400).send({
                status : "Server Error",
                error : {
                    message : "Data Transaction Not Found"
                }
            })
        }

        res.send({
            statue:"Success",
            message:"Data Transaction Success",
            data : {transaction}
        });
    } catch (err) {
        catchError(err, res)
    }
}

exports.approvedTransaction = async (req, res) => {
    try {
        // tangkap data id dari parameter
        const {id} = req.params;

        const transactionById = await Transaction.findOne({
            where : {
                id
            } 
        });

        if (!transactionById) {
            return res.status(400).send({
                status : "Server Error",
                error : {
                    message : "Data Transaction Not Found"
                }
            })
        }

        const upTransaction = await Transaction.update({
            userStatus:"Approved", 
        }, {
            where : {
                id
            }
        })

        if (!upTransaction) {
            return res.status(400).send({
                status : "Server Error",
                error : {
                    message : "Data Book Not Found"
                }
            })
        }

        const transaction = await Transaction.findOne({
            where : {
                id
            }, attributes : {
                exclude : ["cloudinary_id", 'userId', "createdAt", "updatedAt"]
            }, include : [
                {
                    attributes: {
                        exclude: ['email','gender','phone','address','password', 'avatar','role','cloudinary_id','UserId',"createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "user"
                },
                {
                    model : Book,
                    as : "purchasedbooks",
                    attributes : {
                        exclude:["createdAt","updatedAt","cloudinary_id", "cloudinary_id_bookFile","BookId"]
                        // include:["bookId","Book"]
                    },
                    through: {
                        attributes: [],
                    },
                }
            ]
        });

        if (!transaction) {
            return res.status(400).send({
                status : "Server Error",
                error : {
                    message : "Data Transaction Not Found"
                }
            })
        }

        console.log("data id transaction", transaction.purchasedbooks);

        // tambah data ke purchasesbooks
        transaction.purchasedbooks.map(async (book) => {
            const idbook = book.id;
            console.log("book json", book);
            console.log("id book", idbook);
            
            await BookUser.create({
                userId : transaction.user.id,
                bookId : idbook,
            })
        })

        res.send({
            statue:"Success",
            message:"Update Data Transaction Success",
            data : {transaction}
        });
    } catch (err) {
        catchError(err, res)
    }
}

exports.cancelTransaction = async (req, res) => {
    try {
        // tangkap data id dari parameter
        const {id} = req.params;

        const {body} = req;

        console.log("req body from cancle transactions", req.body);

        const transactionById = await Transaction.findOne({
            where : {
                id
            } 
        });

        if (!transactionById) {
            return res.status(400).send({
                status : "Server Error",
                error : {
                    message : "Data Transaction Not Found"
                }
            })
        }

        const upTransaction = await Transaction.update({
            descCancel : body.descCancel, 
            userStatus:"Cancel", 
        }, {
            where : {
                id
            }
        })

        if (!upTransaction) {
            return res.status(400).send({
                status : "Server Error",
                error : {
                    message : "Data Book Not Found"
                }
            })
        }

        const transaction = await Transaction.findOne({
            where : {
                id
            }, attributes : {
                exclude : ["cloudinary_id", 'userId', "createdAt", "updatedAt"]
            }, include : 
                {
                    attributes: {
                        exclude: ['email','gender','phone','address','password', 'avatar','role','cloudinary_id','UserId',"createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "user"
                }
            
        });

        res.send({
            statue:"Success",
            message:"Update Data Transaction Success",
            data : {transaction}
        });
    } catch (err) {
        catchError(err, res)
    }
}

exports.storeTransaction = async (req, res) => {
    try {

        // gunakan id dari proses auth middleware verified
        const {id} = req.verified;
        console.log("id from req verified login",id);

        const {body, files} = req;

        const { books } = body;
        const newBooks = JSON.parse(books);
        console.log("books", books); 
        console.log("newBooks", newBooks); 
        // console.log("books json parse", JSON.parse(books)); 

        // const {error} =  formValidation.transactionValidation(body);

        // if (error) {
        //     return res.status(400).send({
        //         status : "validation error",
        //         error : {
        //             message : error.details.map((error) => error.message)
        //         }
        //     })
        // }

        if (files.attachment.length > 0) {
            console.log("id user", id);
            console.log("id user type", typeof(id));
            console.log("books user type", typeof(books));
            console.log("newBooks user type", typeof(newBooks));
            // const transaction = files.transferProof.map( async (transferImage) => {
                const createTransaction = await Transaction.create({
                    ...body,
                    userStatus : "Pending",
                    attachment: files.attachment[0].path,
                    cloudinary_id :  files.attachment[0].filename,
                    userId : id,
                });

                newBooks.map(async (book) => {
                    // console.log("hasil produk : " +book.amount);// id transaksi terbaru : "+ transaction.id
                    const idbook = book.id;
                    console.log("book json", book);
                    console.log("id book", idbook);
                    
                    await PurchaseBook.create({
                        transactionId : createTransaction.id,
                        bookId : idbook,
                    })
                })

            console.log("create transaction terakhir", createTransaction.id);
            
            if (!createTransaction) 
                return res.status(400).send({
                status : "Error",
                error : {
                    message : "Transaction failed"
                }
            })

            const transaction = await Transaction.findAll({
                where : {
                    id : createTransaction.id
                },
                attributes:{
                    exclude:["createdAt","updatedAt","cloudinary_id"]
                },
                include : [
                    {
                        model : User,
                        as : "user",
                        attributes:{
                            exclude:["createdAt","updatedAt","cloudinary_id","password"]
                        }
                    },
                    {
                        model : Book,
                        as : "purchasedbooks",
                        attributes : {
                            exclude:["createdAt","updatedAt","cloudinary_id", "cloudinary_id_bookFile","BookId"]
                            // include:["bookId","Book"]
                        },
                        through: {
                            attributes: [],
                        },
                    }

                ]
            })
            
            if (!transaction) {
                return res.status(400).send({
                    status : "Server Error",
                    error : {
                        message : "Data Transaction Not Found"
                    }
                })
            }

            res.send({
                statue:"Success",
                message:"Data Transaction Success",
                data : {transaction}
            });

        }

        res.status(400).send({
            status : "Error",
            error : {
                message : "File Not Found"
            }
        }
        )

    } catch (err) {
        catchError(err, res)
    }
}