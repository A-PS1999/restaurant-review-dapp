import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import ipfs from './utils/ipfs';

class NewReview extends Component {
	
	captureFile(event) {
		event.preventDefault()
		const file = event.target.files[0]
		const reader = new window.FileReader()
		reader.readAsArrayBuffer(file)
		reader.onloadend = () => {
			this.setState({
				buffer: Buffer(reader.result),
				file: URL.createObjectURL(file),
			})
		}
	}
	
	getHash(event) {
		event.preventDefault()
		ipfs.files.add(this.state.buffer, (error, result) => {
			if(error) {
				console.log(error);
				return
			}
			this.setState({ ipfsHash: result[0].hash })
		})
	}
	
	render() {
		return (
			<div className="container-fluid mt-5">
			<div className="row">
				<main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
					<div className="content mr-auto ml-auto">
						<form onSubmit={(event) => {
							event.preventDefault()
							const rating = this.ratingInput.value
							const restaurantName = this.nameInput.value
							const cuisineType = this.cuisInput.value
							const reviewBody = this.reviewInput.value
							const ipfsHash = this.state.ipfsHash
							this.getHash
							this.props.addReview(rating, restaurantName, cuisineType, reviewBody, ipfsHash)
						}}>
						<center>
							<h1>Your review:</h1>
							<br></br>
							<div class="form-container">
								<Form.Group controlId="formRestaurant">
									<Form.Control
									id="restaurantName"
									type="text"
									ref={(input) => {this.nameInput = input}}
									className="form-control"
									placeholder="Restaurant Name"
									required />
								</Form.Group>
								<br/>
								<Form.Group controlId="formCuisine">
									<Form.Control
									id="cuisineType"
									type="text"
									ref={(input) => {this.cuisInput = input}}
									className="form-control"
									placeholder="Cuisine Type"
									required />
								</Form.Group>
								<br/>
								<Form.Group controlId="formRating">
									<Form.Control
									id="rating"
									type="text"
									ref={(input) => {this.ratingInput = input}}
									className="form-control"
									placeholder="Your rating out of 5"
									required />
								</Form.Group>
								<br/>
								<Form.Group controlId="formReview">
									<h4>Share your experience!</h4>
									<Form.Control
									id="reviewBody"
									as="textarea"
									rows={5}
									ref={(input) => {this.reviewInput = input}}
									required />
								</Form.Group>
								<br/>
								<Form.Group controlId="formImage">
									<Form.File
									id="toIpfs"
									label="Upload a supporting image"
									onChange={this.captureFile} />
								</Form.Group>
							</div>
							<br/>
							<button type="submit" className="btn btn-outline-info">Submit</button>
						</center>
						</Form>
					</div>
				</main>
			</div>
		);
	}
}

export default NewReview;