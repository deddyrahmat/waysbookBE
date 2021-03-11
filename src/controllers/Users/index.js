const {User, Transaction, PurchaseBook, Book, BookUser} = require('../../../models');

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
    const profile = await User.findOne({
        where : {
            id
        },
        attributes:{
            exclude:["createdAt","updatedAt","password","cloudinary_id"]
        },
        include :{
            model : Book,
            as : "purchasesbooks",
            attributes : {
                exclude:["createdAt","updatedAt","cloudinary_id", "cloudinary_id_bookFile","BookId"],
                // include:["bookId","Book"]
            },
            through: {
                attributes: [],
            },
        }
    });

    if (!profile) {
        return res.status(400).send({
            status : "Failed",
            error : {
                message : "User Not Found"
            }
        });
    }

    // const purchasesbooks = await Transaction.findAll({
    //         attributes:{
    //             exclude:["createdAt","updatedAt","cloudinary_id"]
    //         },
    //         order : [
    //             ["id", "DESC"]
    //         ],
    //         include : [
    //             {
    //                 model : Book,
    //                 as : "purchasedbooks",
    //                 attributes : {
    //                     exclude:["createdAt","updatedAt","cloudinary_id", "cloudinary_id_bookFile","BookId"]
    //                     // include:["bookId","Book"]
    //                 },
    //                 through: {
    //                     attributes: [],
    //                 },
    //             }

    //         ]
    //     })
        
    //     if (!purchasesbooks) {
    //         return res.status(400).send({
    //             status : "Server Error",
    //             error : {
    //                 message : "Data Transaction Not Found"
    //             }
    //         })
    //     }

    res.send({
        status : "Success",
        message : "Get Data User Successfully",
        data  : {
            profile
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

exports.updateUser = async (req,res) => {
    try {
        
        const {id} = req.verified;
        const {body,files} = req;
        console.log("file",files);

        
        //method FindOne menerima object yaitu where : {id}
        const getUserById = await User.findOne({
            where : {
                id
            }
        })
        
        if (!getUserById) {
            return res.status(400).send({
                status : "Data User Empty",
                data : {User : null}
            })
        }

        // cek user update profil
        if (files.avatar) {            
            if (files.avatar.length > 0) {
                // const result = await cloudinary.uploader.upload(files[0].path);//harus path karna menangkap data path saja
                body.avatar = files.avatar[0].path;
                body.cloudinary_id = files.avatar[0].filename
                // const photo = await User.update({avatar: result.secure_url, cloudinary_id: result.public_id, });
            }
        }

        //update menerima 2 parameter yaitu data yang mau diupdate dan where id
        const user= await User.update(body, {
            where : {
                id
            }
        })

        //karena yang direturn setelah update cuma id doang
        //maka kita harus get lagi sebelum dikirim ke sisi client
        const profile = await User.findOne({
            where: {
                id,
            },attributes:{
                exclude:["createdAt","updatedAt","password","cloudinary_id"]
            },
        });

        //hasil update
        res.send({
        status: "Success",
        message: "Update Success",
        data: {
            profile
        },
        });
        
    } catch (err) {
        catchError(err, res)
    }
}