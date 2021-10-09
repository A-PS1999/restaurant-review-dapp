const RestaurantReviewer = artifacts.require('./RestaurantReviewer.sol')
const truffleAssert = require('truffle-assertions')

contract("RestaurantReviewer", async accounts => {
	
	// example review details for testing
	const rating = 4
	const restaurantName = "Test Restaurant"
	const cuisineType = "French"
	const reviewBody = "This is a test review of a test restaurant, to show that the smart contract function works correctly."
	const ipfsHash = ""
	
	it('should add a review when all requirements are met', async () => {
		const resReviewer = await RestaurantReviewer.deployed()
		
		await truffleAssert.passes(resReviewer.addReview.call(
			rating, 
			web3.utils.toHex(restaurantName),
			web3.utils.toHex(cuisineType),
			reviewBody,
			ipfsHash
			)
		)
	})
	
	it('should emit a reviewSubmitted event upon review submission', async () => {
		const resReviewer = await RestaurantReviewer.deployed()
		
		const sentReview = await resReviewer.addReview(
			rating, 
			web3.utils.toHex(restaurantName),
			web3.utils.toHex(cuisineType),
			reviewBody,
			ipfsHash
		)
		
		truffleAssert.eventEmitted(sentReview, 'reviewSubmitted', (ev) => {
			return web3.utils.hexToUtf8(ev.name) === restaurantName && ev.rNo > 0
		})
	})
	
	it('requires a restaurant name to be provided', async () => {
		const badName = ""
		
		const resReviewer = await RestaurantReviewer.deployed()
		
		try {
			await resReviewer.addReview(
				rating,
				web3.utils.toHex(badName),
				web3.utils.toHex(cuisineType),
				reviewBody,
				ipfsHash
			)
			assert.fail('An error should have occurred')
		} catch (err) {
			assert.include(err.message, 'revert', "Error message should contain 'revert'")
		}
	})
	
	it('requires a review to be provided', async () => {
		const badReview = ""
		
		const resReviewer = await RestaurantReviewer.deployed()
		
		try {
			await resReviewer.addReview(
				rating,
				web3.utils.toHex(restaurantName),
				web3.utils.toHex(cuisineType),
				badReview,
				ipfsHash
			)
			assert.fail('An error should have occurred')
		} catch (err) {
			assert.include(err.message, 'revert', "Error message should contain 'revert'")
		}
	})
	
	it('requires a rating of no more than 5', async () => {
		const badRating = 6
		
		const resReviewer = await RestaurantReviewer.deployed()
		
		try {
			await resReviewer.addReview(
				badRating,
				web3.utils.toHex(restaurantName),
				web3.utils.toHex(cuisineType),
				reviewBody,
				ipfsHash
			)
			assert.fail('An error should have occurred')
		} catch (err) {
			assert.include(err.message, 'revert', "Error message should contain 'revert'")
		}
	})
	
	it('should allow a submitted review which meets all requirements to be tipped', async () => {
		const resReviewer = await RestaurantReviewer.deployed()
		const tippingAccount = accounts[3]
		const tipValue = web3.utils.toWei('0.1', 'Ether')
		
		const newReview = await resReviewer.addReview(
			rating, 
			web3.utils.toHex(restaurantName),
			web3.utils.toHex(cuisineType),
			reviewBody,
			ipfsHash
		)
		
		await resReviewer.tipReview(1, {from: tippingAccount, value: tipValue})
		
		const toCheck = await resReviewer.reviews(1)
		
		assert.equal(toCheck.tipCount, 1, 'was tipped successfully')
	})
	
	it('should emit a tipSent event upon successful tipReview transaction', async () => {
		const resReviewer = await RestaurantReviewer.deployed()
		const tippingAccount = accounts[3]
		const tipValue = web3.utils.toWei('0.1', 'Ether')
		
		const newReview = await resReviewer.addReview(
			rating, 
			web3.utils.toHex(restaurantName),
			web3.utils.toHex(cuisineType),
			reviewBody,
			ipfsHash
		)
		
		const testTip = await resReviewer.tipReview(1, {from: tippingAccount, value: tipValue})
		
		truffleAssert.eventEmitted(testTip, 'tipSent', (ev) => {
			return(
				ev.rNo == 1 && ev._value == tipValue
			)
		})
	})
	
	it('should fail if attempting to tip a non-existent review ID', async () => {
		const resReviewer = await RestaurantReviewer.deployed()
		const tippingAccount = accounts[3]
		const tipValue = web3.utils.toWei('0.1', 'Ether')
		
		const newReview = await resReviewer.addReview(
			rating, 
			web3.utils.toHex(restaurantName),
			web3.utils.toHex(cuisineType),
			reviewBody,
			ipfsHash
		)
		
		try {
			await resReviewer.tipReview(0, {from: tippingAccount, value: tipValue})
			
			assert.fail('An error should have occurred.')
		} catch (err) {
			assert.include(err.message, 'revert', "Error message should contain 'revert'")
		}
	})
	
	it("should fail if attempting to tip one's own review", async () => {
		const resReviewer = await RestaurantReviewer.deployed()
		const tippingAccount = accounts[0]
		const tipValue = web3.utils.toWei('0.1', 'Ether')
		
		const newReview = await resReviewer.addReview(
			rating, 
			web3.utils.toHex(restaurantName),
			web3.utils.toHex(cuisineType),
			reviewBody,
			ipfsHash
		)
		
		try {
			await resReviewer.tipReview(1, {from: tippingAccount, value: tipValue})
			
			assert.fail('An error should have occurred.')
		} catch (err) {
			assert.include(err.message, 'revert', "Error message should contain 'revert'")
		}
	})
});