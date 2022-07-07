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
} from '@material-ui/core';

import MatEdit from 'views/MatEdit';
import UpdateCustomer from './UpdateCustomer';
import MembershipDetails from './MembershipDetails';
import PaymentDetails from './PaymentDetails';
import WebsiteAccess from './WebsiteAccess';
import ClubDetails from './ClubDetails';

class EditCustomer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			customer: null,
			roles: [],
			validate: {
				email: true,
			},
			form: {
				user_args: {
					first_name: '',
					last_name: '',
					user_email: '',
				},
				email_verification: '',
				address_one: '',
				address_two: '',
				county: '',
				country: '',
				workplace: '',
				reference_club: '',
				town: '',
				eircode: '',
				phone: '',
			},
			profileImageChanged: false,
		};

		this.current_customer_url =
			this.props.rcp_url.proxy_domain +
			this.props.rcp_url.base_url +
			'customers/' +
			this.props.match.params.id;

		this.update_customer_url =
			this.props.rcp_url.proxy_domain +
			this.props.rcp_url.base_url +
			'customers/update/' +
			this.props.match.params.id;
	}

	componentDidMount() {
		if (this.state.customer === null && this.props.user.token !== null)
			this.fetchCustomer(this.current_customer_url);
	}

	componentDidUpdate({ user: prevUser }, { customer: prevCustomer }) {
		if (prevUser !== this.props.user && this.props.user.token !== null) {
			this.fetchCustomer(this.current_customer_url);
		}

		if (
			prevCustomer !== this.state.customer &&
			this.state.customer?.memberships_data.length !== 0 &&
			'club' in this.state.customer?.memberships_data[0] &&
			this.props.user.token !== null
		) {
			this.fetchClub(
				this.props.rcp_url.proxy_domain +
					this.props.rcp_url.base_url +
					`groups/${this.state.customer.memberships_data[0].club}`,
				this.props.user.token
			);
		}
	}

	fetchCustomer = async url => {
		const queryUrl = new URL(url);
		const params = {
			acf_format: 'standard',
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
			customer: data,
			form: {
				...prevState.form,
				user_args: {
					first_name: data?.first_name,
					last_name: data?.last_name,
					user_email: data?.email,
				},
				email_verification: data?.email_verification,
				address_one: data?.address_one,
				address_two: data?.address_two,
				county: data?.county,
				country: data?.country,
				workplace: data?.workplace,
				reference_club: data?.reference_club,
				town: data?.town,
				eircode: data?.eircode,
				phone: data?.phone,
			},
		}));
	};

	fetchClub = async url => {
		const res = await fetch(url, {
			headers: {
				Authorization: 'Bearer ' + this.props.user.token,
			},
		});

		if (!res.ok) return;

		const { errors, ...data } = await res.json();

		if (!errors) {
			this.setState({ club: data });
		}
	};

	handleChange = event => {
		const { target } = event;
		const value =
			target.type === 'checkbox' ? target.checked : target.value;
		const { name, dataset = null } = target;

		if (dataset !== null && dataset.field === 'user_args') {
			this.setState(prevState => ({
				...prevState,
				form: {
					...prevState.form,
					user_args: {
						...prevState.form.user_args,
						[name]: value,
					},
				},
			}));
		}

		this.setState(prevState => ({
			...prevState,
			form: {
				...prevState.form,
				[name]: value,
			},
		}));
	};

	validateEmail(e) {
		const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

		const { validate } = this.state;

		if (emailRegex.test(e.target.value)) {
			validate.email = true;
		} else {
			validate.email = false;
		}

		this.setState({ validate });
	}

	updateCustomer = async e => {
		e.preventDefault();
		const formData = new FormData(e.target);

		fetch(this.update_customer_url, {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + this.props.user.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...Object.fromEntries(formData),
				user_args: {
					first_name: formData.get('first_name'),
					last_name: formData.get('last_name'),
					user_email: formData.get('user_email'),
				},
			}),
		})
			.then(res => res.ok && res.json())
			.then(data =>
				this.setState(prevState => ({
					customer: data,
					form: {
						...prevState.form,
						user_args: {
							ID: data?.user_id,
							first_name: data?.first_name,
							last_name: data?.last_name,
							user_email: data?.email,
						},
						email_verification: data?.email_verification,
						address_one: data?.address_one,
						address_two: data?.address_two,
						county: data?.county,
						country: data?.country,
						workplace: data?.workplace,
						reference_club: data?.reference_club,
						town: data?.town,
						eircode: data?.eircode,
						phone: data?.phone,
					},
				}))
			)
			.catch(err => console.error(err));
	};

	updateStateUserRole = roles => {
		const customer = { ...this.state.customer, roles: roles };
		this.setState({ customer: customer });
	};

	render() {
		if (!this.state.customer && this.props.user.token)
			this.fetchCustomer(this.current_customer_url);
		return (
			<>
				<OnlyHeader />
				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<h3 className='mb-0'>Member</h3>
								</CardHeader>
								<CardBody>
									<UpdateCustomer
										updateCustomer={this.updateCustomer}
										form={this.state.form}
										handleChange={this.handleChange}
										customer={this.state.customer}
									/>
									<MembershipDetails
										className='mb-4'
										membership={
											this.state.customer &&
											this.state.customer.memberships_data
												.length !== 0
												? this.state.customer
														?.memberships_data[0]
												: null
										}
									/>
									{this.state.customer && this.state.club && (
										<ClubDetails
											club={this.state.club}
											roles={this.state.customer?.roles}
											membership={
												this.state.customer &&
												this.state.customer
													.memberships_data.length !==
													0
													? this.state.customer
															?.memberships_data[0]
													: null
											}
										/>
									)}
									{this.state.customer &&
										this.state.customer.payments.length !==
											0 && (
											<>
												<h2 className='mb-4'>
													Payments:
												</h2>
												{this.state.customer?.payments.map(
													(payment, key) => (
														<PaymentDetails
															key={key}
															payment={payment}
															className='mb-4'
														/>
													)
												)}
											</>
										)}
									{this.state.customer &&
										this.state.customer.user_id &&
										this.state.customer.roles && (
											<WebsiteAccess
												user_id={
													this.state.customer.user_id
												}
												user_roles={
													this.state.customer.roles
												}
												updateStateUserRole={
													this.updateStateUserRole
												}
											/>
										)}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditCustomer);
