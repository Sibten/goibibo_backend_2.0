import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "mail.mailtest.radixweb.net",
  port: 465,
  secure: true,
  auth: {
    user: "testphp@mailtest.radixweb.net",
    pass: "Radix@web#8",
  },
});

export const sendMail = (
  email: string | Array<string>,
  subject: string,
  template: string
) => {
  console.log(process.env.MAIL);
  let mailoptions = {
    from: `"Goibibo" <${process.env.MAIL ?? "testphp@mailtest.radixweb.net"}>`,
    to: email,
    subject: subject,
    html: template,
  };
  return new Promise((res, rej) => {
    transporter.sendMail(mailoptions, (err, info) => {
      if (err) return rej(err);
      return res(info);
    });
  });
};
