class ClubService {
    constructor(db) {
        this.client = db.sequelize;
        this.Club = db.Club;
        this.User = db.User;
        this.UserClub = db.UserClub;
    }

    async getOne(clubId) {
        return await this.Club.findOne({
            where: {
                id: clubId
            }
        }).catch(function (err) {
            console.log(err);
        });
    }

    async getAllClubs() {
        try {
            const clubs = await this.Club.findAll();
            return clubs;
        } catch (error) {
            console.error("Error getting clubs:", error);
            throw error;
        }
    }

    //Admin adds a new club
    async addClub(clubName, clubDescription, dateCreated) {
        await this.client.query(
            'INSERT INTO clubs (Name, Description, ClubCreatedDate) VALUES (?, ?, ?)',
            { replacements: [clubName, clubDescription, dateCreated], type: this.client.QueryTypes.INSERT }
        );
        
        return;
    }

    //Admin deletes a club
    async deleteClub(clubId) {
        return this.Club.destroy({
            where: { id: clubId },
            raw: true
        })
    }

    //Get club Details
    async getClubDetails(clubId) {
        const club = await this.client.query('SELECT * FROM Clubs where id = ' + clubId, {
            type: this.client.QueryTypes.SELECT
        });
        console.log(club);
        return club;
    }

    //Get a user's clubs
    async getUserClubs(userId) {
        const clubs = await this.client.query('SELECT * FROM Clubs, UserClubs where Clubs.id = UserClubs.ClubId AND UserClubs.UserId = ' + userId, {
            type: this.client.QueryTypes.SELECT
        });
        console.log(clubs);
        return clubs;
    }

    //Get a user's club IDs
    async getUserClubIds(userId) {
        const clubs = await this.client.query('SELECT ClubId FROM UserClubs where UserClubs.UserId = ' + userId, {
            type: this.client.QueryTypes.SELECT
        });
        console.log(clubs);
        return clubs;
    }

    //User joins a club
    async joinClub(clubId, userId) {
        return this.UserClub.create(
            {
                UserId: userId,
                ClubId: clubId
            }
        ).catch(function (err) {
            console.log(err);
        });
    }
}
module.exports = ClubService;