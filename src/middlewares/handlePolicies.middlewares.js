import passport from "passport";

const handlePolicies = (policies) => {
    if(policies.includes('PUBLIC')) {
        return (req, res, next) => {
            next();
        }
    };
    return async (req, res, next) => {
        passport.authenticate('jwt', function(err, user, info) {
            if(err) return next(err);

            if(!user) {
                return res.status(401).json({status: 'error', message: 'Debes ser un usuario registrado para ver esta página'});
            }

            if(!policies.includes(user.user.role.toUpperCase())) {
                return res.status(403).json({status: 'error', message: 'No tiene autorización para ver esta página'});
            }

            req.user = user.user
            next();
        }) (req, res, next);
    };
};

export default handlePolicies;