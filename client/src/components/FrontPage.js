import React from 'react';

const ethlogo = require('../assets/img/eth-logo.png').default

function FrontPage() {
	return (
		<React.Fragment>
			<center>
			<br />
			<h1 color="black">Restaurant Review Dapp</h1>
			<br/>
			<h3 style={{ textAlign: "center" }}>Decentralized reviews on the Ethereum blockchain</h3>
			<img src={ethlogo} height="100" alt="Ethereum Logo" />
			<br />
			<h2>About</h2>
			<h4>A decentralized review and rating platform.</h4>
			</center>
			<div className="text-center" style={{ width: '75%', margin: '0 auto' }}>
				<p>
					This decentralized application (Dapp) provides a platform for users to share reviews of restaurants
					they have visited. By using the blockchain and a Solidity smart contract, the platform's transparency
					and trustworthiness is enhanced.
				</p>
				<br />
				<p>
					On this Dapp, users can enter a restaurant's name, the kind of cuisine served (fast food, Chinese, etc),
					a rating of up to 5 stars, their review of their experience at the restaurant and an image.
					<br />
					<br />
					Other users who find a review useful or enjoyable can tip the reviewer with ETH to express their appreciation!
					This also serves to incentivise participation and the submission of high quality reviews.
				</p>
			</div>
		</React.Fragment>
	)
}

export default FrontPage;