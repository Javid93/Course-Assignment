module.exports = (sequelize, Sequelize) => {
    const UserClub = sequelize.define('UserClub', {
    },{
        timestamps: false,
        hastrigger: true
    });
	return UserClub
}