import React, { useState } from "react";
import { Form, Container, Row } from "react-bootstrap";
import { useForm, Controller, handleSubmit } from "react-hook-form";
import ipfs from '../utils/ipfs';

export default function NewReview({addReview, web3}) {
	
	const { handleSubmit, control } = useForm();
	
	const [isFile, setFile] = useState(null);
	const [ipfsHash, setIpfsHash] = useState("");
	const [buffer, setBuffer] = useState(null);
	
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
	
	function getHash() {
		ipfs.files.add(buffer, (error, result) => {
			if (error) {
				console.log(error);
				return
			}
			setIpfsHash(result[0].hash);
	});
	}
	
	function submitData(data, e) {
		try {
			e.preventDefault();
			getHash();
			addReview(data.reviewRating, data.restaurantName, data.cuisineType, data.reviewBody, ipfsHash);
		} catch (e) {
			console.error(e);
		}
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
										onChange={(e) => field.onChange(web3.utils.toHex(e.target.value))}
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
										onChange={(e) => field.onChange(web3.utils.toHex(e.target.value))}
										className="form-control"
										placeholder="Cuisine Type"
										required 
									/>
								)}
							/>
							<br/>
							<Controller
								name="reviewRating"
								control={control}
								rules={{ max: 5, min: 1, required: true }}
								render={({ field }) => (
									<Form.Control
										{...field}
										onChange={(e) => field.onChange(Number(e.target.value))}
										className="form-control"
										placeholder="Your rating out of 5" 
									/>
								)}
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
										<img src={isFile} alt="" />
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