module.exports = {
    checkIfAuthorized: function(req, res, next) {
        if(!req.user) {
            console.log("Access Error");
            return res.status(401).json({ message: "Access Error" });
        }
        console.log(req.user);
        if(req.user.role !== 'admin' && req.user.role !== 'student') {
            console.log("Unauthorized access");
            return res.status(401).json({ message: "Unauthorized" });
        }
        return next();
    },
    
    isAdmin: function(req, res, next) {
        if(typeof req.user != 'undefined'){
            if(req.user.role === "admin") {
                next();
                return;
            }else{
                res.redirect('/login');
            }
        }else{
            // res.status(401).send(new Error());
            res.redirect('/login');
        }
    },
}