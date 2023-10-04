const { create, fetchUser, updatePasswords, getUsers,getUser, logoutUsers ,logoutdetails} = require("./auth.services");
const { genSaltSync, hashSync} = require("bcrypt");
const { get } = require("express/lib/response");
var nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const SMTPConnection = require("nodemailer/lib/smtp-connection");

module.exports = {
    login:(req,res) => {
        const body = req.body;

        fetchUser(body, (err, results) => {
            if(err){
                // console.log(err);
                return res.status(500).json( {
                    success:0,
                    status:500,
                    error:err           
                }); 
            }
            else{
                return res.status(200).json({
                    success:1,
                    data:{
                        userToken:results.token,
                        userRole:results.userRole,
                        userCompany:results.company,
                        empid:results.empid              
                    },
                    status:200
                });
            }            
        });
    },
    createUser:(req,res) =>{
        const body = req.body;    
        const salt = genSaltSync(10);
        body.pass = body.password;
        body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
            if(err){
                // console.log(err);
                return res.status(500).json( {
                    success:0,
                    status:500,
                    error:err
                }); 
            }
            else{
                

                var mailReq = {
                    to:results.email,
                    subject:"Login credentials",
                    text:"Your Login password for "+results.email+" is "+results.password
                };
        
                mail(mailReq,res); 
            }            
        });
    }, 
    //defining 
    // function (a,b){
    //     return a+b;
    // }

    // console.log(callback(5,1));//6


    getCompanyUsers:(req,res)=>{
        var companyCode = req.headers['companycode'];
        getUsers(companyCode,(err,empty,results)=>{
            if(err){
                // console.log(err);
                return res.status(500).json( {
                    success:0,
                    status:500,
                    error:err
                }); 
            }
            else if(empty){
                return res.status(401).json( {
                    success:0,
                    status:401,
                    error:err
                });
            }
            else{
                return res.status(200).json({
                    success:1,
                    data:results,
                    status:200
                });
            } 
        });
      
    },
    getUsers:(req,res)=>{
        var companyCode = req.headers['companycode'];
        getUser(companyCode,(err,empty,results)=>{
            if(err){
                // console.log(err);
                return res.status(500).json( {
                    success:0,
                    status:500,
                    error:err
                }); 
            }
            else if(empty){
                return res.status(401).json( {
                    success:0,
                    status:401,
                    error:err
                });
            }
            else{
                return res.status(200).json({
                    success:1,
                    data:results,
                    status:200
                });
            } 
        });
      
    },
    updatePassword:(req,res) =>{
        const body = req.body;    
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updatePasswordS(body, (err, results) => {
            if(err){
                // console.log(err);
                return res.status(500).json( {
                    success:0,
                    status:500,
                    error:err
                }); 
            }
            else{
                return res.status(200).json({
                    success:1,
                    data:results,
                    status:200
                });
            }            
        });
    },
    logoutUser:(req,res)=>{
        const body=req.body;
        logoutUsers(body,(err,results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    status:500,
                    error:err
                });

            }
            else{
                return res.status(200).json({
                    success:1,
                    data:results,
                    status:200
                });
            }
        })
    },
    logoutdetail:(req,res) => {
        logoutdetails((err,empty,results) => {
                if(err){
                    return res.status(500).json({
                        success:0,
                        status:500,
                        error:err
                    });
                }else if(empty){
                    return res.status(401).json( {
                        success:0,
                        status:401,
                        error:err
                    });
                }else{
                    return res.status(200).json({
                        success:1,
                        data:results,
                        authData:req.authData,
                        status:200
                    });
                }
        });
    },

    verifyToken:(req, res, next) => {
        //get the auth header value
        const bearerHeader = req.headers['authorization'];
        if(typeof bearerHeader !== "undefined"){
            const bearer = bearerHeader.split(":");
            const bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err){
                    res.status(403).json({
                        success:0,
                        status:500,
                        error:err
                    });
                }
                else{   
                    req.authData = authData;                
                    next();
                    // res.status(403).json({
                    //     authData,
                    //     status:200
                    // });
                }
            });

            
           
        }else{
            res.status(403).json({
                error:"unauthenticated",
                status:403
            });
        }
    },  

    otpGeneration:(req,res) => {    

        var mailReq = {
            to:"acharygmail.com",
            subject:"Mail from nodejs",
            text:"hello"
        };

        mail(mailReq,res); 
    },  
};



const mail = (mailReq,res) => { 

    var transporter = nodemailer.createTransport({
            service: 'gmail',       
            PORT:465,
            auth: {
                user: process.env.EMAILID,
                pass: process.env.PASSWORD
            },
            logger:true,
            debug:true
    });

    var infos = "information";
    var err = "error";

    transporter.sendMail(mailReq, function(error, info){
        if (error) {
            console.log(error);
            //mailReq.err = error;            
        } else {

        console.log('Email sent: ' + info.response);        
            return res.json({
                success:1,
                subject:mailReq.subject,
                data:"message sent"
            });             

        }
    }); 
    
};