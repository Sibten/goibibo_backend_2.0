export const cancelTemplate = (
  user: string,
  flight: string,
  pnr: number,
  date: Date,
  passengers: number
) => {
  return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Ticket Cancellation Notification</title>
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
		<div class="container">
			<div class="head">
				<img
				  src="https://res.cloudinary.com/dgsqarold/image/upload/v1685444859/Goibibo/goibibo-logo_qeiiq2.webp"
				  alt="Goibibo icon"
				/>
				<h1>Ticket Cancellation </h1>
			  </div>
			<div class="content">
				<p>${new Date().toDateString()} </p>
				<p>Dear ${user}, </p>
				<p>We regret to inform you that your flight ticket against PNR Number <strong> ${pnr} </strong> has been cancelled.</p>
				<p>Details of your cancelled booking:</p>
				<ul>
					<li><strong>Flight Number:</strong> ${flight}</li>
					<li><strong>Departure Date:</strong> ${date.toLocaleString()}</li>
					<li><strong>Passenger(s):</strong> ${passengers}</li>
				</ul>
				<p>The refunded amount will be processed to your original payment method within 3-7 working days.</p>
				<p>If you have any questions or concerns, please contact our customer support.</p>
				<div>
					Sincerly, <br />
					Team Goibibo. 
				</div>
			</div>
			<div class="footer">
				<div>
					<h3>Trusted by Goibibo</h3>
					<p>Regional Office : Ahemdabad</p>
					<p>1800357878 (Toll free) </p> <p>  customercare@goibibo.com</p>
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
				<p>This is an automated message. Please do not reply to this email.</p>
			</div>
		</div>
	</body>
	</html>
	`;
};
