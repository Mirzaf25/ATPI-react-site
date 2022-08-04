import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

import { Switch, withStyles, CircularProgress } from '@material-ui/core';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Redirect } from 'react-router-dom';
import Success from './Success';

// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	Label,
	Col,
	Input,
	InputGroup,
	Container,
	Row,
	CardBody,
	Form,
	FormFeedback,
	FormGroup,
	Progress,
} from 'reactstrap';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
import { setMembershipLevels } from 'features/levels/levelsSlice';
//Stripe
import { CardElement, ElementsConsumer } from '@stripe/react-stripe-js';

//Country Selector
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import Cart from './Cart';
import ManualPaymentDropdown from './ManualPaymentDropdown';
class AddIndividualMembership extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '', // @todo add password validation.
			validate: {
				emailState: '',
			},
			country: '',
			region: '',
			error_message: [],
			progress: 0,
			totalProgress: 5,
			discountDetails: {},
			formLoading: false,
		};
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		if (
			null !== this.props.user.token &&
			this.props.levels?.levels?.length === 0
		) {
			this.fetchMembershipLevels(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'levels'
			);
		}
	}

	componentDidUpdate(
		{ user: prevUser },
		{ membership_level: prevMembershipLevel }
	) {
		if (
			null !== this.props.user.token &&
			prevUser.token !== this.props.user.token &&
			this.props.levels?.levels?.length === 0
		) {
			this.fetchMembershipLevels(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'levels'
			);
		}

		if (
			undefined !== this.state.membership_level &&
			prevMembershipLevel !== this.state.membership_level
		) {
			const membership = this.props.levels.levels.find(
				el => el.id === parseInt(this.state.membership_level)
			);
			this.setState({ selectedMembership: membership });
		}
	}

	async fetchMembershipLevels(url) {
		const response = await fetch(url, {
			method: 'get',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this.props.user.token,
			},
		});
		const data = await response.json();
		this.props.setMembershipLevels(data); // state only accepts objects.
	}

	handleChange = event => {
		const { target } = event;
		const value =
			target.type === 'checkbox' ? target.checked : target.value;
		const { name } = target;

		if (name === 'country') {
			let country;
			switch (value) {
				case 'IE':
					country = 'Ireland';
					break;
				case 'GB':
					country = 'UK';
					break;
				case 'US':
					country = 'US';
					break;
				default:
					break;
			}
			this.setState({
				[name]: country,
			});
			return;
		}
		this.setState({
			[name]: value,
		});
	};

	validateEmail(e) {
		const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		const { validate } = this.state;

		if (emailRegex.test(e.target.value)) {
			validate.emailState = 'has-success';
		} else {
			validate.emailState = 'has-danger';
		}

		this.setState({ validate });
	}

	selectCountry(val) {
		this.setState({ country: val });
	}

	selectRegion(val) {
		this.setState({ region: val });
	}

	updateProgress(val) {
		this.setState({ progress: this.state.progress + val });
	}

	resetProgress() {
		this.setState({ progress: 0 });
	}

	validateDiscount() {
		if (!this.state.selectedMembership) return;

		const code = document.getElementById('discount_code').value;
		//@todo check res.ok on all fetch calls.
		fetch(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_url +
				'discounts/validate',
			{
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + this.props.user.token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					code: code,
					object_id: this.state.selectedMembership.id,
					user_id: this.props.user.id,
				}),
			}
		)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				this.setState({ discountDetails: data });
			})
			.catch(e => console.error(e));
	}

	/**
	 * Handling Stripe Payment
	 *
	 * @param {*} event
	 * @param {integer} membership_id
	 * @param {integer} user_id
	 * @param {strin} subscription_key
	 * @returns object
	 */
	async handlePayment(event, membership_id, user_id, subscription_key) {
		const { stripe, elements } = this.props.stripe;
		if (!stripe || !elements) {
			// Stripe.js has not yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}
		const cardElement = elements.getElement('card');
		try {
			/* UPDATE PROGRESS */
			console.log('1');
			this.updateProgress(1);

			const membership = this.props.levels.levels.find(
				el => el.id === parseInt(event.target.membership_level.value)
			);
			/* UPDATE PROGRESS */
			console.log('2');
			this.updateProgress(1);
			const formData = new FormData();
			formData.append(
				'code',
				this.state.discountDetails.code
					? this.state.discountDetails.code
					: event.target.discount_code.value
			);
			formData.append('object_id', membership.id);
			formData.append('membership_id', membership_id);
			formData.append('user_id', user_id);
			formData.append('subscription_key', subscription_key);

			//@todo remove payment if discount is 100%.

			const res = await fetch(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'payments/payment_intent',
				{
					method: 'post',
					headers: {
						Authorization: 'Bearer ' + this.props.user.token,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(Object.fromEntries(formData)),
				}
			);

			/* UPDATE PROGRESS */
			this.updateProgress(1);
			const {
				stripe_client_secret,
				stripe_intent_type,
				payment_id,
			} = await res.json();
			/* UPDATE PROGRESS */
			console.log('4');
			this.updateProgress(1);

			const paymentMethodReq = await stripe.createPaymentMethod({
				type: 'card',
				card: cardElement,
				billing_details: {
					name: `${event.target.first_name.value} ${event.target.last_name.value}`,
					email: event.target.email.value,
					address: {
						line1: event.target.address.value,
						country: this.props.country,
						state: this.props.region,
					},
				},
			});

			if (paymentMethodReq.error) {
				alert(paymentMethodReq.error.message);
				this.resetProgress();
				return;
			}

			const { error, ...transaction } = await stripe.confirmCardPayment(
				stripe_client_secret,
				{
					payment_method: paymentMethodReq.paymentMethod.id,
				}
			);

			if (error) {
				alert(error);
				this.resetProgress();
				return;
			}

			const ret = {
				transaction: transaction.paymentIntent,
				payment_id: payment_id,
			};

			return Promise.resolve(ret);
		} catch (err) {
			this.resetProgress();
			return Promise.reject(err);
		}
	}

	/**
	 * Submit the form.
	 */
	async submitForm(event) {
		event.persist();
		event.preventDefault();
		this.setState({ formLoading: true });
		const formData = new FormData(event.target);
		const user_additional_fields = [
			'workplace',
			'reference_club',
			'address',
			'address_two',
			'town',
			'country',
			'county',
			'eircode',
			'phone',
		];
		const user_args = {
			first_name: event.target.first_name.value,
			last_name: event.target.last_name.value,
			user_email: event.target.email.value,
			user_pass: event.target.password.value,
		};
		formData.forEach((val, key) => {
			if (user_additional_fields.includes(key)) user_args[key] = val;
		});

		if (user_args['country']) {
			user_args['country'] = this.state.country;
		}

		this.onSuccessfullCheckout(
			event,
			user_args,
			this.state.selectedMembership
		);
	}

	async onSuccessfullCheckout(event, user_args, membership) {
		await this.addCustomer(user_args)
			.then(res => {
				if (res.status !== 200) return Promise.reject(res);
				return res.json();
			})
			.then(data => {
				const { errors } = data;
				if (errors) return Promise.reject(errors);
				return this.addMembership(event, data.customer_id, membership);
				// return this.addPaymentAndMembership(data, membership, transaction);
			})
			.then(res => {
				if (res.status !== 200) return Promise.reject(res);
				return res.json();
			})
			.then(async data_membership => {
				const {
					errors,
					user_id,
					membership_id,
					subscription_key,
				} = data_membership;
				if (errors) return Promise.reject(errors);
				if (this.state.enable_stripe_payment) {
					const {
						transaction,
						payment_id,
					} = await this.handlePayment(
						event,
						membership_id,
						user_id,
						subscription_key
					);
					console.log(transaction);
					return this.updatePayment(payment_id, transaction);
					// return this.addPayment(user_id, membership, transaction);
				}
				if (this.state.enable_manual_payment) {
					return this.addManualPayment(
						event,
						user_id,
						membership,
						membership_id
					);
				}
				this.setState({ formLoading: false });
				return Promise.resolve(data_membership);
			})
			.then(res => {
				if (res.status !== 200) return Promise.reject(res);
				this.setState({ formLoading: false });
				return res.json();
			})
			.then(data_payment => {
				const { errors } = data_payment;
				if (errors) return Promise.reject(errors);
				return data_payment;
			})
			.catch(err => {
				console.error(err);
				this.setState({ formLoading: false });
			});

		this.setState({ formLoading: false });
		this.props.history.replace({
			pathname: '/admin/membership/success',
			state: {
				name: user_args.first_name + ' ' + user_args.last_name,
				membership_details: this.state.selectedMembership,
			},
		});
	}

	addCustomer(user_args) {
		return fetch(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_url +
				'customers/new',
			{
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + this.props.user.token,
				},
				body: JSON.stringify({ user_args: user_args }),
			}
		);
	}

	updatePayment(payment_id, transaction) {
		const args = {
			transaction_id: transaction.id,
			status: transaction.status === 'succeeded' ? 'complete' : 'failed',
		};

		return fetch(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_url +
				'payments/update/' +
				payment_id,
			{
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + this.props.user.token,
				},
				body: JSON.stringify(args),
			}
		);
	}

	addManualPayment(event, user_id, membership, membership_id) {
		const formData = new FormData(event.target);
		const fields = [
			'transaction_id',
			'gateway',
			'date',
			'transaction_id',
			'gateway_manual',
		];
		const payment_args = {
			subscription: membership.name,
			object_id: membership.id,
			user_id: user_id,
			amount: this.state.discountDetails?.total
				? this.state.discountDetails?.total
				: membership.price,
			membership_id: membership_id,
			status: 'complete',
		};
		formData.forEach((val, key) => {
			if (fields.includes(key)) {
				payment_args[key] = val;
			}
		});
		if (
			new Date(payment_args['date']).setHours(0, 0, 0, 0) >
			new Date().setHours(0, 0, 0, 0)
		)
			payment_args['status'] = 'pending';
		return fetch(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_url +
				'payments/new',
			{
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + this.props.user.token,
				},
				body: JSON.stringify(payment_args),
			}
		);
	}

	addMembership(event, customer_id, membership) {
		return fetch(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_url +
				'memberships/new',
			{
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + this.props.user.token,
				},
				body: JSON.stringify({
					customer_id: customer_id,
					object_id: membership.id,
					auto_renew: event.target.auto_renew.checked,
					paid_by: event.target.paid_by.value,
					region: event.target.region.value,
				}),
			}
		);
	}

	render() {
		const { email, country, region } = this.state;

		const cardElementOptions = {
			style: { base: {}, invalid: {} },
			hidePostalCode: true,
		}; // @todo for styling card element.
		return (
			<>
				<OnlyHeader />

				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<h3 className='mb-0'>
										Add Individual Membership
									</h3>
								</CardHeader>
								<CardBody>
									{/* PROGRESS BAR */}
									{this.state.progress > 0 && (
										<Progress
											value={
												(this.state.progress /
													this.state.totalProgress) *
												100
											}
										/>
									)}

									<Form onSubmit={this.submitForm.bind(this)}>
										<FormGroup row>
											<Label
												for='individual_membership'
												sm={4}
											>
												Individual Membership
											</Label>
											<Col md={6}>
												<Input
													name='membership_level'
													defaultValue='select'
													type='select'
													onChange={e => {
														this.handleChange(e);
													}}
													required
												>
													<option
														value='select'
														disabled
													>
														Select a membership
														level.
													</option>
													{this.props.levels.levels
														.length > 0 &&
														this.props.levels.levels
															.filter(
																el =>
																	el.id !==
																		3 &&
																	el.id !== 4
															)
															.map(
																(item, key) => (
																	<option
																		key={
																			key
																		}
																		value={
																			item.id
																		}
																	>
																		{
																			item.name
																		}
																	</option>
																)
															)}
												</Input>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label sm={4}>First Name</Label>
											<Col md={6}>
												<Input
													id='first_name'
													name='first_name'
													placeholder='First Name'
													type='text'
													onChange={e => {
														this.handleChange(e);
													}}
													required
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label sm={4}>Last Name</Label>
											<Col
												className='mt-sm-2 mt-md-0'
												md={6}
											>
												<Input
													id='last_name'
													name='last_name'
													placeholder='Last Name'
													type='text'
													onChange={e => {
														this.handleChange(e);
													}}
													required
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for='email' sm={4}>
												Email
											</Label>
											<Col md={6}>
												<Input
													id='email'
													name='email'
													placeholder='Email'
													type='email'
													valid={
														this.state.validate
															.emailState ===
														'has-success'
													}
													invalid={
														this.state.validate
															.emailState ===
														'has-danger'
													}
													value={email}
													onChange={e => {
														this.validateEmail(e);
														this.handleChange(e);
													}}
													required
												/>
												<FormFeedback>
													Please use a valid email
													address.
												</FormFeedback>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for='password' sm={4}>
												Password
											</Label>
											<Col md={6}>
												<Input
													id='password'
													name='password'
													placeholder='Password'
													type='password'
													required
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label sm={4} for='workplace'>
												Workplace
											</Label>
											<Col md={6}>
												<Input
													name='workplace'
													type='text'
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label sm={4} for='reference_club'>
												Job Title
											</Label>
											<Col md={6}>
												<Input
													name='reference_club'
													type='text'
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label sm={4} for='address'>
												Address
											</Label>
											<Col md={6}>
												<Input
													required
													name='address'
													type='text'
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label sm={4} for='address_two'>
												Address 2
											</Label>
											<Col md={6}>
												<Input
													required
													name='address_two'
													type='text'
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label sm={4} for='town'>
												Town
											</Label>
											<Col md={6}>
												<Input
													required
													name='town'
													type='text'
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label sm={4} for='country'>
												Country
											</Label>
											<Col md={6}>
												<CountryDropdown
													className='form-control'
													name='country'
													value={country}
													onChange={val =>
														this.selectCountry(val)
													}
													valueType='short'
													whitelist={[
														'IE',
														'US',
														'GB',
													]}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label sm={4} for='county'>
												County
											</Label>
											<Col md={6}>
												<RegionDropdown
													className='form-control'
													name='county' //"country"
													country={country}
													value={region}
													countryValueType='short'
													onChange={val =>
														this.selectRegion(val)
													}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label sm={4} for='eircode'>
												Eircode
											</Label>
											<Col md={6}>
												<Input
													required
													name='eircode'
													type='text'
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label sm={4} for='phone'>
												Phone
											</Label>
											<Col md={6}>
												<PhoneInput
													inputProps={{
														name: 'phone',
													}}
													country='ie'
													enableAreaCodes={['ie']}
													enableSearch
													disableSearchIcon
													inputClass='w-100'
												/>
											</Col>
										</FormGroup>
										{this.props.user.is_admin && (
											<FormGroup row>
												<Label sm={4} for='region'>
													Region
												</Label>
												<Col md={6}>
													<Input
														name='region'
														type='select'
													>
														<option value='NW'>
															NW
														</option>
														<option value='SW'>
															SW
														</option>
														<option value='SE'>
															SE
														</option>
														<option value='NE'>
															NE
														</option>
														<option value='NI'>
															NI
														</option>
														<option value='INT'>
															INT
														</option>
													</Input>
												</Col>
											</FormGroup>
										)}

										{undefined !==
											this.state.selectedMembership && (
											<Cart
												membership={
													this.state
														.selectedMembership
												}
												discount={
													this.state.discountDetails
												}
											/>
										)}
										<FormGroup row>
											<Label sm={4} for='discount_code'>
												ATPI staff code / Discount Code
											</Label>
											<Col md={6}>
												<InputGroup>
													<Input
														name='discount_code'
														type='text'
														id='discount_code'
													/>
													<Button
														onClick={this.validateDiscount.bind(
															this
														)}
													>
														Apply
													</Button>
												</InputGroup>
											</Col>
										</FormGroup>
										<FormGroup
											check
											row
											className='form-group'
										>
											<Input
												type='checkbox'
												name='consent'
												className={
													this.props.classes.checkbox
												}
												onChange={e =>
													this.setState({
														consent:
															e.target.checked,
													})
												}
											/>
											<Col>
												<Label for='consent' check>
													We are aware of the
													importance of your personal
													information. For more
													information, please read
													about how we keep your data
													protected in our Privacy
													Policy
												</Label>
											</Col>
										</FormGroup>
										<FormGroup
											check
											row
											className='form-group'
										>
											<Input
												type='checkbox'
												name='auto_renew'
												className={
													this.props.classes.checkbox
												}
												onChange={e =>
													this.setState({
														auto_renew:
															e.target.checked,
													})
												}
											/>
											<Col>
												<Label for='auto_renew' check>
													Auto Renew
												</Label>
											</Col>
										</FormGroup>
										{this.props.user.is_admin && (
											<FormGroup row>
												<Label sm={4} for='paid_by'>
													Paid by
												</Label>
												<Col md={6}>
													<Input
														name='paid_by'
														type='select'
													>
														<option value='Individual'>
															Individual
														</option>
														<option value='Club'>
															Club
														</option>
														<option value='College'>
															College
														</option>
														<option value='Honorary'>
															Honorary
														</option>
													</Input>
												</Col>
											</FormGroup>
										)}
										<FormGroup
											row
											disabled={
												this.state.enable_manual_payment
											}
										>
											<Label sm={4} for='payment_stripe'>
												Pay with Credit Card(Stripe).
											</Label>
											<Col md={6}>
												<Switch
													name='payment_stripe'
													disabled={
														this.state
															.enable_manual_payment
													}
													onChange={e => {
														this.setState({
															enable_stripe_payment:
																e.target
																	.checked,
														});
													}}
												/>
											</Col>
										</FormGroup>
										{this.state.selectedMembership
											?.price !== 0 &&
											this.state.enable_stripe_payment ===
												true && (
												<FormGroup row>
													<Col md={12}>
														<CardElement
															options={
																cardElementOptions
															}
														/>
													</Col>
												</FormGroup>
											)}
										<FormGroup
											row
											disabled={
												this.state.enable_stripe_payment
											}
										>
											<Label sm={4} for='payment_manual'>
												Manual Payment
											</Label>
											<Col md={6}>
												<Switch
													name='payment_manual'
													disabled={
														this.state
															.enable_stripe_payment
													}
													onChange={e => {
														this.setState({
															enable_manual_payment:
																e.target
																	.checked,
														});
													}}
												/>
											</Col>
										</FormGroup>
										{this.state.selectedMembership
											?.price !== 0 &&
											this.state.enable_manual_payment ===
												true && (
												<FormGroup tag='fieldset'>
													<Input
														name='gateway'
														value='manual'
														type='hidden'
													/>
													<ManualPaymentDropdown />
													<FormGroup row>
														<Label sm={4}>
															Payment date
														</Label>
														<Col
															className='mt-sm-2 mt-md-0'
															md={6}
														>
															<Input
																id='payment_date'
																name='date'
																placeholder='Payment date'
																type='date'
																onChange={e => {
																	this.handleChange(
																		e
																	);
																}}
																required
															/>
														</Col>
													</FormGroup>
													<FormGroup row>
														<Label sm={4}>
															Payment Reference:
														</Label>
														<Col
															className='mt-sm-2 mt-md-0'
															md={6}
														>
															<Input
																id='transaction_id'
																name='transaction_id'
																placeholder='Payment Reference:'
																type='text'
																onChange={e => {
																	this.handleChange(
																		e
																	);
																}}
																required
															/>
														</Col>
													</FormGroup>
												</FormGroup>
											)}
										<FormGroup check row>
											<Col
												sm={{
													size: 10,
												}}
											>
												<Button>
													{this.state.formLoading && (
														<CircularProgress size='1.3rem' />
													)}
													{!this.state.formLoading &&
														'Submit'}
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

const injectedCheckoutForm = props => (
	<ElementsConsumer>
		{(stripe, elements) => (
			<AddIndividualMembership
				{...props}
				stripe={stripe}
				elements={elements}
			/>
		)}
	</ElementsConsumer>
);

const mapStateToProps = state => {
	return {
		rcp_url: state.rcp_url,
		user: state.user,
		levels: state.levels,
	};
};

const mapDispatchToProps = { setUserLoginDetails, setMembershipLevels };

const styles = {
	checkbox: {
		width: '1em',
		height: '1em',
		marginTop: '0.25em',
		verticalAlign: 'top',
		backgroundColor: '#fff',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		backgroundSize: 'contain',
		border: '1px solid rgba(0,0,0,.25)',
		'-webkit-print-color-adjust': 'exact',
		colorAdjust: 'exact',
	},
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(injectedCheckoutForm));
