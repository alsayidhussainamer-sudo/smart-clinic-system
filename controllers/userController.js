const db = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

    const {
        username,
        password,
        role
    } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO Users (Username, PasswordHash, Role)
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [username, hashedPassword, role],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message: "Register Error"
                    });
                }

                res.json({
                    message: "User registered successfully ✅"
                });

            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
exports.login = (req, res) => {

    const {
        username,
        password
    } = req.body;

    const sql = `
        SELECT * FROM Users
        WHERE Username = ?
    `;

    db.query(sql, [username], async (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.length === 0) {

            return res.status(401).json({
                message: "Invalid Username"
            });

        }

        const user = result[0];

        const isMatch = await bcrypt.compare(
            password,
            user.PasswordHash
        );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid Password"
            });

        }

        const token = jwt.sign(
    {
        id: user.UserId,
        role: user.Role
    },
    process.env.JWT_SECRET || "smartclinicsecret",  // ← التعديل هنا فقط
    {
        expiresIn: "1d"
    }
);

        res.json({
    message: "Login successful ✅",
    token,
    role: user.Role
});

    });

};
// =========================
// GET ALL USERS
// =========================

exports.getAllUsers = (req, res) => {

    const sql = `
        SELECT UserId, Username, Role
        FROM Users
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        res.json(result);
    });
};

// =========================
// UPDATE USER
// =========================

exports.updateUser = (req, res) => {

    const { id } = req.params;

    const {
        username,
        role
    } = req.body;

    const sql = `
        UPDATE Users
        SET Username = ?, Role = ?
        WHERE UserId = ?
    `;

    db.query(
        sql,
        [username, role, id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Update Error"
                });
            }

            res.json({
                message: "User updated successfully ✅"
            });
        }
    );
};

// =========================
// DELETE USER
// =========================

exports.deleteUser = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM Users
        WHERE UserId = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Delete Error"
            });
        }

        res.json({
            message: "User deleted successfully ✅"
        });
    });
};