const {User} = require('../../../models');

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
                exclude:["createdAt","updatedAt","password"]
            }
        })

        if (!Users) {
            return res.status(400).send({
                status : "Server Error",
                message : "Data Users Empty",
                data : {users : []}
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