import React, { useState } from "react";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import Pagination from "@material-ui/core/Pagination";
import Button from "@material-ui/core/Button";
import usePagination from "./usePagination.js";

export default function Main({reviews, tipReview, web3, contract}) {
	
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	
	const updateSearch = (event) => {
		setSearch(event.target.value.substr(0, 20));
		setPage(1);
	}
	
	let filteredReviews = reviews.filter(
		(review) => {
			return review.restaurantName.indexOf(web3.utils.toHex(search)) !== -1;
	});
	
	let paginatedReviews = usePagination(filteredReviews, 10, page, setPage);
		
	function convertUnixTimestamp(timestamp) {
	
		var months_list = ['January','February','March','April','May','June',
		'July','August','September','October','November','December'];
		
		var date = new Date(timestamp*1000);
		
		var year = date.getFullYear();
		
		var month = months_list[date.getMonth()];
		
		var day = date.getDate();
		
		var convertedDate = month + ' ' + day + ' ' + year;
		
		return convertedDate
	}
	
	const handleChange = (e, p) => {
		setPage(p);
		paginatedReviews.jumpPage(p);
	}
	
	if (contract) {
		contract.events.tipSent({}).on('data', function(response) {toast.success("Your  tip of " + web3.utils.fromWei(response.returnValues['_value']).toString() + 
	" ETH has successfully been sent to the author of review #" + response.returnValues['rNo'].toString() + "!", {id: 'tipSent'})})
	}

	return (
		<div className="container-fluid mt-5" style={{ minHeight: "100vh" }}>
		<div className="row">
			<main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
				<div className="content mr-auto ml-auto">
				<br></br>
				<h1>Search reviews by restaurant name</h1>
				<br></br>
				<input type="text" className="form-control" value={search} onChange={updateSearch} />
				<p></p>
				{filteredReviews.length > 0 ? paginatedReviews.pageData().map((review, key) => {
					return(
					<React.Fragment key={key}>
						<div className="card">
							<div style={{ paddingLeft: '16px', paddingTop: '10px' }}>
								<h2>{web3.utils.hexToUtf8(review.restaurantName)}</h2>
								<p>{web3.utils.hexToUtf8(review.cuisineType)}</p>
								<p className="small">Author: {review.author}</p>
								<p className="small">Reviewed on {convertUnixTimestamp(review.reviewDate)}</p>
							</div>
							<p style={{ paddingLeft: '16px' }}>Rating:</p>
							<div style={{ paddingLeft: '16px' }}>
								<ReactStars size={50} edit={false} value={Number(review.rating)} />
							</div>
							<ul id="reviewList" className="list-group list-group-flush">
								<li className="list-group-item">
									<p>{review.reviewBody}</p>
									<br></br>
								</li>
								{ review.ipfsHash 
								? <li className="list-group-item">
									<p>Review Image</p>
									<img src={ `https://ipfs.io/ipfs/${review.ipfsHash}` } alt="" style={{ maxWidth: '400px' }} />
								  </li> 
								: null
								}
								<li key={key} className="list-group-item py-2">
									<p className="mt-1 text-muted small">
										This review has been tipped {review.tipCount.toString()} time(s).
									</p>
									<br></br>
									<p>If you found the review useful, would you like to tip 0.1 ETH to the author?</p>
									<Button
										variant="outlined"
										name={review.id}
										onClick={(event) => {
											try {
												let tipValue = web3.utils.toWei('0.1', 'Ether')
												tipReview(event.target.name, tipValue)
											} catch(e) {
												console.error(e)
												toast.error("An error occurred");
											}
									}}>
										Tip
									</Button>
								</li>
								<hr></hr>
							</ul>
						</div>
					</React.Fragment>
					)
				})
				: <>
					<br />
					<div style={{ textAlign: 'center' }}>
						<h2>No search results.</h2>
					</div>
				</>
				}
				{filteredReviews.length > 1 
				? 	<div style={{ paddingTop: '10px' }}>
						<Pagination
							count={paginatedReviews.maxPage}
							page={page}
							onChange={handleChange}
						/>
					</div>
				: null
				}
				</div>
			</main>
		</div>
		</div>
	);
}