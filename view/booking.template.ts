export const bookingTemplate = (
  basic: { pnr: number; name: string; email: string },
  date: Date,
  dep_city: string,
  des_city: string,
  travellers: number,
  travel_class: string,
  paymentId: string
) => {
  return `<!DOCTYPE html>
  <html lang="en">
	<head>
	  <meta charset="UTF-8" />
	  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	  <title>Flight Booking Confirmation</title>
	  <link
		href="https://fonts.googleapis.com/css2?family=Barlow&family=Nunito:wght@300;500&family=Poppins:wght@300;400&family=Quicksand:wght@400;500&family=Roboto+Slab&display=swap"
		rel="stylesheet"
	  />
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
		  background: transparent;
		}
		.head h1 {
		  margin-right: 10px;
		  font-weight: bold;
		  margin-left: 20px;
		  font-size: medium;
		}
		.content {
		  margin-top: 20px;
		  font-family: Arial, Helvetica, sans-serif;
		}
		.footer {
		  border-top: 1px solid rgb(194, 194, 194);
		  margin-top: 20px;
		  padding: 10px;
		  font-family: "Nunito", sans-serif;
		  text-align: center;
		  justify-content: center;
		  line-height: 10px;
		}
		.footer img {
		  width: 6rem;
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
		  src="https://res.cloudinary.com/dgsqarold/image/upload/v1685444859/Goibibo/goibibo-logo_qeiiq2.webp"
		  alt="Goibibo icon"
		/>
		<h1>Booking Confirmation</h1>
	  </div>
	  <div class="content">
		
		<div>
			<h2>Booking Confirmation: Your Flight is Confirmed!</h2>
			
				  
		<p>Date : ${new Date().toDateString()}</p>
			<p>Dear ${basic.name},</p>
			
			<p>We are excited to inform you that your flight booking with goibibo is now confirmed and ready for your upcoming journey.</p>
  
		<h3>Passenger Information: </h3>
		<ul>
		  <li>Passenger Name: ${basic.name}</li>
		  <li>Contact Email: ${basic.email}</li>
	  </ul>
		<div class="ticketContainer">
		  <h3>Flight Details & Ticket Details</h3>
		  <ul>
			<li>Departure Date :${date.toLocaleString()}</li>
			<li>Departure City :${dep_city}</li>
			<li>Destination City : ${des_city}</li>
			<li>Travellers : ${travellers}</li>
			<li>Travelling Class : ${travel_class}</li>
			<li>Payment Id : ${paymentId}</li>
		  </ul>
		</div>
		<p>We recommend arriving at the airport well in advance of your flight's departure time. Please ensure you have all necessary travel documents and identification with you.</p>
		<div>Kindly Download Ticket on Goibibo Trip Section. </div>
		<p>If you have any questions or need further assistance, please don't hesitate to contact our customer service at 1800357878 (Toll free) or customercare@goibibo.com.</p>
		<br />
		<p>Thank you for choosing [Airline Name]. We look forward to providing you with a safe and pleasant travel experience.</p>
		<p>Safe travels!</p>
			
		<div>
		  Sincerly, <br />
		  Team Goibibo on  behalf [Airline Name]
		</div>
	  </div>
	  <div class="footer">
		<div>
		  <h3>Trusted by Goibibo</h3>
		  <p>Regional Office : Ahemdabad</p>
		  <p>1800357878 (Toll free) | customercare@goibibo.com</p>
		</div>
		<p>Download App From</p>
		<div>
		  <img
			src="https://res.cloudinary.com/dgsqarold/image/upload/v1685506786/Goibibo/get-it-on-google-play-badge-png-open-2000_kdvrz5.png"
			alt="playstore"
		  />
		</div>
		<div>
		  <img
			src="https://res.cloudinary.com/dgsqarold/image/upload/v1690546499/Goibibo/app-store_sk0cjb.png"
			alt="as"
		  />
		</div>
	  </div>
	</body>
  </html>
  `;
};
