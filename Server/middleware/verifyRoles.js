const verifyRoles = (...validRoles) => {
    return (req, res, next) => {
        console.log(validRoles);
        console.log(req.roles);
        if (!req?.roles || typeof req.roles !== 'object') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const roleIDs = Object.values(req.roles);
        const validRoleIDs = validRoles;  // Use validRoles directly

        const result = roleIDs.some(roleID => validRoleIDs.includes(roleID));

        if (!result) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // There was a valid role, allowing access to the route
        next();

    }
}

module.exports = verifyRoles;