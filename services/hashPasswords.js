require('dotenv').config(); 
const bcrypt = require('bcrypt');
const db = require('../models'); 

async function hashExistingPasswords() {
    try {
        const users = await db.User.findAll();
        for (const user of users) {
            if (!user.password.startsWith('$2b$')) { 
                console.log(`Hashing password for user: ${user.username}`);
                const hashedPassword = await bcrypt.hash(user.password, 10);
                user.password = hashedPassword;
                await user.save();
            }
        }
        console.log("All existing plaintext passwords hashed successfully.");
    } catch (error) {
        console.error("Error hashing passwords:", error);
    } finally {
        process.exit(); 
    }
}

db.sequelize.sync({ force: false }).then(() => {
    console.log("Database synced successfully.");
    hashExistingPasswords();
}).catch((error) => {
    console.error("Error syncing database:", error);
    process.exit(1);
});
