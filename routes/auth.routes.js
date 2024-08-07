const{
    signup,
    login,
    follow,
    unfollow,
    search,
    randomuser,
    editInfo,
    getUser,

}=require('../controllers/authController.controllers');


const router=require('express').Router();
// Route to signup 
router.post('/signup',signup);

// Route to login
router.post('/login',login);

//Route to follow
router.post('/follow',follow);

//Route to unfollow
router.post('/unfollow',unfollow);

//Route to search
router.post('/search',search);

//Route to randomuser
router.get('/randomuser',randomuser);

//Route to editInfo
router.post('/editInfo',editInfo);

//Route to getUser
router.get('/getUser',getUser);

module.exports=router;
