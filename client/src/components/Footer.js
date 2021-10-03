import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '25vh',
	},
	main: {
		marginTop: theme.spacing(9),
		marginBottom: theme.spacing(2),
	},
	footer: {
		padding: theme.spacing(3, 2),
		marginTop: 'auto',
		backgroundColor: 'lightGreen',
	},
}));

export default function PageFooter() {
	const classes = useStyles();
	
	return (
		<div className={classes.root}>
			<CssBaseline />
			
			<footer className={classes.footer}>
				<Container maxWidth="sm">
					<Typography align="center" variant="body1">Restaurant Review Dapp</Typography>
					<Typography align="center" variant="body2">Developed by Samuel Arnold-Parra</Typography>
				</Container>
			</footer>
		</div>
	);
}