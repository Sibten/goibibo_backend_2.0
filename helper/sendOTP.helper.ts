import nodemailer from "nodemailer";
import { setOtpHtml } from "../view/otp.tempalate";
const transporter = nodemailer.createTransport({
  host: "mail.mailtest.radixweb.net",
  port: 465,
  secure: true,
  auth: {
    user: "testphp@mailtest.radixweb.net",
    pass: "Radix@web#8",
  },
});

export const sendMailtoClient = (email: string, otp: string) => {
  let mailoptions = {
    from: process.env.MAIL,
    to: email,
    subject: "Goibibo User Authentication : One Time Password",
    html: setOtpHtml(otp),
  };
  return new Promise((res, rej) => {
    transporter.sendMail(mailoptions, (err, info) => {
      if (err) return rej(err);
      return res(info);
    });
  });
};
