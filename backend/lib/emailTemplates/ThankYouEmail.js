const ThanksEmail = (Name, message) => {
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
      <td><img alt="Stripe" height="30" src="https://enlabs.rw/img/devImgs/logo-real.png" style="display:inline;outline:none;border:none;text-decoration:none;float:left" width="33" /> <span style="font-weight:bold; margin-left:20px;margin-top:30px;">Enlightenment Labs</span>
      <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
      <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Dear ${Name},</p>
      
      <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
     ${message}
      </p>
      <a href="https://enlabs.rw" style="background-color:#656ee8;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;text-align:center;display:inline-block;width:100%;padding:10px 10px 10px 10px;line-height:100%;max-width:100%" target="_blank"><span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%;mso-text-raise:15" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:7.5px">Looking for other services </span><span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
      <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
      <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
      We are here to offer you the best services, don't hesitate to contact us directly 
      <a href="tel:+250786135953" style="color:#556cd6;text-decoration:none" >+250786135953</a> </p>
      <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
      <p style="font-size:12px;line-height:16px;margin:16px 0;color:#8898aa">Enlightenment Labs Ltd , Kigali-Rwanda     +250786135953</p>
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

export default ThanksEmail
