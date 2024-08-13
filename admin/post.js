// jd file for user

// step:1 import express and create router
const express = ("express");  
const router = express.Router();  
  
router.post("/signup");  // this route will handle all req going to api/user/signup

module.exports = router; 

