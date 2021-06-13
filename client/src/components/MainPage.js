import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

class Main extends Component {
	constructor() {
		super();
		this.state = {
			search: ''
		};
	}
	
	const postDate = instance.methods.reviewDate.call(function(error, result) {
		new Date(result * 1000);
	})
	
	updateSearch(event) {
		this.setState({search: event.target.value.substr(0, 20)});
	}
	
	render() {
		let filteredReviews = this.props.reviews.filter(
		(review) => {
			return review.restaurantName.indexOf(this.state.search) !== -1;
		});
	}
	
	return (
		<div className="container-fluid mt-5">
		<div className="row">
			<main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
				<div className="content mr-auto ml-auto">
				<br></br>
				<h1>Search reviews by restaurant name</h1>
				<br></br>
				<input type="text" class="form-control" value={this.state.search} onChange={this.updateSearch.bind(this)} />
				<p></p>
				{ filteredReviews.map((review, key) => {
					return(
						<div key={key} >
							<div>
								<p>{review.cuisineType}</p>
								<br></br>
								<h2>{review.restaurantName}</h2>
								<p class="small">Author: {review.author}</p>
								<p class="small">Reviewed on {postDate}</p>
							</div>
							<p>Rating: {review.rating.toString()} / 5</p>
							<ul id="reviewList" className="list-group list-group-flush">
								<li className="list-group-item">
									<p>{review.reviewBody}</p>
									<br></br>
								</li>
								<li className="list-group-item">
									<p>Review Image</p>
									<img src={ `https://ipfs.io/ipfs/${review.ipfsHash}` } alt="" />
								</li>
								<li key={key} className="list-group-item py-2">
									<p className="float-left mt-1 text-muted small">
										{review.tipCount.toString()} user(s) tipped this review.
									</p>
									<br></br>
									<p>If you found the review useful, would you like to tip 0.1 ETH to the author?</p>
									<button
										className="button btn-info"
										name={review.id}
										onClick={(event) => {
											try {
												let tipValue = window.web3.utils.toWei('0.1', 'Ether')
											this.props.tipReview(event.target.name, tipValue)
											
											let tipEvent = instance.events.tipSent()
											addToast('Sent a tip of ' + tipEvent.returnValues['_value'] + ' ETH to review ' +
											tipEvent.returnValues['rNo'], { appearance: 'success' });
											} catch(e) {
												console.error(e)
											}
									}}>
										Tip
									</button>
								</li>
							</ul>
						</div>
					)
				})}
				</div>
			</main>
		</div>
		</div>
	);
}

export default Main;