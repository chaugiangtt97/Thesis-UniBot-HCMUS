/* eslint-disable no-console */
import { sendEmail } from './sendEmail'

/**
 * Prepares to send email
 * @param {string} user - user object
 * @param {string} subject - subject
 * @param {string} htmlMessage - html message
 */
const prepareToSendEmail = (user = {}, code = '') => {

  let content = { subject: '', html: '' }

  if (code === 'VERIFY_EMAIL') {
    content = {
      subject : 'Dự án Chatbot tư vấn FIT-HCMUS',
      html : `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mã Xác Minh</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    background: #007bff;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px;
                    font-size: 16px;
                    color: #333333;
                    line-height: 1.5;
                }
                .otp {
                    display: block;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: #007bff;
                    margin: 20px 0;
                }
                .footer {
                    background: #f4f4f4;
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #777777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Mã Xác Minh</h1>
                </div>
                <div class="content">
                    <p>Xin chào bạn, ${user?.name}</p>
                    <p>Cảm ơn bạn đã đăng kí tài khoản tại hệ thống UniBot. Đây là mã xác minh của bạn:</p>
                    <div class="otp">${user?.verification}</div>
                    <p>Vui lòng sử dụng mã này trong vòng <strong>10 phút</strong>. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi để được hỗ trợ.</p>
                    <p>Trân trọng,</p>
                    <p><strong>Dự Án UniBot - Thử nghiệm</strong></p>
                </div>
                <div class="footer">
                    <p>Đây là email tự động, vui lòng không trả lời email này.</p>
                    <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ: mvkiet21@clc.fitus.edu.vn</p>
                </div>
            </div>
        </body>
        </html> 
      `
    }
  }

  if (code === 'FORGOT_PASSWORD') {
    content = {
      subject : 'Dự án Chatbot tư vấn FIT-HCMUS',
      html : `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mã Xác Minh</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    background: #007bff;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px;
                    font-size: 16px;
                    color: #333333;
                    line-height: 1.5;
                }
                .otp {
                    display: block;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: #007bff;
                    margin: 20px 0;
                }
                .footer {
                    background: #f4f4f4;
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #777777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Khôi phục tài khoản</h1>
                </div>
                <div class="content">
                    <p>Xin chào bạn,</p>
                    <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Dưới đây là mật khẩu mới của bạn. Đây là mã xác minh của bạn:</p>
                    <div class="otp">${user.forgotpassword}</div>
                    <p>Để bảo mật tài khoản của bạn, vui lòng đăng nhập và thay đổi mật khẩu này ngay sau khi nhận được email này.</p>
                    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng liên hệ với chúng tôi ngay lập tức để bảo vệ tài khoản của bạn. Trân trọng,</p>
                    <p><strong>Dự Án UniBot HCMUS - Thử nghiệm</strong></p>
                </div>
                <div class="footer">
                    <p>Đây là email tự động, vui lòng không trả lời email này.</p>
                    <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ: mvkiet21@clc.fitus.edu.vn</p>
                </div>
            </div>
        </body>
        </html> 
      `
    }
  }

  const data = {
    user,
    subject: content.subject,
    htmlMessage : content.html
  }

  sendEmail(data, (messageSent) =>
    messageSent
      ? console.log(`Email SENT to: ${user.email}`)
      : console.log(`Email FAILED to: ${user.email}`)
  )

  // if (process.env.NODE_ENV === 'production') {
  //   sendEmail(data, (messageSent) =>
  //     messageSent
  //       ? console.log(`Email SENT to: ${user.email}`)
  //       : console.log(`Email FAILED to: ${user.email}`)
  //   )
  // } else if (process.env.NODE_ENV === 'development') {
  //   console.log('Xác thực email thành công')
  // }
}

export default { prepareToSendEmail }
