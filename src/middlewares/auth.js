const {User} = require('../../models');
const jwt = require('jsonwebtoken');

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
        req.user = verified;

        next();
    } catch (err) {
        console.log(err);
        res.status(401).send({
        status: 'failed',
        message: 'Invalid Token'
        });
    }
}