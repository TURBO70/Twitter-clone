const{
    signup,
    login,
}=require('../controllers/authController.controllers');


const router=require('express').Router();

router.post('/signup',signup);
router.post('/login',login);


module.exports=router;
