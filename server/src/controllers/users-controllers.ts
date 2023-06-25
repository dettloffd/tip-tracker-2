import { Request, Response, NextFunction } from "express";
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const DbConn = require("../config/db");
import dbInstance from '../config/db';
import {User} from '../types/types';
require('dotenv').config();

let pool = dbInstance.getPgClient();
let USER_TOKEN_KEY = 'supersecret_dont_share'
const signup = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(422).json({
        success: false,
        message: "Invalid inputs passed. Please check data",
      })
    }
  
    // const { email, password } = req.body;
    const { email, password } = req.body as { email: string; password: string };
  
    let existingUser: User | null;
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      existingUser = result.rows[0];
    } catch (err) {
        console.error('Error executing query:', err);
      return res.status(500).json({
        success: false,
        message: "Failed signup due to server issue; please try later",
      });
    }
  
    if (existingUser) {
      return res.status(422).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }
  
    let hashedPassword: string = '';

    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
     console.error('Error hashing password:', err);
      res.status(500).json({
        success: false,
        message: "Could not create user; please try again later",
      });
    }
  
    let createdUser;
    try {
      const result = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword]
      );
      createdUser = result.rows[0];
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "User creation failed due to server issue; please try later",
      });
    }
    
    let token;
    try {
      token = jwt.sign({ userId: createdUser.user_id, email: createdUser.email }, `${USER_TOKEN_KEY}`, { expiresIn: "1h" });
    } catch (err) {
        console.error('Error signing token:', err);
      return res.status(500).json({
        success: false,
        message: "User creation failed due to server issue; please try later",
      });
    }
  
    res.status(201).json({ success: true, createdUser, token: token });
  };

  ////////////////////////////////////////////
  const login = async (req : Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body as { email: string; password: string };
  
    let existingUser: User | null;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        existingUser = result.rows[0];
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Failed login due to server issue; please try later",
      });
    }
  
    if (!existingUser) {
  
      return res.status(403).json({
        // 403 => invalid credentials
        success: false,
        message: "Invalid credentials",
      });
    }
  
    let isValidPassword = false;
  
    try{
      isValidPassword = await bcrypt.compare(password, existingUser.password);
      // returns a boolean
  
    } catch (err){
      return res.status(500).json({
        // Serverside error: will only return error in case of server error
        success: false,
        message: "Could not log you in! Please check credentials and try again",
      });
  
    }
  
    if (!isValidPassword){
      return res.status(401).json({
        // Credentials error: will only return error in case of incorrect credentials/password
        success: false,
        message: "Invalid credentials! Please check your password and try again.",
      });
  
    }
  
    let token;
    try{
        token = jwt.sign({userId: existingUser.user_id, email: existingUser.email}, `${USER_TOKEN_KEY}`, {expiresIn: "1h"});
        // "id" provided by mongoose for every document created..
    } catch (err){
        console.error('Error signing token:', err);
      return res.status(500).json({
        success: false,
        message: "Logging in failed due to server issue! Please try later.",
      });
    }
  
    return res.json({
      success: true,
      message: "Logged in!",
      existingUser,
    //   existingUser,
      // user: existingUser.toObject(),
      // userId: existingUser.id,
      // email: existingUser.email,
      token: token
    });
  };

  exports.signup = signup;
  exports.login = login;