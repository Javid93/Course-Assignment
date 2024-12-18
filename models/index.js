const Sequelize = require('sequelize');
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
require('dotenv').config(); //Get environment file (.env)
const connection = {
  database: process.env.DATABASE_NAME,
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  host: process.env.HOST,
  dialect: process.env.DIALECT,
  dialectmodel: process.env.DIALECTMODEL,
};
const sequelize = new Sequelize(connection);

//Check connection
sequelize
  .authenticate()
  .then(() => {
    console.info("Successfully connected to MySQL!");
  })
  .catch(function(err){
    console.error(err);
    process.exit(1);
  });

const db = {}
db.sequelize = sequelize

//find and create models based on files in the directory
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) &&   
      (file.slice(-3) === '.js');
    })
  .forEach(file => {    
    const model = require(path.join(__dirname, file))(sequelize,   
      Sequelize);
    db[model.name] = model;
  });
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
