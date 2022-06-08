import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

// reactstrap components
import { Col, Form, FormGroup, Row } from 'reactstrap';

//MUI

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
import {
	List,
	ListItem,
	ListItemText,
	Divider,
	Button,
	CircularProgress,
} from '@material-ui/core';

class EventLoopSingle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			delLoading: false,
		};
	}

	render() {
		return (
			<Row className='w-100 border-bottom mb-4'>
				<Col xs={12} sm={4}>
					<div>
						{this.props.item?._embedded !== undefined &&
							this.props.item?._embedded['wp:featuredmedia'] && (
								<img
									src={`${this.props.item?._embedded['wp:featuredmedia'][0]?.source_url}`}
									srcSet={`${this.props.item?._embedded['wp:featuredmedia'][0]?.source_url}`}
									alt={this.props?.item.title.rendered}
									loading='lazy'
									className='mw-100'
								/>
							)}
					</div>
				</Col>
				<Col xs={12} sm={8}>
					<List>
						<ListItem>
							<ListItemText primary={'Name:'} />
							<ListItemText
								primary={this.props.item?.title.rendered}
							/>
						</ListItem>
						<Divider component='li' />
						{this.props.item?._embedded !== undefined &&
							this.props.item?._embedded['wp:term'] !==
								undefined && (
								<>
									<ListItem>
										<ListItemText primary={'Category :'} />
										<ListItemText
											primary={this.props.item?._embedded[
												'wp:term'
											]
												.filter(
													el =>
														el.taxonomy ===
														'event_listing_category'
												)
												.map(el => el.slug)
												.join(', ')}
										/>
									</ListItem>
									<Divider component='li' />
								</>
							)}
						<ListItem>
							<ListItemText primary={'Event Expiry Date :'} />
							<ListItemText
								primary={
									this.props.item?.meta?._event_expiry_date
								}
							/>
						</ListItem>
						<Divider component='li' />
						{this.props.item?.meta?._event_video_url && (
							<>
								<ListItem>
									<ListItemText
										primary={'Event Video URL :'}
									/>
									<ListItemText
										primary={
											this.props.item?.meta
												?._event_video_url
										}
										className='text-small'
									/>
								</ListItem>
								<Divider component='li' />
							</>
						)}
						<ListItem>
							<Button
								onClick={e =>
									this.props.editHandle(
										e,
										this.props.item?.id
									)
								}
							>
								Edit
							</Button>
							<Button
								onClick={async () => {
									this.setState({ delLoading: true });
									await this.props.deleteHandle(
										this.props.rcp_url.domain +
											this.props.rcp_url.base_wp_url +
											'event_listing/' +
											this.props.item.id,
										this.props.item.id
									);
									this.setState({ delLoading: false });
								}}
								className='text-red'
							>
								{this.state.delLoading ? (
									<CircularProgress
										color='error'
										size='1.3rem'
									/>
								) : (
									'Delete'
								)}
							</Button>
						</ListItem>
					</List>
				</Col>
			</Row>
		);
	}
}

const mappropsToProps = props => {
	return {
		rcp_url: props.rcp_url,
		user: props.user,
	};
};

const mapDispatchToProps = { setUserLoginDetails };

export default connect(mappropsToProps, mapDispatchToProps)(EventLoopSingle);
