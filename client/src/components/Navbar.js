import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	darkModeButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1
	},
}));

export default function NavBar() {
	const classes = useStyles();
	
	return (
		<div className={classes.root}>
			<AppBar position="static" style={{ backgroundColor: "lightGreen" }}>
				<Toolbar>
					<div className={classes.darkModeButton}>
						<RestaurantMenuIcon />
					</div>
					<Typography variant="h6" className={classes.title} style={{color: "white"}}>
					<Link to="/">
						<div style={{color:"white"}}>Restaurant Review Dapp</div>
					</Link>
					</Typography>
					<Link to="/">
						<Button style={{color:"white"}}>Home</Button>
					</Link>
					<Link to="/newreview">
						<Button style={{color:"white"}}>New Review</Button>
					</Link>
					<Link to="/reviews">
						<Button style={{color:"white"}}>Browse Reviews</Button>
					</Link>
				</Toolbar>
			</AppBar>
		</div>
	);
}