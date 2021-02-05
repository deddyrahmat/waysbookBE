const {User} = require('../../../models');

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
        console.log(err);
        return res.status(500).send({
            status : "Request Failed",
            error : {
                message : "Server Error"
            }
        })
    }
}