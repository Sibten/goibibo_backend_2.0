export const setOtpHtml = (otp: string) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow&family=Nunito:wght@300;500&family=Poppins:wght@300;400&family=Quicksand:wght@400;500&family=Roboto+Slab&display=swap"
        rel="stylesheet"
      />
      <title>Document</title>
      <style>
        body {
          width: 50%;
          margin-left: auto;
          margin-right: auto;
        }
        .head {
          width: 100%;
          display: flex;
          padding: 9px;
          justify-content: space-between;
          background-color: aliceblue;
          font-family: "Quicksand", sans-serif;
        }
        .head img {
          margin-top: 10px;
          width: 120px;
          height: 40px;
          background: white;
        }
        .head p {
          margin-right: 10px;
          font-weight: bold;
          margin-left: 20px;
        }
        .mail-body {
          width: 100%;
          font-family: "Nunito", sans-serif;
        }
        .mail-body img {
          display: block;
          margin-left: auto;
          margin-right: auto;
          width: 120px;
          margin-top: 20px;
        }
        .mail-body p {
          text-align: justify;
          font-size: larger;
          line-height: 30px;
          margin-left: 20px;
          margin-right: 20px;
        }
        .mail-body h3 {
          text-align: center;
          color: #ef6923;
        }
        .mail-body .otp {
          width: 200px;
          background-color: #2767a7;
          padding: 10px;
          margin-left: auto;
          margin-right: auto;
          font-size: large;
          text-align: center;
        }
        .footer {
          display: flex;
          font-family: "Nunito", sans-serif;
          text-align: center;
          justify-content: center;
        }
        .footer div {
          margin: 20px;
        }
        .footer img {
          width: 40px;
        }
  
        @media screen and (max-width: 480px) {
          body {
            width: 90%;
          }
        }
      </style>
    </head>
  
    <body>
      <div class="head">
        <img
          src="https://res.cloudinary.com/dgsqarold/image/upload/v1691484041/Goibibo/GoibiboClone_bvxwj4.png"
          alt="Goibibo icon"
        />
        <p>User Authentication</p>
      </div>
      <div class="mail-body">
        <img
          src="https://res.cloudinary.com/dgsqarold/image/upload/v1685445681/Goibibo/1028831_h58ahj.png"
          alt="travel log"
        />
        <p>
          &emsp; Hey Traveller ! Greetings from Goibibo. Thank you for showing
          interest in Goibibo : A World's No. 1 Travel Booking App. Find your otp
          given below. Kindly note that it is one time login password. OTP never
          share with anyone. (Note : OTP is valid for next 5 minutes)
        </p>
        <h3>One time password (OTP)</h3>
        <div class="otp">${otp}</div>
      </div>
      <div class="footer">
        <div>
          <p>Get it App now on</p>
          <img
            src="https://res.cloudinary.com/dgsqarold/image/upload/v1685446417/Goibibo/3128279_sfb6t5.png"
            alt="ps"
          />
          <img
            src="https://res.cloudinary.com/dgsqarold/image/upload/v1685446696/Goibibo/5977575_pjyzwa.png"
            alt="as"
          />
        </div>
        <div>
          <p>Explore More</p>
          <img
            src="https://res.cloudinary.com/dgsqarold/image/upload/v1685446726/Goibibo/goTribe-star_2x.1f56eb1a_nwuely.png"
            alt=""
            style="width: 80px"
          />
        </div>
      </div>
    </body>
  </html>
  `;
};
