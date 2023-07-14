const user = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "ankitpansheriya123@gmail.com",
    pass: "kfrexsoxsevhnkdn",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const signUp = async (req, res) => {
  try {
    const exist = await user.find({ email: req.body.email });
    if (exist.length > 0) {
      res.status(501).send("User already exists");
      return; // Return from the function after sending the response
    }

    const isValidEmail = validator.isEmail(req.body.email); // Add email validation
    if (!isValidEmail) {
      res.status(400).send("Invalid email address");
      return; // Return from the function after sending the response
    }

    const hash = await bcrypt.hash(req.body.password, 10); // Use bcrypt.hash with await

    const userData = new user({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      email: req.body.email,
      password: hash,
    });

    const token = jwt.sign(
      {
        email: userData.email,
        userId: userData._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 5, // expiresIn value should be a number, not a string
      }
    );

    userData.emailToken = token;

    var mailoption = {
      from: "Event Management",
      to: userData.email,
      subject: "event Management - verify your email",
      html: `
        <html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Lastbit</title>
</head>

<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"
style="margin: 0pt auto; padding: 0px; background:#E3EEFE;">
<table id="main" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0"
bgcolor="#E3EEFE">
<tbody>
  <tr>
    <td valign="top">
      <table class="innermain" cellpadding="0" width="580" cellspacing="0" border="0"
      bgcolor="#E3EEFE" align="center" style="margin:0 auto; table-layout: fixed;">
        <tbody>
          <tr>
            <td colspan="4">
              <table class="logo" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tbody>
                  <tr>
                    <td colspan="2" height="30"></td>
                  </tr>
                  <tr>
                    <td valign="top" align="center">
                     
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" height="30"></td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Main CONTENT -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
              style="border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <tbody>
                  <tr>
                    <td height="40"></td>
                  </tr>
                  <tr style="font-family: -apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,&#39;Roboto&#39;,&#39;Oxygen&#39;,&#39;Ubuntu&#39;,&#39;Cantarell&#39;,&#39;Fira Sans&#39;,&#39;Droid Sans&#39;,&#39;Helvetica Neue&#39;,sans-serif; color:#4E5C6E; font-size:14px; line-height:20px; margin-top:20px;">
                    <td class="content" colspan="2" valign="top" align="center" style="padding-left:90px; padding-right:90px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
                        <tbody>
                          <tr>
                            <td align="center" valign="bottom" colspan="2" cellpadding="3">
                              <img alt="lastbit" width="200" src="https://i.imgur.com/LXjRs5h.gif"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td height="30" &nbsp;=""></td>
                          </tr>
                          <tr>
                            <td align="center"> <span style="color:#00204A;font-size:22px;line-height: 24px;">
   Hey ${userData.firstName}
  </span>

                            </td>
                          </tr>
                          <tr>
                            <td height="24" &nbsp;=""></td>
                          </tr>
                          <tr>
                            <td height="1" bgcolor="#DAE1E9"></td>
                          </tr>
                          <tr>
                            <td height="24" &nbsp;=""></td>
                          </tr>
                          <tr>
                            <td align="center"> <span style="color:#00204A;font-size:14px;line-height:24px;">
   please verify your email to continue...
  </span><p style="color:#00204A;font-size:14px;line-height:24px;">
    If you did not make this request, just ignore this email. Otherwise, please click the button below to verify your email:
  </p>

                            </td>
                          </tr>
                          <tr>
                            <td height="20" &nbsp;=""></td>
                          </tr>
                          <tr>
                            <td valign="top" width="50%" align="center"> <span>
    <a href="http://${req.headers.host}/api/verify/signup?token=${userData.emailToken}" style="display:block; padding:15px 25px; background-color:#448EF6; color:#ffffff; border-radius:7px; text-decoration:none;">Verify Email</a>
  </span>

                            </td>
                          </tr>
                          <tr>
                            <td height="20" &nbsp;=""></td>
                          </tr>
                          <tr>
                            <td align="center">
                              <img src="https://i.imgur.com/FjvPESc.png" width="54"
                              height="2" border="0">
                            </td>
                          </tr>
                         
                          
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td height="60"></td>
                  </tr>
                </tbody>
              </table>
           
              <table id="promo" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
                <tbody>
                  <tr>
                    <td colspan="2" height="20"></td>
                  </tr>
                 
                  <tr>
                    <td colspan="2" height="20"></td>
                  </tr>
                  
                  <tr>
                    <td colspan="2" height="20"></td>
                  </tr>
                </tbody>
              </table>
           
             
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tbody>
                  <tr>
                    <td height="10">&nbsp;</td>
                  </tr>
                  <tr>
                   
                  </tr>
                  <tr>
                    <td height="50">&nbsp;</td>
                  </tr>
                </tbody>
              </table>
              
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</tbody>
</table>
</body>

</html>
        `,
    };

    transporter.sendMail(mailoption, function (error, info) {
      if (error) {
        console.log(error);
        res.status(404).json({
          message: "Invalid email",
        });
        return; // Return from the function after sending the response
      } else {
        console.log("Verification email sent successfully", info.response);
        userData.save().then((register) => {
          res.status(200).send(register);
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};

const verify = async (req, res, next) => {
  try {
    const token = req.query.token;
    const userData = await user.findOne({ emailToken: token });
    if (userData) {
      userData.emailToken = null;
      userData.isVerified = true;
      await userData.save();
      res.send(
        `
       <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
    <link href='https://fonts.googleapis.com/css?family=Lato:300,400|Montserrat:700' rel='stylesheet' type='text/css'>
    <style>
      @import url(//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css);
      @import url(//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css);
    </style>
    <link rel="stylesheet" href="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/default_thank_you.css">
    <script src="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/jquery-1.9.1.min.js"></script>
    <script src="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/html5shiv.js"></script>
  </head>
  <body>
    <header class="site-header" id="header">
      <h1 class="site-header__title" data-lead-id="site-header-title">THANK YOU!</h1>
    </header>
  
    <div class="main-content">
      <i class="fa fa-check main-content__checkmark" id="checkmark"></i>
      <p class="main-content__body" data-lead-id="main-content-body">Thank you for joining us your registration has successfylly done we will provide your id and password in 24 hours </p>
    </div>
  
    <footer class="site-footer" id="footer">
      <p class="site-footer__fineprint" id="fineprint">Copyright ©2014 | All Rights Reserved</p>
    </footer>
  </body>
  </html>
       `
      );
    } else {
      res.status(400).send("not verified");
    }
  } catch (error) {
    console.log(error);
  }
};

const signIn = async (req, res) => {
  const exist = await user.findOne({ email: req.body.email });
  console.log("exist", exist);
  if (exist === null) {
    res.status(400).send("user not exist");
  } else if (exist.isVerified === true) {
    await bcrypt.compare(req.body.password, exist.password, (err, result) => {
      if (err) {
        res.status(400).send({
          error: err,
        });
      } else {
        if (result === true) {
          res.status(200).send({
            result: result,
            user: exist,
          });
        } else {
          res.status(400).send("password is wrong");
        }
      }
    });
  } else {
    res.status(400).send("user not verified");
  }
};

const verifyUser = async (req, res) => {
  try {
    let email = req.body.email;
    var users = await user.findOne({ email: email });
    console.log("dataaa=>>", users);
    if (users?.email === email && users?.isVerified === true) {
      const token = jwt.sign(
        {
          email: users.email,
          userId: users._Id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: 60 * 5,
        }
      );

      var mailoption = {
        from: "Event Management",
        to: users.email,
        subject: "Event Management - Reset You Password",
        html: `
         
          
          
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Event Management</title>
</head>

<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"
style="margin: 0pt auto; padding: 0px; background:#E3EEFE;">
<table id="main" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0"
bgcolor="#E3EEFE">
<tbody>
  <tr>
    <td valign="top">
      <table class="innermain" cellpadding="0" width="580" cellspacing="0" border="0"
      bgcolor="#E3EEFE" align="center" style="margin:0 auto; table-layout: fixed;">
        <tbody>
          <tr>
            <td colspan="4">
              <table class="logo" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tbody>
                  <tr>
                    <td colspan="2" height="30"></td>
                  </tr>
                  <tr>
                    <td valign="top" align="center">
                     
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" height="30"></td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Main CONTENT -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
              style="border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <tbody>
                  <tr>
                    <td height="40"></td>
                  </tr>
                  <tr style="font-family: -apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,&#39;Roboto&#39;,&#39;Oxygen&#39;,&#39;Ubuntu&#39;,&#39;Cantarell&#39;,&#39;Fira Sans&#39;,&#39;Droid Sans&#39;,&#39;Helvetica Neue&#39;,sans-serif; color:#4E5C6E; font-size:14px; line-height:20px; margin-top:20px;">
                    <td class="content" colspan="2" valign="top" align="center" style="padding-left:90px; padding-right:90px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
                        <tbody>
                          <tr>
                            <td align="center" valign="bottom" colspan="2" cellpadding="3">
                              <img alt="lastbit" width="200" src="https://i.imgur.com/LXjRs5h.gif"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td height="30" &nbsp;=""></td>
                          </tr>
                          <tr>
                            <td align="center"> <span style="color:#00204A;font-size:22px;line-height: 24px;">
   Hey ${users.firstName}
  </span>

                            </td>
                          </tr>
                          <tr>
                            <td height="24" &nbsp;=""></td>
                          </tr>
                          <tr>
                            <td height="1" bgcolor="#DAE1E9"></td>
                          </tr>
                          <tr>
                            <td height="24" &nbsp;=""></td>
                          </tr>
                          <tr>
                            <td align="center"> <span style="color:#00204A;font-size:14px;line-height:24px;">
   please Reset Your Password to continue...
  </span><p style="color:#00204A;font-size:14px;line-height:24px;">
    If you did not make this request, just ignore this email. Otherwise, please click the button below to reset your password:
  </p>

                            </td>
                          </tr>
                          <tr>
                            <td height="20" &nbsp;=""></td>
                          </tr>
                          <tr>
                            <td valign="top" width="50%" align="center"> <span>
    <a href="http://${req.headers.host}/api/reset/password?id=${users.id}&token=${token}" style="display:block; padding:15px 25px; background-color:#448EF6; color:#ffffff; border-radius:7px; text-decoration:none;">Reset Password</a>
  </span>

                            </td>
                          </tr>
                          <tr>
                            <td height="20" &nbsp;=""></td>
                          </tr>
                          <tr>
                            <td align="center">
                              <img src="https://i.imgur.com/FjvPESc.png" width="54"
                              height="2" border="0">
                            </td>
                          </tr>
                         
                          
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td height="60"></td>
                  </tr>
                </tbody>
              </table>
           
              <table id="promo" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
                <tbody>
                  <tr>
                    <td colspan="2" height="20"></td>
                  </tr>
                 
                  <tr>
                    <td colspan="2" height="20"></td>
                  </tr>
                  
                  <tr>
                    <td colspan="2" height="20"></td>
                  </tr>
                </tbody>
              </table>
           
             
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tbody>
                  <tr>
                    <td height="10">&nbsp;</td>
                  </tr>
                  <tr>
                   
                  </tr>
                  <tr>
                    <td height="50">&nbsp;</td>
                  </tr>
                </tbody>
              </table>
              
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</tbody>
</table>
</body>

</html>
        `,
      };
      transporter.sendMail(mailoption, function (error, info) {
        if (error) {
          console.log(error);
          res.status(500).json({
            message: "invalid email",
          });
        } else {
          console.log("verification email sent successfully ", info.response);
          console.log("userEmail",users.email)
       user.findOne({email : users.email}).then((result) => {
          console.log("]]]]]]]]]]]data",result)
          result.passToken = token
          result.save();
        })
         
          res.status(200).send("mail is sent successfully");
        }
      });
    } else {
      res.status(400).send("email not exist");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const resetLink = async (req, res, next) => {
  try {
    let id = req.query.id;

   const doc =  await user
      .findOne({ passToken: req.query.token })
      
     
        console.log("result", doc);
        if (doc) {
          user.findOne({
            passToken: req.query.token,
          
          }).then((result) => {
            result.passToken = null 
            result.save()
            res.send(
              `
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Event Management</title>
             <!-- Tailwind-CSS CDN  -->
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.4.6/tailwind.min.css" />
            </head>
            <style>
  body{
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
  }
  h2{
    font-weight:700;
    font-size:45px;
    margin-top:20px;
    text-align: center;
  }
  h4{
    font-weight:700;
    font-size:22px;
    margin-top:20px;
    color:white;
    text-align:center;
  }
            input[type=submit] {
              background-color: #04AA6D;
              color: white;
            }
            
            input {
              width: 100%;
              padding: 12px;
              border: 1px solid #ccc;
              border-radius: 4px;
              box-sizing: border-box;
              margin-top: 6px;
              margin-bottom: 16px;
            }
            .container {
              background-color: #f1f1f1;
              padding: 20px;
              width:30%;
              margin-top:30px;
            }
            
            @media (max-width: 480px) {
             .container{
              width:80%;
              }
              #message p {
                  font-size: 18px !important;
                  padding:0 !important;
              }
          }
  
          @media (min-width: 481px) and (max-width: 767px) {
            .container{
              width:60%;
              }
        }
  
        @media (min-width: 768px) and (max-width: 1024px){
          .container{
            width:60%;
            }
      }
  
            #message {
              display:none;
              background: #f1f1f1;
              color: #000;
              position: relative;
              padding: 20px;
              margin-top: 10px;
            }
            
            #message p {
              padding: 10px 35px;
              font-size: 18px;
            }
            
  
            .valid {
              color: green;
            }
            
            .valid:before {
              position: relative;
              left: -20px;
              content: "✔";
            }
            
           
            .invalid {
              color: red;
            }
            
            .invalid:before {
              position: relative;
              left: -20px;
              content: "✖";
            }
            </style>
            <body class="bg-blue-500" >
            <h4>please do not refresh this page till process is not complete
            <h2>Event Management</h2>
              <div class="container mx-auto p-2">
               
                  <div class="text-center mb-8">
                    <h1 class="font-bold text-2xl font-bold">Reset your Password</h1>
                  </div>
                  <form action="http://${req.headers.host}/api/setpassword/${id}" method="post">
                    <div class="mt-5">
                      
                     
      <label for="psw">Password</label>
      <input type="password" id="psw" name="password"  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required>
                    <div class="mt-10">
                      <input
                        type="submit"
                        value="Submit"
                        class="py-3 mt-0 bg-green-500 hover:bg-green-600 rounded text-white text-center w-full"
                      />
                    </div>
                  </form>
                  <div id="message">
    <h3>Password must contain the following:</h3>
    <p id="symbol" class="invalid">Minimum <b>1 symbol</b></p>
      <p id="letter" class="invalid">A <b>lowercase</b> letter</p>
  <p id="capital" class="invalid">A <b>capital (uppercase)</b> letter</p>
  <p id="number" class="invalid">A <b>number</b></p>
  <p id="length" class="invalid">Minimum <b>8 characters</b></p>
  
              </div>
            
  
              <script>
            
  var myInput = document.getElementById("psw");
  var letter = document.getElementById("letter");
  var capital = document.getElementById("capital");
  var number = document.getElementById("number");
  var length = document.getElementById("length");
  var symbol = document.getElementById("symbol"); 
  
  myInput.onfocus = function() {
    document.getElementById("message").style.display = "block";
  }
  
  
  myInput.onblur = function() {
    document.getElementById("message").style.display = "none";
  }
  
  
  myInput.onkeyup = function() {
    
    var symbols = /[!@#$%^&*_=+-]/g;
    if(myInput.value.match(symbols)) {
      symbol.classList.remove("invalid");
      symbol.classList.add("valid");
    } else {
      symbol.classList.remove("valid");
      symbol.classList.add("invalid");
    }
  
    var lowerCaseLetters = /[a-z]/g;
    if(myInput.value.match(lowerCaseLetters)) {
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
  }
  
    var upperCaseLetters = /[A-Z]/g;
    if(myInput.value.match(upperCaseLetters)) {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }
  
    var numbers = /[0-9]/g;
    if(myInput.value.match(numbers)) {
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }
    if(myInput.value.length >= 8) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
    
  
    
  }
  
  
  
  
  </script>
            </body>
          </html>
          
         `
            );
          })

          
        } else {
          res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Event Management</title>
        </head>
        <style>
       
@charset "UTF-8";

* {
  margin: 0;
  padding: 0;
  -webkit-text-size-adjust: none;
}

html, body {
  height: 100%;
  overflow: hidden;
}

body {
  padding: 0;
  margin: 0;
  background: #181828;
  font-size: 14px;
  line-height: 1;
}

label {
  cursor: pointer;
}

a {
  margin: 0;
  padding: 0;
  vertical-align: baseline;
  background: transparent;
  text-decoration: none;
  color: #000;
}

input, select, button, textarea {
  margin: 0;
  font-size: 100%;
}

html, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code, del, dfn, em, font, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li,
fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, input {
  border: 0;
  outline: 0;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent;
}


.top-header:before {
    background-image: url(https://1.bp.blogspot.com/-gxsOcYWghHA/Xp_izTh4sFI/AAAAAAAAU8s/y637Fwg99qAuzW9na_NT_uApny8Vce95gCEwYBhgL/s1600/header-footer-gradient-bg.png);
}
.top-header:before {
    content: '';
    display: block;
    width: 100%;
    height: 4px;
    background-repeat: repeat-x;
    background-size: contain;
    position: absolute;
    top: 0;
    left: 0;
  opacity:0.5;
}


.starsec{
  content: " ";
    position: absolute;
    width: 3px;
    height: 3px;
    background: transparent;
   box-shadow: 571px 173px #00BCD4, 1732px 143px #00BCD4, 1745px 454px #FF5722, 234px 784px #00BCD4, 1793px 1123px #FF9800, 1076px 504px #03A9F4, 633px 601px #FF5722, 350px 630px #FFEB3B, 1164px 782px #00BCD4, 76px 690px #3F51B5, 1825px 701px #CDDC39, 1646px 578px #FFEB3B, 544px 293px #2196F3, 445px 1061px #673AB7, 928px 47px #00BCD4, 168px 1410px #8BC34A, 777px 782px #9C27B0, 1235px 1941px #9C27B0, 104px 1690px #8BC34A, 1167px 1338px #E91E63, 345px 1652px #009688, 1682px 1196px #F44336, 1995px 494px #8BC34A, 428px 798px #FF5722, 340px 1623px #F44336, 605px 349px #9C27B0, 1339px 1344px #673AB7, 1102px 1745px #3F51B5, 1592px 1676px #2196F3, 419px 1024px #FF9800, 630px 1033px #4CAF50, 1995px 1644px #00BCD4, 1092px 712px #9C27B0, 1355px 606px #F44336, 622px 1881px #CDDC39, 1481px 621px #9E9E9E, 19px 1348px #8BC34A, 864px 1780px #E91E63, 442px 1136px #2196F3, 67px 712px #FF5722, 89px 1406px #F44336, 275px 321px #009688, 592px 630px #E91E63, 1012px 1690px #9C27B0, 1749px 23px #673AB7, 94px 1542px #FFEB3B, 1201px 1657px #3F51B5, 1505px 692px #2196F3, 1799px 601px #03A9F4, 656px 811px #00BCD4, 701px 597px #00BCD4, 1202px 46px #FF5722, 890px 569px #FF5722, 1613px 813px #2196F3, 223px 252px #FF9800, 983px 1093px #F44336, 726px 1029px #FFC107, 1764px 778px #CDDC39, 622px 1643px #F44336, 174px 1559px #673AB7, 212px 517px #00BCD4, 340px 505px #FFF, 1700px 39px #FFF, 1768px 516px #F44336, 849px 391px #FF9800, 228px 1824px #FFF, 1119px 1680px #FFC107, 812px 1480px #3F51B5, 1438px 1585px #CDDC39, 137px 1397px #FFF, 1080px 456px #673AB7, 1208px 1437px #03A9F4, 857px 281px #F44336, 1254px 1306px #CDDC39, 987px 990px #4CAF50, 1655px 911px #00BCD4, 1102px 1216px #FF5722, 1807px 1044px #FFF, 660px 435px #03A9F4, 299px 678px #4CAF50, 1193px 115px #FF9800, 918px 290px #CDDC39, 1447px 1422px #FFEB3B, 91px 1273px #9C27B0, 108px 223px #FFEB3B, 146px 754px #00BCD4, 461px 1446px #FF5722, 1004px 391px #673AB7, 1529px 516px #F44336, 1206px 845px #CDDC39, 347px 583px #009688, 1102px 1332px #F44336, 709px 1756px #00BCD4, 1972px 248px #FFF, 1669px 1344px #FF5722, 1132px 406px #F44336, 320px 1076px #CDDC39, 126px 943px #FFEB3B, 263px 604px #FF5722, 1546px 692px #F44336;
  animation: animStar 150s linear infinite;
}

.starthird
{
  content: " ";
    position: absolute;
    width: 3px;
    height: 3px;
    background: transparent;
   box-shadow: 571px 173px #00BCD4, 1732px 143px #00BCD4, 1745px 454px #FF5722, 234px 784px #00BCD4, 1793px 1123px #FF9800, 1076px 504px #03A9F4, 633px 601px #FF5722, 350px 630px #FFEB3B, 1164px 782px #00BCD4, 76px 690px #3F51B5, 1825px 701px #CDDC39, 1646px 578px #FFEB3B, 544px 293px #2196F3, 445px 1061px #673AB7, 928px 47px #00BCD4, 168px 1410px #8BC34A, 777px 782px #9C27B0, 1235px 1941px #9C27B0, 104px 1690px #8BC34A, 1167px 1338px #E91E63, 345px 1652px #009688, 1682px 1196px #F44336, 1995px 494px #8BC34A, 428px 798px #FF5722, 340px 1623px #F44336, 605px 349px #9C27B0, 1339px 1344px #673AB7, 1102px 1745px #3F51B5, 1592px 1676px #2196F3, 419px 1024px #FF9800, 630px 1033px #4CAF50, 1995px 1644px #00BCD4, 1092px 712px #9C27B0, 1355px 606px #F44336, 622px 1881px #CDDC39, 1481px 621px #9E9E9E, 19px 1348px #8BC34A, 864px 1780px #E91E63, 442px 1136px #2196F3, 67px 712px #FF5722, 89px 1406px #F44336, 275px 321px #009688, 592px 630px #E91E63, 1012px 1690px #9C27B0, 1749px 23px #673AB7, 94px 1542px #FFEB3B, 1201px 1657px #3F51B5, 1505px 692px #2196F3, 1799px 601px #03A9F4, 656px 811px #00BCD4, 701px 597px #00BCD4, 1202px 46px #FF5722, 890px 569px #FF5722, 1613px 813px #2196F3, 223px 252px #FF9800, 983px 1093px #F44336, 726px 1029px #FFC107, 1764px 778px #CDDC39, 622px 1643px #F44336, 174px 1559px #673AB7, 212px 517px #00BCD4, 340px 505px #FFF, 1700px 39px #FFF, 1768px 516px #F44336, 849px 391px #FF9800, 228px 1824px #FFF, 1119px 1680px #FFC107, 812px 1480px #3F51B5, 1438px 1585px #CDDC39, 137px 1397px #FFF, 1080px 456px #673AB7, 1208px 1437px #03A9F4, 857px 281px #F44336, 1254px 1306px #CDDC39, 987px 990px #4CAF50, 1655px 911px #00BCD4, 1102px 1216px #FF5722, 1807px 1044px #FFF, 660px 435px #03A9F4, 299px 678px #4CAF50, 1193px 115px #FF9800, 918px 290px #CDDC39, 1447px 1422px #FFEB3B, 91px 1273px #9C27B0, 108px 223px #FFEB3B, 146px 754px #00BCD4, 461px 1446px #FF5722, 1004px 391px #673AB7, 1529px 516px #F44336, 1206px 845px #CDDC39, 347px 583px #009688, 1102px 1332px #F44336, 709px 1756px #00BCD4, 1972px 248px #FFF, 1669px 1344px #FF5722, 1132px 406px #F44336, 320px 1076px #CDDC39, 126px 943px #FFEB3B, 263px 604px #FF5722, 1546px 692px #F44336;
  animation: animStar 10s linear infinite;
}

.starfourth
{
  content: " ";
    position: absolute;
    width: 2px;
    height: 2px;
    background: transparent;
   box-shadow: 571px 173px #00BCD4, 1732px 143px #00BCD4, 1745px 454px #FF5722, 234px 784px #00BCD4, 1793px 1123px #FF9800, 1076px 504px #03A9F4, 633px 601px #FF5722, 350px 630px #FFEB3B, 1164px 782px #00BCD4, 76px 690px #3F51B5, 1825px 701px #CDDC39, 1646px 578px #FFEB3B, 544px 293px #2196F3, 445px 1061px #673AB7, 928px 47px #00BCD4, 168px 1410px #8BC34A, 777px 782px #9C27B0, 1235px 1941px #9C27B0, 104px 1690px #8BC34A, 1167px 1338px #E91E63, 345px 1652px #009688, 1682px 1196px #F44336, 1995px 494px #8BC34A, 428px 798px #FF5722, 340px 1623px #F44336, 605px 349px #9C27B0, 1339px 1344px #673AB7, 1102px 1745px #3F51B5, 1592px 1676px #2196F3, 419px 1024px #FF9800, 630px 1033px #4CAF50, 1995px 1644px #00BCD4, 1092px 712px #9C27B0, 1355px 606px #F44336, 622px 1881px #CDDC39, 1481px 621px #9E9E9E, 19px 1348px #8BC34A, 864px 1780px #E91E63, 442px 1136px #2196F3, 67px 712px #FF5722, 89px 1406px #F44336, 275px 321px #009688, 592px 630px #E91E63, 1012px 1690px #9C27B0, 1749px 23px #673AB7, 94px 1542px #FFEB3B, 1201px 1657px #3F51B5, 1505px 692px #2196F3, 1799px 601px #03A9F4, 656px 811px #00BCD4, 701px 597px #00BCD4, 1202px 46px #FF5722, 890px 569px #FF5722, 1613px 813px #2196F3, 223px 252px #FF9800, 983px 1093px #F44336, 726px 1029px #FFC107, 1764px 778px #CDDC39, 622px 1643px #F44336, 174px 1559px #673AB7, 212px 517px #00BCD4, 340px 505px #FFF, 1700px 39px #FFF, 1768px 516px #F44336, 849px 391px #FF9800, 228px 1824px #FFF, 1119px 1680px #FFC107, 812px 1480px #3F51B5, 1438px 1585px #CDDC39, 137px 1397px #FFF, 1080px 456px #673AB7, 1208px 1437px #03A9F4, 857px 281px #F44336, 1254px 1306px #CDDC39, 987px 990px #4CAF50, 1655px 911px #00BCD4, 1102px 1216px #FF5722, 1807px 1044px #FFF, 660px 435px #03A9F4, 299px 678px #4CAF50, 1193px 115px #FF9800, 918px 290px #CDDC39, 1447px 1422px #FFEB3B, 91px 1273px #9C27B0, 108px 223px #FFEB3B, 146px 754px #00BCD4, 461px 1446px #FF5722, 1004px 391px #673AB7, 1529px 516px #F44336, 1206px 845px #CDDC39, 347px 583px #009688, 1102px 1332px #F44336, 709px 1756px #00BCD4, 1972px 248px #FFF, 1669px 1344px #FF5722, 1132px 406px #F44336, 320px 1076px #CDDC39, 126px 943px #FFEB3B, 263px 604px #FF5722, 1546px 692px #F44336;
  animation: animStar 50s linear infinite;
}

.starfifth
{
  content: " ";
    position: absolute;
    width: 1px;
    height: 1px;
    background: transparent;
   box-shadow: 571px 173px #00BCD4, 1732px 143px #00BCD4, 1745px 454px #FF5722, 234px 784px #00BCD4, 1793px 1123px #FF9800, 1076px 504px #03A9F4, 633px 601px #FF5722, 350px 630px #FFEB3B, 1164px 782px #00BCD4, 76px 690px #3F51B5, 1825px 701px #CDDC39, 1646px 578px #FFEB3B, 544px 293px #2196F3, 445px 1061px #673AB7, 928px 47px #00BCD4, 168px 1410px #8BC34A, 777px 782px #9C27B0, 1235px 1941px #9C27B0, 104px 1690px #8BC34A, 1167px 1338px #E91E63, 345px 1652px #009688, 1682px 1196px #F44336, 1995px 494px #8BC34A, 428px 798px #FF5722, 340px 1623px #F44336, 605px 349px #9C27B0, 1339px 1344px #673AB7, 1102px 1745px #3F51B5, 1592px 1676px #2196F3, 419px 1024px #FF9800, 630px 1033px #4CAF50, 1995px 1644px #00BCD4, 1092px 712px #9C27B0, 1355px 606px #F44336, 622px 1881px #CDDC39, 1481px 621px #9E9E9E, 19px 1348px #8BC34A, 864px 1780px #E91E63, 442px 1136px #2196F3, 67px 712px #FF5722, 89px 1406px #F44336, 275px 321px #009688, 592px 630px #E91E63, 1012px 1690px #9C27B0, 1749px 23px #673AB7, 94px 1542px #FFEB3B, 1201px 1657px #3F51B5, 1505px 692px #2196F3, 1799px 601px #03A9F4, 656px 811px #00BCD4, 701px 597px #00BCD4, 1202px 46px #FF5722, 890px 569px #FF5722, 1613px 813px #2196F3, 223px 252px #FF9800, 983px 1093px #F44336, 726px 1029px #FFC107, 1764px 778px #CDDC39, 622px 1643px #F44336, 174px 1559px #673AB7, 212px 517px #00BCD4, 340px 505px #FFF, 1700px 39px #FFF, 1768px 516px #F44336, 849px 391px #FF9800, 228px 1824px #FFF, 1119px 1680px #FFC107, 812px 1480px #3F51B5, 1438px 1585px #CDDC39, 137px 1397px #FFF, 1080px 456px #673AB7, 1208px 1437px #03A9F4, 857px 281px #F44336, 1254px 1306px #CDDC39, 987px 990px #4CAF50, 1655px 911px #00BCD4, 1102px 1216px #FF5722, 1807px 1044px #FFF, 660px 435px #03A9F4, 299px 678px #4CAF50, 1193px 115px #FF9800, 918px 290px #CDDC39, 1447px 1422px #FFEB3B, 91px 1273px #9C27B0, 108px 223px #FFEB3B, 146px 754px #00BCD4, 461px 1446px #FF5722, 1004px 391px #673AB7, 1529px 516px #F44336, 1206px 845px #CDDC39, 347px 583px #009688, 1102px 1332px #F44336, 709px 1756px #00BCD4, 1972px 248px #FFF, 1669px 1344px #FF5722, 1132px 406px #F44336, 320px 1076px #CDDC39, 126px 943px #FFEB3B, 263px 604px #FF5722, 1546px 692px #F44336;
  animation: animStar 80s linear infinite;
}

@keyframes animStar
{
  0% {
    transform: translateY(0px);
}
  100% {
    transform: translateY(-2000px);
}
}



button {
  border: none;
  padding: 0;
  font-size: 0;
  line-height: 0;
  background: none;
  cursor: pointer;
}

:focus {
  outline: 0;
}

.clearfix:before, .clearfix:after {
  content:"0020";
  display: block;
  height: 0;
  visibility: hidden;
}

.clearfix:after {
  clear: both;
}

.clearfix {
  zoom: 1;
}

			/* 1. END BODY */
/***********************************/

/***********************************
			/* 2. CONTENT */
/***********************************/
/* 2.1. Section error */
.error {
  min-height: 100vh;
  position: relative;
  padding: 240px 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  text-align: center;
  margin-top: 70px;
}

.error__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.error__content {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
}

.error__message {
  text-align: center;
  color: #181828;
}

.message__title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 5px;
   font-size: 5.6rem;
  padding-bottom: 40px;
  max-width: 960px;
  margin: 0 auto;
}

.message__text {
  font-family: 'Montserrat', sans-serif;
  line-height: 42px;
  font-size: 18px;
  padding: 0 60px;
  max-width: 680px;
  margin: auto;
}

.error__nav {
  max-width: 600px;
  margin: 40px auto 0;
  text-align: center;
}

.e-nav__form {
  position: relative;
  height: 45px;
  overflow: hidden;
  width: 170px;
  display: inline-block;
  vertical-align: top;
  border: 1px solid #212121;
  padding-left: 10px;
  padding-right: 46px;
}

.e-nav__icon {
  position: absolute;
  right: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
  color: #212121;
  -webkit-transition: color .25s ease;
  transition: color .25s ease;
}

.e-nav__link {
  height: 45px;
  line-height: 45px;
  width: 170px;
  display: inline-block;
  vertical-align: top;
  margin: 0 15px;
  border: 1px solid #181828;
  color: #181828;
  text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: .1rem;
  position: relative;
  overflow: hidden;
}

.e-nav__link:before {
  content: '';
  height: 200px;
  background: #212121;
  position: absolute;
  top: 70px;
  right: 70px;
  width: 260px;
  -webkit-transition: all .3s;
  transition: all .3s;
  -webkit-transform: rotate(50deg);
          transform: rotate(50deg);
}

.e-nav__link:after {
  -webkit-transition: all .3s;
  transition: all .3s;
  z-index: 999;
  position: relative;
}

.e-nav__link:after {
  content: "Home Page";
}

.e-nav__link:hover:before {
  top: -60px;
  right: -50px;
}

.e-nav__link:hover {
  color: #fff;
}

.e-nav__link:nth-child(2):hover:after {
  color: #fff;
}
/* 2.1. END Section Error */

/* 2.2. Social style */
.error__social {
  position: absolute;
  top: 50%;
  -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
  left: 20px;
  z-index: 10;
}

.e-social__list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.e-social__icon {
  padding-bottom: 30px;
}

.e-social__icon:last-child {
  padding-bottom: 0;
}

.e-social__link {
  color: #fff;
  -webkit-transition: all .25s ease;
  transition: all .25s ease;
  display: block;
}

.e-social__link:hover {
  opacity: .7;
}
/* 2.2. END Social style */

/* 2.3. Lamp */
.lamp {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  margin: 0px auto;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-origin: center top;
  animation-timing-function: cubic-bezier(0.6, 0, 0.38, 1);
  animation: move 5.1s infinite;
}

@keyframes move {
  0% {
    transform: rotate(40deg);
  }
  50% {
    transform: rotate(-40deg);
  }
  100% {
    transform: rotate(40deg);
  }
}

.cable {
  width: 8px;
    height: 248px;
    background-image: linear-gradient(rgb(32 148 218 / 70%), rgb(193 65 25)), linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7));
}

.cover {
  width: 200px;
  height: 80px;
  background: #0bd5e8;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  position: relative;
  z-index: 200;
}

.in-cover {
  width: 100%;
  max-width: 200px;
  height: 20px;
  border-radius: 100%;
  background: #08ffff;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: 0px auto;
  bottom: -9px;
  z-index: 100;
}
.in-cover .bulb {
     width: 50px;
    height: 50px;
    background-color: #08fffa;
    border-radius: 50%;
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: -20px;
    margin: 0px auto;
    -webkit-box-shadow: 0 0 15px 7px rgba(0,255,255,0.8), 0 0 40px 25px rgba(0,255,255,0.5), -75px 0 30px 15px rgba(0,255,255,0.2);
    box-shadow: 0 0 25px 7px rgb(127 255 255 / 80%), 0 0 64px 47px rgba(0,255,255,0.5), 0px 0 30px 15px rgba(0,255,255,0.2);
}


.light {
      width: 200px;
    height: 0px;
    border-bottom: 900px solid rgb(44 255 255 / 24%);
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    position: absolute;
    left: 0px;
    right: 0px;
    top: 270px;
    margin: 0px auto;
    z-index: 1;
    border-radius: 90px 90px 0px 0px;
}
/* 2.3. END Lamp */
/***********************************
			/* 2. END CONTENT */
/***********************************/

/***********************************
			/* 3. RESPONSIVE */
/***********************************/
.error {
  overflow: hidden;
  max-height: 100vh;
}
@media (max-width: 1400px) { 
  .lamp {
    zoom: .5;
  }
  .error__content {
    top: 55%;
  }
  .message__title {
    font-size: 3.5rem;
  }
}
@media (max-width: 900px) {

  .message__title {
    font-size: 34px;

  }
  .error__content {
    top: 55%;
  }
  }
@media (max-width: 950px) {
  .lamp__wrap {
    max-height: 100vh;
    overflow: hidden;
    max-width: 100vw;
  }
  .error__social {
    bottom: 30px;
    top: auto;
    transform: none;
    width: 100%;
    position: fixed;
    left: 0;
  }
  .e-social__icon {
    display: inline-block;
    padding-right: 30px;
  }
  .e-social__icon:last-child {
    padding-right: 0;
  }
  .e-social__icon {
    padding-bottom: 0;
  }
}
@media (max-width: 750px) {
  body, html, {
    max-height: 100vh;
  }
   .error__content {
    position: static;
    margin: 0 auto;
    transform: none;
    padding-top: 300px;
  }
  .error {
    padding-top: 0;
    padding-bottom: 100px;
    height: 100vh;
  }
  }
@media (max-width: 650px) {
  .message__title {
    font-size: 36px;
    padding-bottom: 20px;
  }
  .message__text {
    font-size: 16px;
    line-height: 2;
    padding-right: 20px;
    padding-left: 20px;
  }
  .lamp {
    zoom: .6;
  }
  .error__content {
    padding-top: 180px;
  }
  }
@media (max-width: 480px) {

  .message__title {
    font-size: 30px;
  }
  .message__text {
    padding-left: 10px;
    padding-right: 10px;
    font-size: 15px;
  }
  .error__nav {
    margin-top: 20px;
  }
}
        
        </style>
        <body>
       
  <header class="top-header">
  </header>
  
  <!--dust particel-->
  <div>
    <div class="starsec"></div>
    <div class="starthird"></div>
    <div class="starfourth"></div>
    <div class="starfifth"></div>
  </div>
  <!--Dust particle end--->
  
  
  <div class="lamp__wrap">
    <div class="lamp">
      <div class="cable"></div>
      <div class="cover"></div>
      <div class="in-cover">
        <div class="bulb"></div>
      </div>
      <div class="light"></div>
    </div>
  </div>
  <!-- END Lamp -->
  <section class="error">
    <!-- Content -->
    <div class="error__content">
      <div class="error__message message">
        <h1 class="message__title">Page Not Found</h1>
        <p class="message__text">We're sorry, the link you were looking for isn't found here. The link you followed may either be broken or no longer exists. Please try again, or take a look at our.</p>
      </div>
      
    </div>
   
  
  </section>
  
  
        </body>
        </html>
    `);
        }
     
  } catch (error) {
    console.log(error);
  }
};

const setPassword = async (req, res) => {

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    } else {
      user
        .findOne({ _id: req.params._id })
        .then((result) => {
          console.log("result",result)
          if(result) {
            result.password = hash
            result.save();
            res.status(200).send(`
            <html lang="en">
            <head>
              <meta charset="utf-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Event Management</title>
              <link href='https://fonts.googleapis.com/css?family=Lato:300,400|Montserrat:700' rel='stylesheet' type='text/css'>
              <style>
                @import url(//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css);
                @import url(//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css);
              </style>
              <link rel="stylesheet" href="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/default_thank_you.css">
              <script src="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/jquery-1.9.1.min.js"></script>
              <script src="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/html5shiv.js"></script>
            </head>
            <body onload = "stopBack();">
              <header class="site-header" id="header">
                <h1 class="site-header__title" data-lead-id="site-header-title">updated</h1>
              </header>
            
              <div class="main-content">
                <i class="fa fa-check main-content__checkmark" id="checkmark"></i>
                <p class="main-content__body" data-lead-id="main-content-body">Thank you for joining us your password has been updated successfully  </p>
              </div>
            
              <footer class="site-footer" id="footer">
                <p class="site-footer__fineprint" id="fineprint">Copyright ©2023 | All Rights Reserved</p>
              </footer>
              <script>
              function stopBack() {
                 window.history.go(1);
              }
           </script> 
    
            </body>
            </html>
            `)
          }
         
         } );
    }
  });
};

module.exports = {
  signUp,
  signIn,
  verify,
  setPassword,
  resetLink,
  verifyUser,
};
