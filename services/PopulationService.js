const fs = require("fs");
const bcrypt = require("bcrypt");
const db = require("../models");

async function populateDatabase() {
    const fileOrder = fs.readFileSync('./public/json/fileOrder.json', 'utf8');
    const files = JSON.parse(fileOrder);

    for (const file of files) {
        console.info("Reading file:", file.file);
        if (file.file === "users.json") {
            // Handle user-specific logic
            const userData = JSON.parse(fs.readFileSync(`./public/json/${file.file}`, "utf8"));
            for (const entry of userData) {
                const rawQuery = entry.query;

                // Extract password for hashing
                const match = rawQuery.match(/'(.+?)', '(.+?)', '(.+?)', '(.+?)', '(.+?)', '(.+?)', '(.+?)', '(.+?)'/);
                if (match) {
                    const plainPassword = match[7]; // Extract plain-text password
                    const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash the password
                    const updatedQuery = rawQuery.replace(plainPassword, hashedPassword); // Replace password in query

                    console.info("Executing hashed query:", updatedQuery);
                    try {
                        await db.sequelize.query(updatedQuery);
                    } catch (err) {
                        console.error("Error executing query:", err);
                    }
                }
            }
        } else {
            // Handle non-user tables
            const data = JSON.parse(fs.readFileSync(`./public/json/${file.file}`, "utf8"));
            for (const entry of data) {
                try {
                    console.info("Executing query:", entry.query);
                    await db.sequelize.query(entry.query);
                } catch (err) {
                    console.error("Error executing query:", err);
                }
            }
        }
    }
    console.info("Database population complete.");
}

module.exports = { populateDatabase };
