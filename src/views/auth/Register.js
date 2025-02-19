/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';

// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	FormGroup,
	Form,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Row,
	Col,
} from 'reactstrap';

class Register extends React.Component {
	render() {
		return (
			<>
				<Col lg='6' md='8'>
					<Card className='bg-secondary shadow border-0'>
						<CardBody className='px-lg-5 py-lg-5'>
							<div className='text-center text-muted mb-4'>
								<small className='font-weight-bold'>
									Sign up
								</small>
							</div>
							<Form role='form'>
								<FormGroup>
									<InputGroup className='input-group-alternative mb-3'>
										<InputGroupAddon addonType='prepend'>
											<InputGroupText>
												<i className='ni ni-hat-3' />
											</InputGroupText>
										</InputGroupAddon>
										<Input placeholder='Name' type='text' />
									</InputGroup>
								</FormGroup>
								<FormGroup>
									<InputGroup className='input-group-alternative mb-3'>
										<InputGroupAddon addonType='prepend'>
											<InputGroupText>
												<i className='ni ni-email-83' />
											</InputGroupText>
										</InputGroupAddon>
										<Input
											placeholder='Email'
											type='email'
											autoComplete='new-email'
										/>
									</InputGroup>
								</FormGroup>
								<FormGroup>
									<InputGroup className='input-group-alternative'>
										<InputGroupAddon addonType='prepend'>
											<InputGroupText>
												<i className='ni ni-lock-circle-open' />
											</InputGroupText>
										</InputGroupAddon>
										<Input
											placeholder='Password'
											type='password'
											autoComplete='new-password'
										/>
									</InputGroup>
								</FormGroup>
								<Row className='my-4'>
									<Col xs='12'>
										<div className='custom-control custom-control-alternative custom-checkbox'>
											<input
												className='custom-control-input'
												id='customCheckRegister'
												type='checkbox'
											/>
											<label
												className='custom-control-label'
												htmlFor='customCheckRegister'
											>
												<span className='text-muted'>
													I agree with the{' '}
													<a
														href='#pablo'
														onClick={e =>
															e.preventDefault()
														}
													>
														Privacy Policy
													</a>
												</span>
											</label>
										</div>
									</Col>
								</Row>
								<div className='text-center'>
									<Button
										className='mt-4'
										color='primary'
										type='button'
									>
										Create account
									</Button>
								</div>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</>
		);
	}
}

export default Register;
