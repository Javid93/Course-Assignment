const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        fullName: Sequelize.DataTypes.STRING,
        email: Sequelize.DataTypes.STRING,
        username: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        ssn: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        gender: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        religion: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        password: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "student"
        }
    }, {
        timestamps: false,
    });
    User.associate = function (models) {
        User.belongsToMany(models.Club, {through: models.UserClub});
    };
    return User
}