const express = require('express');

const authController = require('../controllers/authUserController');

const router = express.Router();

const
{
    body,
    validationResult
} = require('express-validator');

// API Token 
router.post('/registerUserToken',
    body("user")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email."),
    body("password")
    .isLength(
    {
        min: 8
    })
    .withMessage("Must have at least 8 characters."), validatorMessage,
    authController.registerAuthUser);

router.post('/loginUserToken',
    body("user")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email."),
    body("password")
    .not()
    .isEmpty()
    .withMessage("Must have a password."), validatorMessage,
    authController.loginAuthUser);

router.post('/refreshToken',
    body("user")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email."),
    body("token")
    .not()
    .isEmpty()
    .withMessage("Must have a token."), validatorMessage,
    authController.refreshAuthUser);

router.post('/logoutToken',
    body("user")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email."),
    body("token")
    .not()
    .isEmpty()
    .withMessage("Must have a token."), validatorMessage,
    authController.logoutAuthUser);



function validatorMessage(req, res, next)
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400)
            .json(
            {
                errors: errors.array()
            });
    }
    next();
}

module.exports = router;