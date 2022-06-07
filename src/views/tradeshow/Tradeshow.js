import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

import Editor from 'utils/Editor';

// reactstrap components
import {
	Card,
	CardHeader,
	CardBody,
	Container,
	Row,
	Col,
	Form,
	FormGroup,
	Label,
} from 'reactstrap';

import { connect } from 'react-redux';
import { TextField, Button, withStyles } from '@material-ui/core';

import MediaSelect from 'utils/MediaSelect';

class Tradeshow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tradeshow: null,
		};
		this.handleChange = this.handleChange.bind(this);
		this.submitForm = this.submitForm.bind(this);

		this.tradeshow_url =
			'https://atpi-dev15.grafton.digital' +
			this.props.rcp_url.base_wp_url +
			'pages/' +
			'5808';
		this.removeScriptRegExp =
			'/<script\b[^<]*(?:(?!</script>)<[^<]*)*</script>/gi';
	}

	componentDidMount() {
		if (this.state.tradeshow === null) {
			this.fetchTradeshow();
		}
	}

	fetchTradeshow = async () => {
		const res = await fetch(this.tradeshow_url);
		if (!res.ok) return;
		const data = await res.json();
		for (let key in data?.acf) {
			this.setState(prevState => ({
				acf: { ...prevState.acf, [key]: data?.acf[key] },
			}));
		}
		this.setState({ tradeshow: data, slug: data?.slug });
	};

	changeSlug = async () => {
		const res = await fetch(this.tradeshow_url, {
			method: 'PUT',
			headers: {
				Authorization:
					'Basic ZmFyaGFuYW53YXI1NjJAZ21haWwuY29tOk5leHRwYWtAMTIz',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				slug: this.state.slug,
			}),
		});

		if (res.status >= 400) return;

		const data = await res.json();

		this.setState({ tradeshow: data, slug: data?.slug });
	};

	submitForm = async e => {
		e.preventDefault();

		const res = await fetch(this.tradeshow_url, {
			method: 'PUT',
			headers: {
				Authorization:
					'Basic ZmFyaGFuYW53YXI1NjJAZ21haWwuY29tOk5leHRwYWtAMTIz',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				acf: {
					...this.state.acf,
					about_event_section: {
						...this.state.acf.about_event_section,
						third_img:
							this.state.acf.about_event_section.third_img || 0,
					},
				},
			}),
		});

		if (res.status >= 400) return;

		const data = await res.json();

		for (let key in data?.acf) {
			this.setState(prevState => ({
				acf: { ...prevState.acf, [key]: data?.acf[key] },
			}));
		}
		this.setState({ tradeshow: data });
	};

	handleChange = e => {
		const {
			target: {
				name,
				value,
				dataset: { field },
			},
		} = e;

		this.setState(prevState => ({
			...prevState,
			acf: {
				...prevState.acf,
				[field]: { ...prevState.acf[field], [name]: value },
			},
		}));
	};

	render() {
		return (
			<>
				{/* <link
					rel='stylesheet'
					href='https://atpi-dev15.grafton.digital/wp-content/plugins/elementor-pro/assets/css/modules/notes/frontend.min.css?ver=3.7.1'
				/>
				<link
					rel='stylesheet'
					href='https://atpi-dev15.grafton.digital/wp-content/plugins/elementor/assets/css/frontend-lite.min.css?ver=3.6.5'
				/>
				<link
					rel='stylesheet'
					href='https://atpi-dev15.grafton.digital/wp-content/plugins/elementor/assets/css/common.min.css?ver=3.6.5'
				/> */}
				<OnlyHeader />
				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<h3 className='mb-0'>Tradeshow</h3>
								</CardHeader>
								<CardBody>
									<Form
										data-id='banner'
										className='mb-4'
										onSubmit={this.submitForm}
									>
										<h2 className='mb-2'>Banner</h2>
										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Title
												</Label>
												<Editor
													fieldName='title'
													dataName='banner'
													onInputChange={
														this.handleChange
													}
													value={
														this.state?.tradeshow
															?.acf?.banner
															?.title || ''
													}
												/>
												{/* 
												<TextField
													id='title'
													label='Title'
													name='title'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'banner';
														}
													}}
													variant='outlined'
													value={
														this.state?.acf?.banner
															?.title || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.banner
																?.title !== '',
													}}
													onChange={this.handleChange}
												/> */}
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Description
												</Label>
												<Editor
													fieldName='description'
													dataName='banner'
													onInputChange={
														this.handleChange
													}
													value={
														this.state?.tradeshow
															?.acf?.banner
															?.description || ''
													}
												/>
												{/* <TextField
													id='description'
													label='Description'
													name='description'
													variant='outlined'
													multiline
													maxRows={Infinity}
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'banner';
														}
													}}
													value={
														this.state?.acf?.banner
															?.description || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.banner
																?.description !==
															'',
													}}
													onChange={this.handleChange}
												/> */}
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='url'
													label='URL'
													name='url'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'banner';
														}
													}}
													value={
														this.state?.acf?.banner
															?.url || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.banner
																?.url !== '',
													}}
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='button_text'
													label='Button Text'
													name='button_text'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'banner';
														}
													}}
													value={
														this.state?.acf?.banner
															?.button_text || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.banner
																?.button_text !==
															'',
													}}
													onChange={this.handleChange}
												/>
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
									<Form
										data-id='call_for_action'
										onSubmit={this.submitForm}
										className='mb-4'
									>
										<h2>Call For Action</h2>
										<FormGroup row>
											<Col>
												<TextField
													id='text'
													label='Text'
													name='text'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'call_for_action';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.call_for_action
															?.text || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.call_for_action
																?.text !== '',
													}}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='button1_name'
													label='Button Name'
													name='button1_name'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'call_for_action';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.call_for_action
															?.button1_name || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.call_for_action
																?.button1_name !==
															'',
													}}
												/>
											</Col>
										</FormGroup>

										<FormGroup row>
											<Col>
												<TextField
													id='button1_url'
													label='Button URL'
													name='button1_url'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'call_for_action';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.call_for_action
															?.button1_url || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.call_for_action
																?.button1_url !==
															'',
													}}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='button2_text'
													label='Button Name'
													name='button2_text'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'call_for_action';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.call_for_action
															?.button2_text || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.call_for_action
																?.button2_text !==
															'',
													}}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='button2_url'
													label='Button URL'
													name='button2_url'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'call_for_action';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.call_for_action
															?.button2_url || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.call_for_action
																?.button2_url !==
															'',
													}}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='vimeo_video_url'
													label='Vimeo Video URL'
													name='vimeo_video_url'
													variant='outlined'
													value={
														this.state?.acf
															?.vimeo_video_url ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.vimeo_video_url !==
															'',
													}}
												/>
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
									<FormGroup row>
										<Col className='mb-4'>
											<TextField
												className='d-block mt-4 mb-4'
												id='slug'
												label='Page slug'
												name='slug'
												variant='outlined'
												value={this.state?.slug || ''}
												InputLabelProps={{
													shrink:
														this.state?.slug !== '',
												}}
											/>
											<Button
												className='ml-4'
												variant='contained'
												onClick={this.changeSlug}
											>
												Change
											</Button>
										</Col>
									</FormGroup>

									<Form
										data-id='about_event_section'
										onSubmit={this.submitForm}
										className='mb-4'
									>
										<h2>About Event Section</h2>
										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Intro
												</Label>
												<Editor
													fieldName='intro'
													dataName='about_event_section'
													onInputChange={
														this.handleChange
													}
													value={
														this.state?.tradeshow
															?.acf
															?.about_event_section
															?.intro || ''
													}
												/>
												{/* <TextField
													id='intro'
													label='Intro'
													name='intro'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'about_event_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.about_event_section
															?.intro || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.about_event_section
																?.intro !== '',
													}}
												/> */}
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='first_heading'
													label='First Heading'
													name='first_heading'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'about_event_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.about_event_section
															?.first_heading ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.about_event_section
																?.first_heading !==
															'',
													}}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Label className='d-block'>
													First Description
												</Label>
												<Editor
													fieldName='first_desc'
													dataName='about_event_section'
													onInputChange={
														this.handleChange
													}
													value={
														this.state?.tradeshow
															?.acf
															?.about_event_section
															?.first_desc || ''
													}
												/>
												{/* <TextField
													id='first_desc'
													label='First Description'
													name='first_desc'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'about_event_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.about_event_section
															?.first_desc || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.about_event_section
																?.first_desc !==
															'',
													}}
												/> */}
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='second_heading'
													label='Second Heading'
													name='second_heading'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'about_event_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.about_event_section
															?.second_heading ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.about_event_section
																?.second_heading !==
															'',
													}}
												/>
											</Col>
										</FormGroup>

										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Tradeshow Image
												</Label>
												<MediaSelect
													fieldName='third_img'
													initialVal={
														this.state
															?.tiles_section
															?.third_img ===
														undefined
															? 0
															: this.state
																	?.tiles_section
																	?.third_img
													}
													setValue={val =>
														this.setState(
															prevState => ({
																...prevState,
																acf: {
																	...prevState.acf,
																	about_event_section:
																		{
																			...prevState
																				.acf
																				.about_event_section,
																			third_img:
																				val,
																		},
																},
															})
														)
													}
												/>
											</Col>
										</FormGroup>

										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Second Description
												</Label>
												<Editor
													fieldName='second_desc'
													dataName='about_event_section'
													onInputChange={
														this.handleChange
													}
													value={
														this.state?.tradeshow
															?.acf
															?.about_event_section
															?.second_desc || ''
													}
												/>
												{/* <TextField
													id='second_desc'
													label='Second Description'
													name='second_desc'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'about_event_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.about_event_section
															?.second_desc || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.about_event_section
																?.second_desc !==
															'',
													}}
												/> */}
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='third_heading'
													label='Third Heading'
													name='third_heading'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'about_event_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.about_event_section
															?.third_heading ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.about_event_section
																?.third_heading !==
															'',
													}}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Third Description
												</Label>
												<Editor
													fieldName='third_desc'
													dataName='about_event_section'
													onInputChange={
														this.handleChange
													}
													value={
														this.state?.tradeshow
															?.acf
															?.about_event_section
															?.third_desc || ''
													}
												/>
												{/* <TextField
													id='third_desc'
													label='Third Description'
													name='third_desc'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'about_event_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.about_event_section
															?.third_desc || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.about_event_section
																?.third_desc !==
															'',
													}}
												/> */}
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='fourth_heading'
													label='Fourth Heading'
													name='fourth_heading'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'about_event_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.about_event_section
															?.fourth_heading ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.about_event_section
																?.fourth_heading !==
															'',
													}}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Fourth Description
												</Label>
												<Editor
													fieldName='fourth_desc'
													dataName='about_event_section'
													onInputChange={
														this.handleChange
													}
													value={
														this.state?.tradeshow
															?.acf
															?.about_event_section
															?.fourth_desc || ''
													}
												/>
												{/* <TextField
													id='fourth_desc'
													label='Fourth Description'
													name='fourth_desc'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'about_event_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.about_event_section
															?.fourth_desc || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.about_event_section
																?.fourth_desc !==
															'',
													}}
												/> */}
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='fifth_heading'
													label='Fifth Heading'
													name='fifth_heading'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'about_event_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.about_event_section
															?.fifth_heading ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.about_event_section
																?.fifth_heading !==
															'',
													}}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Fifth Description
												</Label>
												<Editor
													fieldName='fifth_desc'
													dataName='about_event_section'
													onInputChange={
														this.handleChange
													}
													value={
														this.state?.tradeshow
															?.acf
															?.about_event_section
															?.fifth_desc || ''
													}
												/>
												{/* <TextField
													id='fifth_desc'
													label='Fifth Description'
													name='fifth_desc'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'about_event_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.about_event_section
															?.fifth_desc || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.about_event_section
																?.fifth_desc !==
															'',
													}}
												/> */}
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
									<Form
										data-id='tiles_section'
										onSubmit={this.submitForm}
										className='mb-4'
									>
										<h2 className='mb-2'>Tiles Section</h2>
										<FormGroup row>
											<Col>
												<TextField
													id='heading'
													label='Heading'
													name='heading'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'tiles_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.tiles_section
															?.heading || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.tiles_section
																?.heading !==
															'',
													}}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Description
												</Label>
												<Editor
													fieldName='intro_desc'
													dataName='tiles_section'
													onInputChange={
														this.handleChange
													}
													value={
														this.state?.tradeshow
															?.acf?.tiles_section
															?.intro_desc || ''
													}
												/>
												{/* <TextField
													id='intro_desc'
													label='Description'
													name='intro_desc'
													variant='outlined'
													multiline
													maxRows={Infinity}
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'tiles_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.tiles_section
															?.intro_desc || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.tiles_section
																?.intro_desc !==
															'',
													}}
												/> */}
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Tradeshow Image
												</Label>
												<MediaSelect
													fieldName='speaker_image'
													initialVal={
														this.state?.acf
															?.tiles_section
															?.speaker_image !==
														undefined
															? this.state?.acf
																	?.tiles_section
																	?.speaker_image
															: 0
													}
													setValue={val =>
														this.setState(
															prevState => ({
																...prevState,
																acf: {
																	...prevState.acf,
																	tiles_section:
																		{
																			...prevState
																				.acf
																				.tiles_section,
																			speaker_image:
																				val,
																		},
																},
															})
														)
													}
												/>
											</Col>
										</FormGroup>

										<FormGroup row>
											<Col>
												<TextField
													id='speaker_text'
													label='Speaker Text'
													name='speaker_text'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'tiles_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.tiles_section
															?.speaker_text || ''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.banner
																?.speaker_text !==
															'',
													}}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Tradeshow Image
												</Label>
												<MediaSelect
													fieldName='schedule_image'
													initialVal={
														this.state?.acf
															?.tiles_section
															?.schedule_image !==
														undefined
															? this.state?.acf
																	?.tiles_section
																	?.schedule_image
															: 0
													}
													setValue={val =>
														this.setState(
															prevState => ({
																...prevState,
																acf: {
																	...prevState.acf,
																	tiles_section:
																		{
																			...prevState
																				.acf
																				.tiles_section,
																			schedule_image:
																				val,
																		},
																},
															})
														)
													}
												/>
											</Col>
										</FormGroup>

										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Schedule Description
												</Label>
												<Editor
													fieldName='schedule_desc'
													dataName='tiles_section'
													onInputChange={
														this.handleChange
													}
													value={
														this.state?.tradeshow
															?.acf?.tiles_section
															?.schedule_desc ||
														''
													}
												/>
												{/* <TextField
													id='schedule_desc'
													label='Schedule Description'
													name='schedule_desc'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'tiles_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.tiles_section
															?.schedule_desc ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.banner
																?.schedule_desc !==
															'',
													}}
												/> */}
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Tradeshow Image
												</Label>
												<MediaSelect
													fieldName='trade_show_image'
													initialVal={
														this.state?.acf
															?.tiles_section
															?.trade_show_image !==
														undefined
															? this.state?.acf
																	?.tiles_section
																	?.trade_show_image
															: 0
													}
													setValue={val =>
														this.setState(
															prevState => ({
																...prevState,
																acf: {
																	...prevState.acf,
																	tiles_section:
																		{
																			...prevState
																				.acf
																				.tiles_section,
																			trade_show_image:
																				val,
																		},
																},
															})
														)
													}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Label className='d-block'>
													Tradeshow Description
												</Label>
												<Editor
													fieldName='trade_show_desc'
													dataName='tiles_section'
													onInputChange={
														this.handleChange
													}
													value={
														this.state?.tradeshow
															?.acf?.tiles_section
															?.trade_show_desc ||
														''
													}
												/>
												{/* <TextField
													id='trade_show_desc'
													label='Tradeshow Description'
													name='trade_show_desc'
													variant='outlined'
													inputRef={node => {
														if (node) {
															node.dataset.field =
																'tiles_section';
														}
													}}
													onChange={this.handleChange}
													value={
														this.state?.acf
															?.tiles_section
															?.trade_show_desc ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state?.acf
																?.banner
																?.trade_show_desc !==
															'',
													}}
												/> */}
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
									{/* <div
										dangerouslySetInnerHTML={{
											__html: this.state.tradeshow
												?.content?.rendered,
										}}
									></div> */}
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
	};
};

const mapDispatchToProps = {};

const styles = {
	icon_col: {
		flexDirection: 'column',
		justifyContent: 'center',
		'@media(max-width: 575px)': {
			flexDirection: 'row',
			alignItems: 'center',
		},
	},
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(Tradeshow));
