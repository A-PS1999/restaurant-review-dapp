import React, { Component } from 'react';
import ReactStars from "react-rating-stars-component";

function convertUnixTimestamp(timestamp) {
	
	var months_list = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	
	var date = new Date(timestamp*1000);
	
	var year = date.getFullYear();
	
	var month = months_list[date.getMonth()];
	
	var day = date.getDate();
	
	var convertedDate = month + ' ' + day + ' ' + year;
	
	return convertedDate
}

class Main extends Component {
	
	updateSearch(event) {
		this.setState({search: event.target.value.substr(0, 20)});
	}
	
	constructor() {
		super();
		this.state = {
			search: ''
		};
	}
	
	render() {
		let filteredReviews = this.props.reviews.filter(
		(review) => {
			return review.restaurantName.indexOf(this.state.search) !== -1;
		});

	return (
		<div className="container-fluid mt-5">
		<div className="row">
			<main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
				<div className="content mr-auto ml-auto">
				<br></br>
				<h1>Search reviews by restaurant name</h1>
				<br></br>
				<input type="text" className="form-control" value={this.state.search} onChange={this.updateSearch.bind(this)} />
				<p></p>
				{ filteredReviews.map((review, key) => {
					return(
						<div key={key} >
							<div>
								<h2>{this.props.web3.utils.hexToUtf8(review.restaurantName)}</h2>
								<p>{this.props.web3.utils.hexToUtf8(review.cuisineType)}</p>
								<p className="small">Author: {review.author}</p>
								<p className="small">Reviewed on {convertUnixTimestamp(review.reviewDate)}</p>
							</div>
							<p>Rating:</p>
							<ReactStars size={50} edit={false} value={Number(review.rating)} />
							<ul id="reviewList" className="list-group list-group-flush">
								<li className="list-group-item">
									<p>{review.reviewBody}</p>
									<br></br>
								</li>
								{ review.ipfsHash 
								? <li className="list-group-item">
									<p>Review Image</p>
									<img src={ `https://ipfs.io/ipfs/${review.ipfsHash}` } alt="" />
								  </li> 
								: null
								}
								<li key={key} className="list-group-item py-2">
									<p className="mt-1 text-muted small">
										{review.tipCount.toString()} user(s) tipped this review.
									</p>
									<br></br>
									<p>If you found the review useful, would you like to tip 0.1 ETH to the author?</p>
									<button
										className="button btn-info"
										name={review.id}
										onClick={(event) => {
											try {
												let tipValue = this.props.web3.utils.toWei('0.1', 'Ether')
												this.props.tipReview(event.target.name, tipValue)
											} catch(e) {
												console.error(e)
											}
									}}>
										Tip
									</button>
								</li>
								<hr></hr>
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
}

export default Main;