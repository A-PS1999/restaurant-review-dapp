import React from 'react';

function FrontPage() {
	return (
		<React.Fragment>
			<br></br>
			<h1 color="black">Restaurant Review Dapp</h1>
			<br/>
			<h3 style={{ textAlign: "center" }}>Decentralized reviews on the Ethereum blockchain</h3>
			<br></br>
			<h2>About</h2>
			<h4>A decentralized review and rating platform.</h4>
			<p>
				This decentralized application (Dapp) provides a platform for users to share reviews of restaurants
				they have visited. By using the blockchain and a Solidity smart contract, the platform's transparency
				and trustworthiness is enhanced.
			</p>
			<br>
			</br>
			<p>
				On this Dapp, users can enter a restaurant's name, the kind of cuisine served (fast food, Chinese, etc),
				a rating of up to 5 stars, their review of their experience at the restaurant and an image.
				<br>
				Other users who find a review useful or enjoyable can tip the reviewer with ETH to express their appreciation!
				This also serves to incentivise participation and the submission of high quality reviews.
			</p>
			<br></br>
		</React.Fragment>
	)
}

export default FrontPage;