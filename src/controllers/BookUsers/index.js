const {Book, User, BookUser} = require("../../../models");

exports.getBooksUser = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            },
            include: {
                model: Book,
                attributes: {
                    exclude: [ "createdAt", "updatedAt"],
                },
                // menyembunyikan field dari table pivot(bookusers)
                through: {
                    attributes: [],
                },
            },
        });

        res.send({
            statue:"Success",
            message:"Data Book User Success",
            data : {users}
        });
    } catch (err) {
        console.log("Your System ", err);
    }
}

exports.getBooksUserById = async (req, res) => {
    try {
        const {id} = req.verified;
        const user = await User.findOne({
            where : {
                id
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            },
            include: {
                model: Book,
                attributes: {
                    exclude: [ "createdAt", "updatedAt"],
                },
                // menyembunyikan field dari table pivot(bookusers)
                through: {
                    attributes: [],
                },
            },
        });

        res.send({
            statue:"Success",
            message:"Data Book User Success",
            data : {user}
        });
    } catch (err) {
        console.log("Your System ", err);
    }
}

exports.storeBooksUser = async (req, res) => {
    try {
        const {id} = req.verified;
        
        const book_id = req.body.id;

        console.log("book id", book_id);

        const store = await BookUser.create({userId:id, bookId:book_id});
        console.log("store", store);

        const user = await User.findOne({
            where : {
                id 
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            },
            include: {
                model: Book,
                attributes: {
                    exclude: [ "createdAt", "updatedAt"],
                },
                // menyembunyikan field dari table pivot(bookusers)
                through: {
                    attributes: [],
                },
            },
        });

        console.log("data user ", user);

        res.send({
            statue:"Success",
            message:"Create Data Book User Success",
            data : {user}
        });
    } catch (err) {
        console.log("Your System ", err);
    }
}