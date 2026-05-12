const transporter = require("../config/mailer");

async function sendResetPasswordEmail(to, otp) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const expiry = process.env.OTP_EXP_MINUTES || 5;

  await transporter.sendMail({
    from: `"GymKey Corporation" <${from}>`,
    to,
    subject: "Reset your GymKey password",

    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

      <title>GymKey Password Reset</title>
    </head>

    <body style="
      margin:0;
      padding:24px 12px;
      background:#F4F7FB;
      font-family:'Inter', Arial, sans-serif;
    ">

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">

            <!-- MAIN CARD -->
            <table width="100%" cellpadding="0" cellspacing="0" style="
              max-width:520px;
              background:#FFFFFF;
              border-radius:18px;
              overflow:hidden;
              box-shadow:0 6px 18px rgba(10,22,40,0.08);
            ">

              <!-- HEADER -->
              <tr>
                <td style="
                  background:#10B981;
                  padding:28px 24px;
                  text-align:center;
                ">

                  <h1 style="
                    margin:0;
                    color:#FFFFFF;
                    font-size:30px;
                    font-weight:700;
                    letter-spacing:-0.5px;
                  ">
                    GymKey
                  </h1>

                  <p style="
                    margin:8px 0 0;
                    color:rgba(255,255,255,0.9);
                    font-size:13px;
                  ">
                    Smart Multi-Gym Membership Platform
                  </p>

                </td>
              </tr>

              <!-- CONTENT -->
              <tr>
                <td style="padding:34px 28px;">

                  <p style="
                    margin:0;
                    color:#6B7280;
                    font-size:13px;
                    font-weight:600;
                    letter-spacing:0.8px;
                  ">
                    PASSWORD RESET
                  </p>

                  <h2 style="
                    margin:10px 0 16px;
                    color:#0A1628;
                    font-size:24px;
                    line-height:1.3;
                    font-weight:700;
                  ">
                    Reset your password
                  </h2>

                  <p style="
                    margin:0;
                    color:#4B5563;
                    font-size:15px;
                    line-height:1.7;
                  ">
                    Use the verification code below to securely reset your GymKey account password.
                  </p>

                  <!-- OTP -->
                  <div style="
                    text-align:center;
                    margin:28px 0;
                  ">

                    <div style="
                      display:inline-block;
                      background:#ECFDF5;
                      border:2px solid #10B981;
                      color:#10B981;
                      padding:16px 34px;
                      border-radius:14px;
                      font-size:34px;
                      font-weight:700;
                      letter-spacing:8px;
                    ">
                      ${otp}
                    </div>

                  </div>

                  <!-- INFO BOX -->
                  <div style="
                    background:#F9FAFB;
                    border-radius:12px;
                    padding:14px 16px;
                  ">

                    <p style="
                      margin:0;
                      color:#374151;
                      font-size:14px;
                      line-height:1.6;
                    ">
                      This code expires in
                      <strong>${expiry} minutes</strong>.
                    </p>

                  </div>

                  <p style="
                    margin:20px 0 0;
                    color:#6B7280;
                    font-size:13px;
                    line-height:1.7;
                  ">
                    If you did not request a password reset, you can safely ignore this email.
                  </p>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="
                  background:#FAFAFA;
                  border-top:1px solid #E5E7EB;
                  padding:18px;
                  text-align:center;
                ">

                  <p style="
                    margin:0;
                    color:#6B7280;
                    font-size:12px;
                  ">
                    © ${new Date().getFullYear()} GymKey Corporation
                  </p>

                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
    `,
  });
}

module.exports = sendResetPasswordEmail;
