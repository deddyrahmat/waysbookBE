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
                status: "Registration Failed",
                message: `Email already exsited`
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
        const privateKey = "windowofworld";

        // proses pembuatan token dengan jsonwebtoken
        const token = jwt.sign({
            id : regis.id
            }, privateKey
        );

        res.send({
            status: "Success",
            message: "You succesfully registered",
            data : {
                email: regis.email,
                fullname: regis.fullname,
                token
            },
        });

    } catch (err) {
        console.log(err)
        res.status(500).send({
            status : "Request Failed",
            error : {
                message : "Server Error"
            }
        });
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
        const privateKey = "windowofworld";

        const token = jwt.sign({
            id:account.id
        }, privateKey);

        // data role user yang akan dikirim sebagai response
        const role = account.role;

        // responses login dengan token
        res.send({
            status : "Success",
            message : "Login Success",
            data : {
                chanel : {
                    email,
                    token,
                    role
                }
            }
        });

    } catch (err) {
        catchError(err, res);
    }
}