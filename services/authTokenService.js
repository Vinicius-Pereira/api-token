const userDB = require('../db/userDB')
const bcrypt = require('bcrypt');
const { json } = require('express/lib/response');
const jwt = require("jsonwebtoken");

// REGISTER A USER
const createUserAuth = async (user, password) =>
{
    try
    {
        var hashedPassword = await bcrypt.hash(password, 10);
        var result = await userDB.createUser(user, hashedPassword);
        return result;
    }
    catch (e)
    {
        throw new Error(e.message);
    }
};

// LOGIN
const authUser = async (user, password) =>
{
    try
    {
        const row = await userDB.getUserByEmail(user);
        if(row.length < 1)
        {
            return -1;
        }
        var user = Object.assign({}, row[0]);
        if(await bcrypt.compare(password, user.password))
        {
            var accessToken = generateAccessToken(user);
            var refreshToken = generateRefreshToken(user);
            return JSON.stringify({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        }
        else
        {
            return -1;
        }
    }
    catch (e)
    {
        throw new Error(e.message);
    }
};

// REFRESH

const refreshUserToken = async (user, token) =>
{
    try
    {
        const row = await userDB.getUserByEmail(user);
        if(row.length < 1)
        {
            return -1;
        }
        var user = Object.assign({}, row[0]);
        var token = await userDB.getRefreshToken(user, token);
        if(token.length < 1)
        {
            return -1;
        }
        var accessToken = generateAccessToken(user);
        var refreshToken = generateRefreshToken(user);

        return JSON.stringify(
        {
            accessToken: accessToken,
            refreshToken: refreshToken
        });

    }
    catch (e)
    {
        throw new Error(e.message);
    }
};

const logoutUserToken = async (user, token) =>
{
    try
    {
        const row = await userDB.getRefreshTokenByEmail(user, token);
        if(row.length < 1)
        {
            return -1;
        }
        var objToken = Object.assign({}, row[0]);
        await userDB.deleteRefreshToken(objToken.user_id, token);
        return 1;
    }
    catch (e)
    {
        throw new Error(e.message);
    }
}

// TOKEN FUNCTIONS
function generateAccessToken(user)
{
    return jwt.sign({user: user.email}, process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: "15m"
    });
}

function generateRefreshToken(user)
{
    var refreshToken = jwt.sign({user: user.email}, process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: "20m"
    });
    userDB.setRefreshToken(user.id, refreshToken);
    return refreshToken;
}


module.exports = {
    createUserAuth,
    authUser,
    refreshUserToken,
    logoutUserToken
};