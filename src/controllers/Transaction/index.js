// data book from model Book
const {Transaction, User} = require('../../../models');

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
            attributes : {
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
            paymentStatus : "Approved", 
            userStatus:"Active", 
            remainingActive : 30
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
            paymentStatus : "Cancel", 
            userStatus:"Not Active", 
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

exports.expiredTransaction = async (req, res) => {
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
            paymentStatus : "Cancel", 
            userStatus:"Not Active", 
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

        const {error} =  formValidation.transactionValidation(body);

        if (error) {
            return res.status(400).send({
                status : "validation error",
                error : {
                    message : error.details.map((error) => error.message)
                }
            })
        }

        if (files.transferProof.length > 0) {
            // const transaction = files.transferProof.map( async (transferImage) => {
                const createTransaction = await Transaction.create({
                    ...body,
                    userId:id, 
                    transferProof: files.transferProof[0].path,
                    cloudinary_id :  files.transferProof[0].filename,
                    remainingActive : 0,
                    userStatus : "Not Active",
                    paymentStatus : "Pending"
                });
            // })

            console.log("create transaction terakhir", createTransaction.id);
            
            const transaction = await Transaction.findOne({
                where : {
                    id : createTransaction.id
                },
                attributes:{
                exclude:["createdAt","updatedAt","cloudinary_id"]
            }
            })
            

            if (transaction) {
                return res.send({
                        status : "Success",
                        message : "Transaction Success",
                        data : {
                            transaction
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