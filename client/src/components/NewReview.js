import React, { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { Form, Container, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { useForm, Controller, handleSubmit } from "react-hook-form";
import ipfs from "../utils/ipfs";

export default function NewReview({addReview, web3, contract}) {
	
	const { handleSubmit, control } = useForm();
	
	const [ipfsHash, setIpfsHash] = useState("");
	const [isFile, setFile] = useState(null);
	const [buffer, setBuffer] = useState(null);
	const [reviewRating, setReviewRating] = useState(1);
	
	async function getHash() {
		
		try {
			const uploadResult = await ipfs.add(Buffer.from(buffer))
			setIpfsHash(uploadResult.path)
		} catch(e) {
			console.log(e)
			toast.error(e.message)
			return
		}
	}
	
	useEffect(() => {
		if (buffer) {
			getHash()
		}
	}, [buffer]);
	
	const captureFile = (event) => {
		if (event.target.files[0]) {
			event.preventDefault();
			setFile(URL.createObjectURL(event.target.files[0]));
			
			const reader = new FileReader();
			reader.readAsArrayBuffer(event.target.files[0])
			reader.addEventListener("load", () => {
					setBuffer(reader.result)
			})
		}
	}
	
	function submitData(data, e) {
		try {
			e.preventDefault();
			addReview(reviewRating, web3.utils.toHex(data.restaurantName), web3.utils.toHex(data.cuisineType), data.reviewBody, ipfsHash);
		} catch (e) {
			console.error(e);
			toast.error(e.message);
		}
	}
	
	if (contract) {
		contract.events.reviewSubmitted({}).on('data', function(response) {
			toast.success('Your review of ' + web3.utils.hexToUtf8(response.returnValues['name']) + 
			' has been successfully submitted as review #' + response.returnValues['rNo'].toString() + 
			'!', {id: 'reviewSent'})
		});
	}

	return (
		<div className="container-fluid mt-5">
		<div className="row">
			<main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
				<Container className="content mr-auto ml-auto">
					<Row className="justify-content-md-center">
						<Form onSubmit={handleSubmit(submitData)}>
						<center>
						<h1>Your review:</h1>
						<br></br>
						<div className="form-container">
							<Controller
                                name="restaurantName"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<Form.Control
										{...field}
										onChange={(e) => field.onChange(e.target.value)}
										className="form-control"
										placeholder="Restaurant Name"
										required
									/>
								)}
							/>
							<br/>
							<Controller
								name="cuisineType"
								control={control}
								defaultValue=""
								rules={{ required: true }}
								render={({ field }) => (
									<Form.Control
										{...field}
										onChange={(e) => field.onChange(e.target.value)}
										className="form-control"
										placeholder="Cuisine Type"
										required 
									/>
								)}
							/>
							<br/>
								<h4>Rating</h4>
								<ReactStars 
								size={60}
								onChange={(rating) => {setReviewRating(rating)}}
								isHalf={false}
								/>
							<br/>
							<h4>Share your experience!</h4>
							<Controller
								name="reviewBody"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<Form.Control
										{...field}
										as="textarea"
										rows={5}
										onChange={(e) => field.onChange(e.target.value)}
									/>
								)}
							/>
							<br/>
							<Controller
								name="imgUpload"
								control={control}
								render={({ field }) => (
									<div>
										<img src={isFile} alt="" style={{ maxWidth: '400px' }} />
										<input type="file" onChange={captureFile} />
									</div>
								)}
							/>
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