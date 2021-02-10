const {User} = require('../../../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// memanggil fungsi validation form
const formValidation = require('../../middlewares/formValidation');

const catchError = (err, res) => {
    console.log(err)
        res.status(500).send({
        status : "Request Failed",
        error : {
            message : "Server Error"
        }
    })
}


exports.register= async (req, res) => {
    try {
        // validasi inputan user
        const {body} = req;

        console.log("body form register", body);

        const {error} =  formValidation.registerValidation(body);

        if (error) {
            return res.status(400).send({
                status : "validation error",
                error : {
                    message : error.details.map((error) => error.message)
                }
            })
        }

        // cek email, sudah terdaftar atau belum
        const checkEmail = await User.findOne({
            where : {
                email: body.email
            },
            attributes : {
                exclude : ["createdAt","updatedAt"]
            }
        })

        if (checkEmail) {
            return res.status(400).send({
                status: "Failed",
                error : {
                    message: `Email already exsited`
                }
            });
        }

        const {fullname, email, password} = body;

        const role = "user";

        // encrypt password dengan method bcrypt
        const hashPassword = await bcrypt.hash(password, 12);

        // register user
        const regis = await User.create({
            fullname,
            email,
            role,
            password:hashPassword
        });

        // private key for token
        // const privateKey = "windowofworld";
        const privateKey = process.env.JWT_KEY;

        // proses pembuatan token dengan jsonwebtoken
        const token = jwt.sign({
            id : regis.id
            }, privateKey
        );

        res.send({
            status: "Success",
            message: "You succesfully registered",
            data : {
                chanel : {
                    id : regis.id,
                    fullname,
                    avatar : regis.avatar,
                    email: regis.email,
                    role: "user",
                    token                    
                }
            },
        });

    } catch (err) {
        catchError(err, res)
    }
}


exports.login = async (req, res) => {
    try {
        // form inputan user
        const {body} = req;

        // validasi form login
        const {error} = formValidation.loginValidation(body);

        // cek validasi
        if (error) {
            return res.status(400).send({
                status : "Validation Error",
                error : {
                    message : error.details.map((error) => error.message)
                }
            });
        }

        // jika validasi sukses
        // proses login

        const {email, password} = body;

        // cek akun email terdaftar
        const account = await User.findOne({
            where:{
                email
            }
        });

        // jika tidak terdaftar
        if (!account) {
            return res.status(400).send({
                status:"Failed",
                error:{
                    message :"Login Failed"
                }
            });
        }

        // jika account terdaftar disistem
        // cek passwordnya
        const validPass = await bcrypt.compare(password, account.password);

        // jika password tidak valid
        if (!validPass) {
            return res.status(400).send({
                status:"Failed",
                error : {
                    message : "Login Failed"
                }
            });
        };

        // jika proses login sukses
        // buat token
        
        // private key for token
        const privateKey = process.env.JWT_KEY;
        // const privateKey = "windowofworld";

        const token = jwt.sign({
            id:account.id
        }, privateKey);


        // responses login dengan token
        res.send({
            status : "Success",
            message : "Login Success",
            data : {
                chanel : {
                    id : account.id,
                    fullname : account.fullname,
                    avatar : account.avatar,
                    email,
                    token,
                    role : account.role
                }
            }
        });

    } catch (err) {
        catchError(err, res);
    }
}


exports.checkAuth = async (req, res) => {
    try {
        const userId = req.verified.id;
        console.log("user id", userId);
        const user = await User.findOne({
            where: {
                id: userId,
            },
        });

        console.log("data user ", user);

        res.send({
        status: "Success",
        message: "User Valid",
        data: user,
        });
    } catch (err) {
        //error here
        console.log(err);
        return res.status(500).send({
        status : "Failed",
        error: {
            message: "Server Error",
        },
        });
    }
};
