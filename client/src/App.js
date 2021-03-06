import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import restaurantReviewer from './contracts/restaurantReviewer.json';
import { Toaster } from 'react-hot-toast';
import getWeb3 from './utils/getWeb3.js';
import Navbar from './components/Navbar.js'
import PageFooter from './components/Footer.js'
import FrontPage from './components/FrontPage.js'
import NewReview from './components/NewReview.js'
import Main from './components/MainPage.js'
import './App.css';

const theme = createTheme();

class App extends Component {
	
  addReview(rating, restaurantName, cuisineType, reviewBody, ipfsHash) {
    this.setState({ isLoading: true })
	this.state.instance.methods.addReview(rating, restaurantName, cuisineType, reviewBody, ipfsHash).send({
		from: this.state.account }).once('confirmation', (n, receipt) => {
			this.setState({ isLoading: false })
			window.location.reload()
		}).then(this.updateCount()).catch(function(e) {
			console.error(e)
		})
	}
	
  tipReview(id, tipValue) {
	this.setState({ isLoading: true })
	this.state.instance.methods.tipReview(id).send({ from: this.state.account, value: tipValue }).once(
	'confirmation', (n, receipt) => {
		this.setState({ isLoading: false })
		window.location.reload()
	  }).catch(function(e) {
		  console.error(e)
	  })
	}
	
	updateCount = () => {
		this.state.instance.events.reviewSubmitted({}).on('data', (response) => {
			const newCount = response.returnValues['rNo']
			this.setState({ reviewCount: newCount })
		})
	}
	
  constructor(props) {
	super(props)
	this.state = {
		web3: null,
		account: null,
		instance: null,
		reviews: [],
		isLoading: true,
	};
	this.addReview = this.addReview.bind(this)
	this.tipReview = this.tipReview.bind(this)
	this.updateCount = this.updateCount.bind(this)
  }

    async componentDidMount() {
        try {
            // Get network provider and web3 instance.
			const web3 = await getWeb3();
			this.setState({ web3 })

			// Use web3 to get the user's account.
			const accounts = await web3.eth.getAccounts();
			this.setState({ account: accounts[0] })
			window.ethereum.on('accountsChanged', (accounts) => {
				this.setState({ account: accounts[0] }) 
	        });

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
				this.setState({ reviewCount })
		  
				for (let i = 1; i <= reviewCount; i++) {
					const review = await instance.methods.reviews(i).call()
					this.setState({
						reviews: [...this.state.reviews, review]
					})
				}
				this.setState({ isLoading: false })
				web3.eth.handleRevert = true;
			} else {
		        window.alert("The contract could not be deployed to a network.")
	        }
	    } catch(err) {
			console.log(err);
	    }
    }
	
	async componentDidUpdate(prevProps, prevState) {
		if (this.state.instance && this.state.reviewCount > prevState.reviewCount) {
			const newReviewCount = this.state.reviewCount
			console.log(newReviewCount)
				
			const newReview = await this.state.instance.methods.reviews(newReviewCount).call()
			console.log(newReview)
					
			this.setState({
				reviews: [...this.state.reviews, newReview]
			})
		}
	}

  render() {
	if (!this.state.web3) {
		return <div>Loading Web3, accounts, and contract...</div>;
	}
	return (
		<ThemeProvider theme={theme}>
			<div>
				<Router>
				<Navbar />
				<Route exact path="/" component={FrontPage} />
				<Route exact path="/newreview" render={props => (
					<React.Fragment>
					{
						this.state.loading
						? <center><div className="loader"></div></center>
						: <NewReview addReview={this.addReview} web3={this.state.web3} contract={this.state.instance} />
					}
					</React.Fragment>
				)} />
				<Route exact path="/reviews" render={props => (
					<React.Fragment>
					{
						this.state.loading
						? <center><div className="loader"></div></center>
						: <Main reviews={this.state.reviews} tipReview={this.tipReview} web3={this.state.web3} contract={this.state.instance} />
					}
					</React.Fragment>
				)} />
				<PageFooter />
				</Router>	
				<Toaster />
			</div>
		</ThemeProvider>
		);
	}
}

export default App;
