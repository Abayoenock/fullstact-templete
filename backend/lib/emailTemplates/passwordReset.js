require("dotenv").config()
const passwordResetEmail = (Name, link) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">        
      <head>
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
      </head>
      
      <body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,&quot;Helvetica Neue&quot;,Ubuntu,sans-serif">
      <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px">
      <tbody>
      <tr style="width:100%">
      <td>
      <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:0 48px">
      <tbody>
      <tr>
      <td><span style="font-weight:bold; margin-left:20px;margin-top:30px;">${process.env.APPNAME}</span>
      <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
      <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Hello  ${Name},</p>
      
      <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
     You have requested for a password rest , to rest the password click on the link below <br>
     If you did not request for a password reset ignore this message 

      </p>
      <a href=${link} style="background-color:#656ee8;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;text-align:center;display:inline-block;width:100%;padding:10px 10px 10px 10px;line-height:100%;max-width:100%" target="_blank"><span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%;mso-text-raise:15" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:7.5px">Reset password</span><span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
      <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
      
      </td>
      </tr>
      </tbody>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      </body>
      </html>`
}

module.exports = passwordResetEmail
