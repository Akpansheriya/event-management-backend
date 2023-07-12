const admin = require("../models/admin");
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

const adminSignUp = async (req, res) => {
  try {
    const exist = await admin.find({ email: req.body.email });
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

    const adminData = new admin({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
    });

    const token = jwt.sign(
      {
        email: adminData.email,
        userId: adminData._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 5, // expiresIn value should be a number, not a string
      }
    );

    adminData.emailToken = token;

    var mailoption = {
      from: "Event Management",
      to: adminData.email,
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
   Hey ${adminData.firstName}
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
    <a href="http://${req.headers.host}/api/verify/admin/signup?token=${adminData.emailToken}" style="display:block; padding:15px 25px; background-color:#448EF6; color:#ffffff; border-radius:7px; text-decoration:none;">Verify Email</a>
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
        adminData.save().then((register) => {
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
    const adminData = await admin.findOne({ emailToken: token });
    if (adminData) {
      adminData.emailToken = null;
      adminData.isVerified = true;
      await adminData.save();
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

const adminSignIn = async (req, res) => {
  const exist = await admin.findOne({ email: req.body.email });
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
        res.status(200).send({
          result: result,
          admin: exist,
        });
      }
    });
  } else {
    res.status(400).send("user not verified");
  }
};

module.exports = {
  adminSignUp,
  adminSignIn,
  verify,
};
