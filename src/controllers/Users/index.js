const {User, Transaction, PurchaseBook, Book} = require('../../../models');

const catchError = (err, res) => {
    console.log(err);
    return res.status(500).send({
        status : "Request Failed",
        error : {
            message : "Server Error"
        }
    })
}


exports.getUsers = async (req,res) => {
    try {
        const Users = await User.findAll({
            attributes:{
                exclude:["createdAt","updatedAt","password","cloudinary_id"]
            }
        })

        if (!Users) {
            return res.status(400).send({
                status : "Server Error",
                error : {
                    message : "Data Users Not Found"
                }
            })
        }

        res.send({
            statue:"Success",
            message:"Get Data Users SUccess",
            data : {Users}
        });

    } catch (err) {
        catchError(err, res)
    }
}

exports.getUserById = async (req, res) => {
    try {
        // simpan id user dari middleware auth
    const {id} = req.verified;

    // cek data user
    // cari data user berdasarkan id login dan hide beberapa data 
    // lalu tampilkan relasi ke table transaction yang menampilkan 1 row data terbaru berdasarkan id dan hide beberapa data
    const user = await User.findOne({
        where : {
            id
        },
        attributes:{
            exclude:["createdAt","updatedAt","password","cloudinary_id"]
        }, 
        // include : [
        //     {
        //         order: [["id", "DESC"]],
        //         model : Transaction,
        //         as : "purchasesBooks",
        //         // attributes:[],
        //         include : [
        //             {
        //                 model : PurchaseBook
        //             }
        //         ]
        //     }
        // ]
    });

    const transactions = await Transaction.findAll({
            where : {
                userId : id
            },
            attributes:{
                exclude:["createdAt","updatedAt","cloudinary_id","id", "userId","attachment","userStatus","descCancel","totalPayment"]
            },
            order : [
                ["id", "DESC"]
            ],
            include : [
                {
                    model : PurchaseBook,
                    attributes:{
                        exclude:["id","createdAt","updatedAt","transactionId","TransactionId"]
                    },
                    include : {
                        model : Book,
                        as : "book",
                        attributes : {
                            exclude:["createdAt","updatedAt","cloudinary_id", "cloudinary_id_bookFile","BookId"]
                            // include:["bookId","Book"]
                        }
                    }
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

    if (!user) {
        return res.status(400).send({
            status : "Failed",
            error : {
                message : "User Not Found"
            }
        });
    }

    res.send({
        status : "Success",
        message : "Get Data User Successfully",
        data  : {
            user : {
                id : user.id,
                fullname : user.fullname,
                email : user.email,
                gender : user.gender,
                phone : user.phone,
                avatar : user.avatar,
                purchasesBooks :
                    transactions
                
            }
        }
    });

    } catch (err) {
        catchError(err, res)
    }
}

exports.deleteUser = async (req, res) => {
    try {
        // tangkap data id dari parameter
        const {id} = req.params;

        // cek data user berdasarkan id yang ditangkap
        const getUserById = await User.findOne({
            where : {
                id
            }
        });

        // jika user tidak ditemukan munculkan error
        if (!getUserById) {
            return res.status(400).send({
                status : "Failed",
                error : {
                    message : "User Not Found"
                }
            });
        };

        await User.destroy({
            where : {
                id
            }
        });

        res.send({
            status : "Success",
            message : "Delete User Successfully",
            data  : id
        })

    } catch (err) {
        catchError(err, res)
    }
}