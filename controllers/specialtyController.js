const db = require("../database/db");

exports.getSpecialties = (req, res) => {
    const sql = "SELECT * FROM Specialties";

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }

        res.json(result);
    });
};

exports.addSpecialty = (req, res) => {
    const { specialtyName, description } = req.body;

    const sql = `
        INSERT INTO Specialties (SpecialtyName, Description)
        VALUES (?, ?)
    `;

    db.query(sql, [specialtyName, description], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error adding specialty" });
        }

        res.json({ message: "Specialty added successfully ✅" });
    });
};