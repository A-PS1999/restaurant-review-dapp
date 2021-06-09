import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import restaurantReviewer from "./abis/restaurantReviewer.json";
import getWeb3 from "./utils/getWeb3";
import ipfs from './utils/ipfs';
import Navbar from './components/Navbar'
import FrontPage from './components/FrontPage'
import NewReview from './components/NewReview'
import "./App.css";

class App extends Component {
	
	addReview(rating, restaurantName, cuisineType, reviewBody, ipfsHash) {
		this.setState({ isLoading: true })
		this.state.contract.methods.addReview(rating, restaurantName, cuisineType, reviewBody, ipfsHash).send({
			from: this.state.account }).once('confirmation', (n, receipt) => {
				this.setState({ isLoading: false })
				window.location.reload()
			})
	}
	
	tipReview(id, tipValue) {
		this.setState({ isLoading: true })
		this.state.contract.methods.tipReview(id).send({ from: this.state.account, value: tipValue }).once(
		'confirmation', (n, receipt) => {
			this.setState({ isLoading: false })
			window.location.reload()
		})
	}
	
	constructor(props) {
		super(props)
		this.state = {
			web3: null,
			account: null,
			instance: null,
			reviewCount: 0,
			reviews: [],
			ipfsHash: '',
			isLoading: true
		};
		this.addReview = this.addReview.bind(this)
		this.tipReview = this.tipReview.bind(this)
	}

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
	  this.setState({ web3 })

      // Use web3 to get the user's account.
      const accounts = await web3.eth.getAccounts();
	  this.setState({ account: accounts[0] })

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = restaurantReviewer.networks[networkId];
	  
	  if(deployedNetwork) {
		  const instance = new web3.eth.Contract(
			restaurantReviewer.abi,
			deployedNetwork && deployedNetwork.address,	
		  );
		  this.setState({ instance })
		  const reviewCount = await instance.methods.reviewCount().call()
		  this.setState({ instance })
		  
		  for (let i = 1; i <= reviewCount; i++) {
			  const review = await instance.methods.reviews(i).call()
			  this.setState({
				  reviews: [...this.state.reviews, review]
			  })
		  }
		  this.setState({ isLoading: false })
	  } else {
		  window.alert("The contract could not be deployed to a network.")
	  }
	}

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
