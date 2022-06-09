import React from 'react';
import { setMedia } from 'features/media/mediaSlice';

// reactstrap components

import { connect } from 'react-redux';
import {
	Box,
	Button,
	CircularProgress,
	ImageList,
	Modal,
	ImageListItem,
	withStyles,
} from '@material-ui/core';
import { Card, CardHeader, CardBody } from 'reactstrap';

class MediaSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			loading: false,
			[this.props.fieldName]: this.props.initialVal || 0,
			open: false,
		};
	}

	componentDidMount() {
		if (!this.props.media || this.props.media.length === 0) {
			fetch(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_wp_url +
					'media'
			)
				.then(res => {
					if (!res.ok) return;
					return res.json();
				})
				.then(data => this.props.setMedia(data))
				.catch(e => console.error(e));
		}
	}

	componentDidUpdate({ initialVal: prevInitialVal }) {
		if (this.props.initialVal !== prevInitialVal) {
			this.setState({ [this.props.fieldName]: this.props.initialVal });
		}
	}

	onClose = () => this.setState({ open: false });

	fetchMedia() {
		this.setState({ loading: true });
		const url = new URL(
			this.props.rcp_url.domain + this.props.rcp_url.base_wp_url + 'media'
		);
		const params = {
			page: this.state.page + 1,
		};
		for (let key in params) {
			url.searchParams.set(key, params[key]);
		}
		fetch(url)
			.then(res => {
				if (!res.ok) return;
				return res.json();
			})
			.then(data => {
				this.props.setMedia(this.props.media.concat(data));
				this.setState({ loading: false });
			})
			.catch(e => console.error(e));
	}

	fetchSingleMedia = async () => {
		if (
			this.state[this.props.fieldName] !== 0 &&
			this.state[this.props.fieldName]
		) {
			const res = await fetch(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_wp_url +
					'media/' +
					this.state[this.props.fieldName]
			);

			if (!res.ok) return;
			const data = await res.json();

			this.props.setMedia(this.props.media.concat([data]));
		}
	};

	render() {
		return (
			<React.Fragment>
				{this.state[this.props.fieldName] !== 0 && (
					<Box
						className={this.props.classes.image_button}
						style={{ position: 'relative' }}
					>
						<img
							className={this.props.classes.image_preview}
							src={
								this.props.media.find(
									el =>
										el.id ===
										this.state[this.props.fieldName]
								)?.source_url === undefined
									? this.fetchSingleMedia()
									: this.props.media.find(
											el =>
												el.id ===
												this.state[this.props.fieldName]
									  )?.source_url
							}
						/>
						<Button
							className={
								this.props.classes.close_button +
								' ' +
								this.props.classes.change_button
							}
							variant='contained'
							onClick={() => this.setState({ open: true })}
						>
							<i className='fa fa-plus' />
						</Button>
					</Box>
				)}
				{this.state[this.props.fieldName] === 0 && (
					<Button
						className={this.props.classes.image_button}
						variant='contained'
						disableElevation
						onClick={() => this.setState({ open: true })}
					>
						<i className='fa fa-plus mr-4' />
						Add an Image
					</Button>
				)}
				<Modal open={this.state.open} onClose={this.onClose}>
					<Box className={this.props.classes.box}>
						<Card>
							<CardHeader className='border-0 d-flex justify-content-between'>
								<h3 className='mb-0'>Select Media</h3>
								<Button
									onClick={() => {
										this.onClose();
										this.setState({
											[this.props.fieldName]: 0,
										});
									}}
									className={this.props.classes.close_button}
								>
									<i className='fa fa-times' />
								</Button>
							</CardHeader>
							<CardBody>
								<ImageList gap={8}>
									{this.props.media &&
										this.props.media.length !== 0 &&
										this.props.media.map(
											({ id, title, source_url }) => (
												<ImageListItem
													key={id}
													className={
														this.props.classes
															.list_item +
														' media-items'
													}
													data-id={id}
													onClick={e => {
														const [node, input] = [
															e.target.parentNode,
															document.getElementById(
																'radio-image-' +
																	id
															),
														];
														if (!input.checked) {
															input.checked = true;
															this.setState({
																[this.props
																	.fieldName]: id,
															});
															[].forEach.call(
																document.getElementsByClassName(
																	'selected'
																),
																function (el) {
																	el.classList.remove(
																		'selected'
																	);
																}
															);
															node.classList.add(
																'selected'
															);
														} else {
															input.checked = false;
															this.setState({
																[this.props
																	.fieldName]: 0,
															});
															node.classList.remove(
																'selected'
															);
														}
													}}
												>
													<img
														src={`${source_url}?w=164&h=164&fit=crop&auto=format`}
														srcSet={`${source_url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
														alt={title.rendered}
														loading='lazy'
													/>
													<input
														type='radio'
														className='d-none'
														name={
															this.props.fieldName
														}
														value={id}
														data-id={id}
														id={'radio-image-' + id}
													/>
												</ImageListItem>
											)
										)}
								</ImageList>
								<div className='d-flex justify-content-center mt-4 mb-4'>
									<Button
										onClick={this.fetchMedia.bind(this)}
									>
										{this.state.loading && (
											<CircularProgress size='1.3rem' />
										)}
										{!this.state.loading && 'Load More'}
									</Button>
									<Button
										variant='contained'
										onClick={() => {
											this.onClose();
											this.props.setValue(
												this.state[this.props.fieldName]
											);
										}}
									>
										Select
									</Button>
								</div>
							</CardBody>
						</Card>
					</Box>
				</Modal>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => {
	return {
		media: state.media.media,
		rcp_url: state.rcp_url,
		user: state.user,
	};
};
const mapDispatchToProps = { setMedia };

const styles = {
	box: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		width: '80%',
		height: '80%',
		transform: 'translate(-50%, -50%)',
		bgcolor: 'background.paper',
		p: 4,
		overflowY: 'auto',
	},
	list_item: {
		width: '33.333% !important',
		minWidth: '200px',
		'@media(max-width: 460px)': {
			width: '50% !important',
		},
		'&.selected': {
			border: '3px solid #3f51b5',
		},
		'& div::after': {
			content: '""',
			width: '100%',
			height: '100%',
			position: 'absolute',
			inset: 0,
		},
	},
	close_button: {
		minWidth: 'unset',
		height: 'max-content',
	},
	image_button: {
		width: '200px',
		height: '100px',
	},
	image_preview: {
		maxWidth: '100%',
		maxHeight: '100%',
		width: '100%',
		height: '100%',
		objectFit: 'contain',
	},
	change_button: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
	},
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(MediaSelect));
