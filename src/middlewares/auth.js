const {User} = require('../../models');
const jwt = require('jsonwebtoken');

const catchError = (err, res) => {
    console.log(err);
    res.status(401).send({
        status: 'failed',
        message: 'Invalid Token'
    });
}

exports.auth = (req, res, next) => {
    let header, token;

    // jika tidak ada header dan token yang diterima
    if (
        !(header = req.header('Authorization')) ||
        !(token = header.replace("Bearer ",""))
    ) {
        return res.status(401).send({
            status : "Failed",
            message : "Access Denied"
        })
    }

    try {
        const privateKey = "windowofworld";
        const verified = jwt.verify(token, privateKey);

        //tambahkan request user sehingga bisa diakses di next function, middleware, etc
        // mengirim paramater seperti get pada bagian link
        req.verified = verified;
        console.log("hasil req verified in aut", req.verified);

        next();
    } catch (err) {
        catchError(err, res);
    }
}


exports.isAdmin = async (req, res, next) => {
    // menangkap data req user dari auth sebelumnya
    const verifiedUser = req.verified;

    try {
        // jika tidak ada user yang terverifikasi
        if (!verifiedUser) {
            return res.status(400).send({
                status : "Failed",
                error : {
                    message : "No Token. Authorization Denied"
                }
            });
        }


        // simpan data user yang login
        const admin = await User.findOne({where : {id : verifiedUser.id}});

        // jika data admin tidak ditemukan, tampilkan error
        if (!admin) {
            return res.status(400).send({
                status : "Failed",
                error : {
                    message : "User Not Found ! Admin Authorization Denied"
                }
            });
        }


        // jika data user memiliki role yang berbeda dari admin, show error
        if (admin.role !== "admin" ) {
            return res.status(400).send({
                status : "Failed",
                error : {
                    message : "Restricted, You are not admin"
                }
            });
        }

        // hanya user yang memiliki role admin yang bisa lanjut ke function berikutnya
        next();
    } catch (err) {
        catchError(err, res)
    }
}