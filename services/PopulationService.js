// Populate Database
const fs = require("fs");
const db = require("../models");

async function populateDatabase(){
    // Retrieve file order
    const fileOrder = fs.readFileSync('./public/json/fileOrder.json', 'utf8');
    const files = JSON.parse(fileOrder);

    // Loop through JSON files
    for (const file of files) {
        console.info("Reading file:", file.file);
        const tableName = file.file.replace('.json', '');
        const tableCheck = db.sequelize.define(tableName);
        const count = await tableCheck.count();
        if (count === 0) {
            // If Table is empty, populate from relavant JSON file.
            let data = fs.readFileSync("./public/json/"+file.file, 'utf8'); 
            // ExtractSQL
            let queries = JSON.parse(data);
            for (const query of queries) {
                var runQuery = query.query;
                console.info("Creating query:", runQuery);
                try {
                    // Running query
                    await db.sequelize.query(runQuery);
                } catch (err) {
                    console.error(err);
                }
            }
        }else{
            // Only empty tables will be populated
            console.info("Table", tableName, "is not empty. Skipping this table's population");
        }
    }
    console.info("Database population complete");
}

// Run the function.
populateDatabase();