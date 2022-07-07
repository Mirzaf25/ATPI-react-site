import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

// reactstrap components
import {
	Card,
	CardHeader,
	CardBody,
	Media,
	Container,
	Row,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
} from 'reactstrap';

//MUI

import { connect } from 'react-redux';
import {
	LinearProgress,
	Avatar,
	Grid,
	TextField,
	Chip,
	Button,
	ButtonGroup,
	InputLabel,
	Select,
	MenuItem,
	Checkbox,
	ListItemText,
	OutlinedInput,
	withStyles,
} from '@material-ui/core';

class EditEvent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			event_listing_category: [],
			event_listing_category_selected: [],
			eventCreated: false,
			mediaOpen: false,
			event: null,
			form: {
				title: '',
				event_listing_category: [],
				meta: {
					_event_video_url: '',
					_thumbnail_id: '',
					_event_start_date: '',
				},
			},
		};
		this.handleChange = this.handleChange.bind(this);

		this.create_event_url =
			this.props.rcp_url.proxy_domain +
			this.props.rcp_url.base_wp_url +
			'event_listing/' +
			this.props.match.params.id;
	}

	async submitForm() {
		const res = await this.updateEvent();
		if (res.ok) return;
		const data = await res.json();
		this.setState(prevState => ({
			event: data,
			form: {
				...prevState.form,
				title: data?.title.rendered,
				meta: {
					...prevState.meta,
					_event_video_url: prevState.meta._event_video_url,
					_thumbnail_id: prevState.meta._thumbnail_id,
					_event_start_date: prevState.meta._event_start_date,
				},
				event_listing_category_selected:
					data?.meta?.event_listing_category,
			},
		}));
	}

	handleChange(event) {
		event.persist();
		const {
			target: { value, name = '', dataset },
		} = event;
		if (name === 'event_listing_category') {
			this.setState(prevState => ({
				...prevState,
				form: {
					...prevState.form,
					// [event.target.name]: [
					// 	typeof value === 'string' ? value.split(',') : value,
					// ],
					[event.target.name]: value,
				},
				event_listing_category_selected:
					typeof value === 'string' ? value.split(',') : value,
			}));
			return;
		}

		if (name === 'meta') {
			this.setState(prevState => ({
				...prevState,
				form: {
					...prevState.form,
					meta: {
						...prevState.form.meta,
						[dataset.name]: value,
					},
				},
			}));
			return;
		}

		this.setState(prevState => ({
			...prevState,
			form: {
				...prevState.form,
				[name]: value,
			},
		}));
	}

	componentDidMount() {
		const url = new URL(
			this.props.rcp_url.proxy_domain +
				this.props.rcp_url.base_wp_url +
				'event_listing_category'
		);

		fetch(url)
			.then(res => res.json())
			.then(data => this.setState({ event_listing_category: data }))
			.catch(e => console.error(e));

		if (this.state.event === null && this.props.user.token !== null)
			this.fetchEvent(
				this.props.rcp_url.proxy_domain +
					this.props.rcp_url.base_wp_url +
					'event_listing/' +
					this.props.match.params.id
			);
	}

	componentDidUpdate() {
		if (this.state.event === null && this.props.user.token !== null)
			this.fetchEvent(
				this.props.rcp_url.proxy_domain +
					this.props.rcp_url.base_wp_url +
					'event_listing/' +
					this.props.match.params.id
			);
	}

	fetchEvent = async url => {
		const queryUrl = new URL(url);
		const params = {
			_embed: true,
		};
		for (let key in params) {
			queryUrl.searchParams.set(key, params[key]);
		}
		const res = await fetch(queryUrl, {
			headers: {
				Authorization: 'Bearer ' + this.props.user.token,
			},
		});
		if (!res.ok) return;
		const data = await res.json();
		this.setState(prevState => ({
			event: data,
			form: {
				...prevState.form,
				title: data?.title.rendered,
				meta: {
					...prevState.meta,
					_event_video_url: data?.meta._event_video_url,
					_thumbnail_id: data?.meta._thumbnail_id,
					_event_start_date: data?.meta._event_start_date,
				},
			},
			event_listing_category_selected: data?.event_listing_category,
		}));
	};

	// /**
	//  *
	//  */
	// addProfileImage(formData) {
	// 	for (let [key, value] of formData) {
	// 		if (key !== 'file') formData.delete(key);
	// 	}

	// 	return fetch(
	// 		this.props.rcp_url.proxy_domain +
	// 			this.props.rcp_url.base_wp_url +
	// 			'media',
	// 		{
	// 			method: 'POST',
	// 			headers: {
	// 				//when using FormData(), the 'Content-Type' will automatically be set to 'form/multipart'
	// 				//so there's no need to set it here
	// 				Authorization: 'Bearer ' + this.props.user.token,
	// 			},
	// 			body: formData,
	// 		}
	// 	);
	// }

	updateEvent() {
		const formData = new FormData(
			document.getElementById('update-event-form')
		); // create again for title
		return fetch(this.create_event_url, {
			method: 'PUT',
			headers: {
				//when using FormData(), the 'Content-Type' will automatically be set to 'form/multipart'
				//so there's no need to set it here
				Authorization: 'Bearer ' + this.props.user.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...Object.fromEntries(formData),
				meta: {
					...this.state.form.meta,
				},
			}),
		});
	}

	handleClose = () => this.setState({ mediaOpen: false });

	handleOpen = () => this.setState({ mediaOpen: true });

	render() {
		return (
			<>
				<OnlyHeader />
				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<h3 className='mb-0'>Edit event</h3>
								</CardHeader>
								<CardBody>
									<Form
										id='update-event-form'
										onSubmit={e => {
											e.preventDefault();
											return this.submitForm();
										}}
									>
										<FormGroup row>
											<Col>
												<TextField
													id='title'
													label='Title'
													name='title'
													variant='outlined'
													value={
														this.state.form.title ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state.event
																?.title
																?.rendered !==
															'',
													}}
													required
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<InputLabel id='taxonomy_select_label'>
													Category
												</InputLabel>
												<Select
													style={{ width: '225px' }}
													labelId='taxonomy_select_label'
													id='taxonomy_select'
													multiple
													name='event_listing_category'
													value={
														this.state
															.event_listing_category_selected
													}
													renderValue={selected =>
														this.state.event_listing_category
															.filter(el =>
																selected.includes(
																	el.id
																)
															)
															.map(el => el.name)
															.join(', ')
													}
													onChange={this.handleChange}
													input={<OutlinedInput />}
													MenuProps={{
														PaperProps: {
															style: {
																maxHeight:
																	48 * 4.5 +
																	8,
																width: 250,
															},
														},
													}}
												>
													{this.state
														.event_listing_category
														.length !== 0 &&
														this.state.event_listing_category.map(
															(page, key) => (
																<MenuItem
																	key={
																		page.name
																	}
																	value={parseInt(
																		page.id
																	)}
																>
																	<Checkbox
																		checked={
																			this.state.event_listing_category_selected.indexOf(
																				parseInt(
																					page.id
																				)
																			) >
																			-1
																		}
																	/>
																	<ListItemText
																		primary={
																			page.name
																		}
																	/>
																</MenuItem>
															)
														)}
												</Select>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='_event_video_url'
													label='Event Video URL'
													name='meta'
													variant='outlined'
													inputRef={ref => {
														if (ref !== null) {
															const { dataset } =
																ref;
															dataset.name =
																'_event_video_url';
														}
													}}
													value={
														this.state.form?.meta
															._event_video_url ||
														''
													}
													onChange={this.handleChange}
													InputLabelProps={{
														shrink:
															this.state.event
																?.meta
																?._event_video_url
																?.rendered !==
															'',
													}}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Label>Event Start Date</Label>
												<Input
													type='date'
													name='meta'
													data-name='_event_start_date'
													className={
														this.props.classes
															.date +
														' MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl'
													}
													value={
														this.state.form?.meta._event_start_date
															.split(' ')
															.shift() || ''
													}
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>

										{/* <FormGroup row>
											<Col>
												{this.state.event !== null &&
													this.state.event?._embedded[
														'wp:featuredmedia'
													] && (
														<img
															ref='event_image'
															src={`${this.state.event?._embedded['wp:featuredmedia'][0]?.source_url}`}
															srcSet={`${this.state.event?._embedded['wp:featuredmedia'][0]?.source_url}`}
															alt={
																this.state.event
																	?.title
																	.rendered
															}
															loading='lazy'
															className='mw-100'
														/>
													)}
												<Input
													type='file'
													name='file'
													id='featured_image'
													accept='image/png, image/jpeg'
												/>
											</Col>
										</FormGroup> */}
										<FormGroup check row>
											<Col>
												<Button
													variant='contained'
													type='submit'
												>
													Submit
												</Button>
											</Col>
										</FormGroup>
									</Form>
								</CardBody>
							</Card>
						</div>
					</Row>
				</Container>
			</>
		);
	}
}

const mapStateToProps = state => {
	return {
		rcp_url: state.rcp_url,
		user: state.user,
	};
};

const mapDispatchToProps = {};

const styles = {
	date: {
		'&:hover': {
			borderColor: 'inherit',
		},
		'&:focus': {
			borderColor: '#3f51b5',
			borderWidth: '2px',
		},
	},
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(EditEvent));
