const authUserService = require('../services/authTokenService');

const registerAuthUser = async (req, res, next) =>
{
    console.log(req.body);
    const{ user, password } = req.body;
    try
    {
        res.set("Content-Type", "application/json");
        var result = await authUserService.createUserAuth(user, password);
        if(result)
        {
            res.status(201).send(JSON.stringify({message: "Register successfully!"}));
        }
        else
        {
            res.status(403).send(JSON.stringify({message: "Failed to register."}));
        }
        next();
    }
    catch (e)
    {
        res.status(500).send(JSON.stringify({message: "Invalid Operation."}));
    }
};

const loginAuthUser = async (req, res, next) =>
{
    const{ user, password } = req.body;
    try
    {
        res.set("Content-Type", "application/json");
        var tokens = await authUserService.authUser(user, password);
        if(tokens == -1)
        {
            res.status(401).send(JSON.stringify({message: "User or password incorrect!"}));
            next();
        }
        res.status(201).send(tokens);

    }
    catch (e)
    {
        res.status(500).send(JSON.stringify({message: "Invalid Operation."}));
    }
}

const refreshAuthUser = async (req, res, next) =>
{
    try
    {
        res.set("Content-Type", "application/json");
        const{user, token } = req.body;
        if(!token)
        {
            res.status(401).send(JSON.stringify({message: "Invalid Token."}));
        }
        var tokens = await authUserService.refreshUserToken(user, token);
        if(tokens === -1)
        {
            res.status(401).send(JSON.stringify({message: "Invalid Token."}));
            next();
        }
        res.status(201).send(tokens);
        
    }
    catch (e)
    {
        console.log(e.message);
        res.status(500).send(JSON.stringify({message: "Invalid Operation."}));
    }
}

const logoutAuthUser = async (req, res, next) =>
{
    try
    {
        res.set("Content-Type", "application/json");
        const{ user, token } = req.body;
        if(!token)
        {
            res.status(401).send(JSON.stringify({message: "Invalid Token."}));
        }
        const result = await authUserService.logoutUserToken(user, token);
        if(result === -1)
        {
            res.status(401).send(JSON.stringify({message: "Invalid Token."}));
        }
        else
        {
            res.status(201).send(JSON.stringify({message: "Logout successfully!"}));
        }
        next();
    }
    catch (e)
    {
        console.log(e.message);
        res.status(500).send(JSON.stringify({message: "Invalid Operation."}));
    }

}
module.exports = {
    registerAuthUser,
    loginAuthUser,
    refreshAuthUser,
    logoutAuthUser
};