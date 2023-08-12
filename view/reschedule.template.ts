export const getRescheduleTemplate = (flight: {
  airline: string;
  flightno: string;
  oldtime: string;
  newtime: string;
  source: string;
  destination: string;
}) => {
  return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Rescedule Flight Notification</title>
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
			<h1>Booking Update</h1>
		</div>
		<div class="content">
			
			<div>
				<h2>Important Update: Your Flight has been Rescheduled</h2>
				<p>Dear Travellers, </p>
				
				<p>Attention Please! </p>
				
				<p>We hope this email finds you well. We would like to inform you of a change to your upcoming flight itinerary.</p>
				
				<p>Due to unforeseen operational reasons, your flight with ${
          flight.airline
        } scheduled for ${new Date(
    flight.oldtime
  ).toLocaleDateString()} ${new Date(
    flight.oldtime
  ).toLocaleTimeString()} from ${flight.source} to ${
    flight.destination
  } has been rescheduled.</p>
				
				<h3>Original Flight Details:</h3>
				<ul>
					<li>Flight Number: ${flight.flightno}</li>
					<li>Departure Date and Time: ${new Date(flight.oldtime).toLocaleString()}</li>
					<li>Departure City: ${flight.source}</li>
					<li>Arrival City: ${flight.destination}</li>
				</ul>
				
				<h3>New Flight Details:</h3>
				<ul>
					<li>Flight Number: ${flight.flightno}</li>
					<li>Departure Date and Time: ${new Date(flight.newtime).toLocaleString()}</li>
					<li>Departure City: ${flight.source}</li>
					<li>Arrival City: ${flight.destination}</li>
				</ul>
				
				<p>We understand that this change may cause inconvenience, and we sincerely apologize for any disruption to your travel plans. Our team is committed to ensuring your travel experience remains as smooth as possible despite this adjustment.</p>
				
				<p>If the new flight time is suitable for you, no further action is required. However, if the new schedule poses any conflicts with your plans, we recommend visiting our website or contacting our customer service at 1800357878 (Toll free) or customercare@goibibo.com to explore alternative options.</p>
				
				<p>Rest assured, we will make every effort to accommodate your needs and preferences during this change. Our goal is to provide you with a safe and pleasant journey.</p>
				
				<p>Once again, we apologize for any inconvenience this may cause and appreciate your understanding. We look forward to serving you on board our flight and thank you for choosing ${
          flight.airline
        } by Goibibo for your travel needs.</p>
				
				<p>Safe travels!</p>
				
				<p>Sincerely,<br>
				Team Goibibo on behalf of ${flight.airline}<br>
			
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
	</html>`;
};
