import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import ipfs from '../utils/ipfs';

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
	
	getHash(event, callback) {
		if (arguments.length > 0) event.preventDefault()
		ipfs.files.add(this.state.buffer, (error, result) => {
			if(error) {
				console.log(error);
				return
			}
			this.setState({ ipfsHash: result[0].hash }, callback)
		})
	}
	
	constructor(props) {
		super(props)
		this.state = {
			ipfsHash: '',
		};
		this.captureFile = this.captureFile.bind(this)
		this.getHash = this.getHash.bind(this)
	}
	
	render() {
		return (
			<div className="container-fluid mt-5">
			<div className="row">
				<main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
					<Container className="content mr-auto ml-auto">
						<Row className="justify-content-md-center">
							<Form onSubmit={(event) => {
								try {
									event.preventDefault()
									const rating = this.ratingInput.value
									const restaurantName = this.props.web3.utils.toHex(this.nameInput.value)
									const cuisineType = this.props.web3.utils.toHex(this.cuisInput.value)
									const reviewBody = this.reviewInput.value
									this.getHash(event, this.props.addReview(rating, restaurantName, cuisineType, reviewBody, this.state.ipfsHash))
								} catch(e) {
									console.error(e)
								}
							}}>
							<center>
							<h1>Your review:</h1>
							<br></br>
							<div className="form-container">
								<Form.Group>
									<Form.Control
									id="restaurantName"
									type="text"
									ref={(input) => {this.nameInput = input}}
									className="form-control"
									placeholder="Restaurant Name"
									required />
								</Form.Group>
								<br/>
								<Form.Group>
									<Form.Control
									id="cuisineType"
									type="text"
									ref={(input) => {this.cuisInput = input}}
									className="form-control"
									placeholder="Cuisine Type"
									required />
								</Form.Group>
								<br/>
								<Form.Group>
									<Form.Control
									id="reviewRating"
									type="text"
									ref={(input) => {this.ratingInput = input}}
									className="form-control"
									placeholder="Your rating out of 5"
									required />
								</Form.Group>
								<br/>
								<Form.Group>
									<h4>Share your experience!</h4>
									<Form.Control
									id="reviewBody"
									as="textarea"
									rows={5}
									ref={(input) => {this.reviewInput = input}}
									required />
								</Form.Group>
								<br/>
								<Form.Group>
									<img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
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
						</Row>
					</Container>
				</main>
			</div>
		    </div>
		);
	}
}

export default NewReview;