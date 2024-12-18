module.exports = (sequelize, Sequelize) => {
    const Club = sequelize.define('Club', {
        Name: Sequelize.DataTypes.STRING,
        Description: Sequelize.DataTypes.STRING,
        ClubCreatedDate: Sequelize.DataTypes.DATEONLY,
    },{
        timestamps: false,
    }, 
    );

	return Club
};