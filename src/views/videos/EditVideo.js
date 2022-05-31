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
import { DataGrid } from '@material-ui/data-grid';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
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
	ListItemAvatar,
} from '@material-ui/core';

import MatEdit from 'views/MatEdit';

class EditVideo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validate: {},
			organizers: [],
			organizers_selected: [],
			video: null,
			form: {
				title: '',
				acf: {
					organizers: [],
					webinar_recording_video: '',
				},
			},
		};
		this.handleChange = this.handleChange.bind(this);

		this.update_video_url =
			this.props.rcp_url.proxy_domain +
			this.props.rcp_url.base_wp_url +
			'webinar/' +
			this.props.match.params.id;
	}

	async submitForm() {
		const res = await this.updateVideo();
		if (res.ok) return;
		const data = await res.json();
		this.setState(prevState => ({
			video: data,
			form: {
				...prevState.form,
				title: data?.title.rendered,
				acf: data?.acf,
			},
			organizers_selected: data?.acf.organizers,
		}));
	}

	handleChange(event) {
		const {
			target: { value, name = '', dataset = { name: 'organizers' } },
		} = event;

		if (name === 'acf') {
			this.setState(prevState => ({
				...prevState,
				form: {
					...prevState.form,
					acf: {
						...prevState.form.acf,
						[dataset.name]: value,
					},
				},
				organizers_selected:
					typeof value === 'string' ? value.split(',') : value,
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
		this.fetchOrganizers();
		if (this.state.video === null && this.props.user.token !== null) {
			this.fetchVideo(this.update_video_url);
		}
	}

	componentDidUpdate() {
		if (this.state.video === null && this.props.user.token !== null) {
			this.fetchVideo(this.update_video_url);
		}
	}

	fetchOrganizers = async () => {
		const url = new URL(
			this.props.rcp_url.proxy_domain +
				this.props.rcp_url.base_wp_url +
				'event_organizer/'
		);

		const params = {
			_embed: true,
		};

		for (let key in params) {
			url.searchParams.set(key, params[key]);
		}
		const res = await fetch(url);

		if (!res.ok) return;

		const data = await res.json();

		this.setState({ organizers: data });
	};

	fetchVideo = async url => {
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
			video: data,
			form: {
				...prevState.form,
				title: data?.title.rendered,
				acf: data?.acf,
			},
			organizers_selected: data?.acf.organizers,
		}));
	};

	updateVideo() {
		return fetch(this.update_video_url, {
			method: 'PUT',
			headers: {
				//when using FormData(), the 'Content-Type' will automatically be set to 'form/multipart'
				//so there's no need to set it here
				Authorization: 'Bearer ' + this.props.user.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(this.state.form),
		});
	}

	render() {
		return (
			<>
				<OnlyHeader />
				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<h3 className='mb-0'>Edit Video</h3>
								</CardHeader>
								<CardBody>
									<Form
										id='update-video-form'
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
													className='w-50'
													value={
														this.state.form.title ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state.video
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
												<TextField
													id='webinar_recording_video'
													label='Webinar Recording URL'
													name='acf'
													variant='outlined'
													className='w-50'
													value={
														this.state.form?.acf
															?.webinar_recording_video ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state.video
																?.acf
																?.webinar_recording_video !==
															'',
													}}
													required
													inputRef={ref => {
														if (ref !== null) {
															const { dataset } =
																ref;
															dataset.name =
																'webinar_recording_video';
														}
													}}
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<InputLabel id='organizers_selected_select_label'>
													Page Show
												</InputLabel>
												<Select
													style={{ width: '225px' }}
													labelId='organizers_selected_select_label'
													id='organizers_selected_select'
													multiple
													name='acf'
													className='w-50'
													value={
														this.state
															.organizers_selected
													}
													renderValue={selected =>
														this.state.organizers
															.filter(el =>
																selected.includes(
																	el.id
																)
															)
															.map(el =>
																el.title.rendered
																	.split(' ')
																	.splice(
																		0,
																		2
																	)
																	.join('')
															)
															.join(', ')
													}
													onChange={this.handleChange}
													input={<OutlinedInput />}
													inputRef={ref => {
														if (ref !== null) {
															const { node } =
																ref;
															node.dataset.name =
																'organizers';
														}
													}}
													MenuProps={{
														PaperProps: {
															style: {
																maxHeight:
																	48 * 4.5 +
																	8,
																width: 500,
															},
														},
													}}
												>
													{this.state.organizers
														.length !== 0 &&
														this.state.organizers.map(
															(
																organizer,
																key
															) => (
																<MenuItem
																	key={
																		organizer.id
																	}
																	value={parseInt(
																		organizer.id
																	)}
																>
																	<Checkbox
																		checked={
																			this.state.organizers_selected.indexOf(
																				parseInt(
																					organizer.id
																				)
																			) >
																			-1
																		}
																	/>

																	<ListItemAvatar>
																		<Avatar
																			alt={
																				organizer
																					.title
																					.rendered
																			}
																			src={
																				organizer
																					.acf
																					.organizer_profile_image !==
																				''
																					? organizer._embedded[
																							'wp:featuredmedia'
																					  ].find(
																							el =>
																								el.id ===
																								organizer
																									.acf
																									.organizer_profile_image
																					  )
																							.source_url
																					: ''
																			}
																		/>
																	</ListItemAvatar>

																	<ListItemText
																		primary={
																			organizer
																				.title
																				.rendered
																		}
																	/>
																</MenuItem>
															)
														)}
												</Select>
											</Col>
										</FormGroup>
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

const mapDispatchToProps = { setUserLoginDetails };

export default connect(mapStateToProps, mapDispatchToProps)(EditVideo);
