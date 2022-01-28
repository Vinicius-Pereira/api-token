const mysql = require('mysql2/promise');
const connect = require('../db/connect');

const insertUser = "INSERT INTO user (email, password) VALUES (?, ?);";
const selectUser = "SELECT * FROM user WHERE email = ?;";
const insertRefreshToken = "INSERT INTO refresh_token (user_id, token) VALUES (?, ?) ON DUPLICATE KEY UPDATE token = ?;";
const selectRefreshToken = "SELECT * FROM refresh_token WHERE user_id = ? AND token = ?;";
const selectRefreshTokenByEmail = "SELECT rf.* FROM refresh_token AS rf INNER JOIN user ON user.email = ? AND user.id = rf.user_id AND rf.token = ?;";
const deleteToken = "DELETE FROM refresh_token WHERE user_id = ?;";


const createUser = async (user, password) =>
{
    try
    {
        const con = await connect.connectDatabase();
        const [rows, fields] = await con.query(insertUser, [user, password], function(err)
        {
            if(err)
            {
                console.error('err from callback: ' + err.stack);
            }
        });
        return true;
    }
    catch (error)
    {
        throw new Error(error.message);
    }


};

const getUserByEmail = async (user, password) =>
{
    try
    {
        const con = await connect.connectDatabase();
        const [rows, fields] = await con.query(selectUser, [user, password], function(err)
        {
            if(err)
            {
                console.error('err from callback: ' + err.stack);
            }
        });
        return rows;
    }
    catch (error)
    {
        throw new Error(error.message);
    }
}

const setRefreshToken = async (id, token) =>
{
    try {
        const con = await connect.connectDatabase();
        const [rows, fields] = await con.query(insertRefreshToken, [id, token, token], function(err)
        {
            if(err)
            {
                console.error('err from callback: ' + err.stack);
            }
        });
        return true;
    } catch (error) {
        throw new Error(error.message);
    }

}

const getRefreshToken = async (user, token) =>
{
    try
    {
        const con = await connect.connectDatabase();
        const [rows, fields] = await con.query(selectRefreshToken, [user.id, token], function(err)
        {
            if(err)
            {
                console.error('err from callback: ' + err.stack);
            }
        });
        return rows;
    }
    catch (error)
    {
        throw new Error(error.message);
    }
}

const getRefreshTokenByEmail = async (email, token) =>
{
    try
    {
        const con = await connect.connectDatabase();
        const [rows, fields] = await con.query(selectRefreshTokenByEmail, [email, token], function(err)
        {
            if(err)
            {
                console.error('err from callback: ' + err.stack);
            }
        });
        return rows;
    }
    catch (error)
    {
        throw new Error(error.message);
    }
}

const deleteRefreshToken = async (id, token) =>
{
    try
    {
        const con = await connect.connectDatabase();
        const [rows, fields] = await con.query(deleteToken, [id, token], function(err)
        {
            if(err)
            {
                console.error('err from callback: ' + err.stack);
            }
        });
        return;
    }
    catch (error)
    {
        throw new Error(error.message);
    }
}

module.exports = {
    createUser,
    getUserByEmail,
    setRefreshToken,
    getRefreshToken,
    getRefreshTokenByEmail,
    deleteRefreshToken
}