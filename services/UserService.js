class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
    }
    async create(fullName, username, password, email, ssn, gender, religion, role) {
        try{
            const newUser = await this.User.create({
                fullName: fullName,
                username: username,
                password: password,
                email: email,
                ssn: ssn,
                gender: gender,
                religion: religion,
                role: role
            });
        }catch(error){
            if(error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Username is taken. Please select another.');
            }else{
                throw new Error('An error occurred while creating the user.');
            }
        }
    }

    async getOne(userId) {
        return await this.User.findOne({
            where: {id: userId}
        }).catch(function(err){
            console.log(err);
        });
    }

    async getOneByName(username) {
        return await this.User.findOne({
            where: {username: username}
        }).catch(function(err){
            console.log(err);
        });
    }

    //Get a specific user's Details using Sequelize RAW Query
    async getUserDetails(userId) {
        const user = await this.client.query('SELECT * FROM Users WHERE id = ' + userId, {
            type: this.client.QueryTypes.SELECT
        });
        return user;  
    }
}
module.exports = UserService;