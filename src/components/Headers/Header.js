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
import { connect } from 'react-redux';

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from 'reactstrap';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			count: null,
		};
	}

	componentDidMount() {
		if (this.state.count === null) {
			this.fetchCountMemberships();
		}
	}
	componentDidUpdate(props, { count: prevCount }) {
		console.log(this);
		if (this.state.count === null) {
			this.fetchCountMemberships();
		}
	}

	fetchCountMemberships = async () => {
		const res = await fetch(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_url +
				'memberships/count'
		);

		if (!res.ok) return;

		const data = await res.json();

		this.setState({ count: data });
	};
	render() {
		return (
			<>
				<div className='header bg-infog pb-8 pt-5 pt-md-8'>
					<Container fluid>
						<div className='header-body'>
							{/* Card stats */}
							<Row>
								<Col lg='6' xl='3'>
									<Card className='card-stats mb-4 mb-xl-0'>
										<CardBody>
											<Row>
												<div className='col pr-0'>
													<CardTitle
														tag='h5'
														className='text-uppercase text-muted mb-0'
													>
														Numbers of Memberships
													</CardTitle>
													<span className='h2 font-weight-bold mb-0'>
														{this.state?.count
															?.total || 0}
													</span>
												</div>
												<Col className='col-auto'>
													<div className='icon icon-shape bg-danger text-white rounded-circle shadow'>
														<i className='fas fa-chart-bar' />
													</div>
												</Col>
											</Row>
										</CardBody>
									</Card>
								</Col>
								<Col lg='6' xl='3'>
									<Card className='card-stats mb-4 mb-xl-0'>
										<CardBody>
											<Row>
												<div className='col pr-0'>
													<CardTitle
														tag='h5'
														className='text-uppercase text-muted mb-0'
													>
														Number of Active
														Membership
													</CardTitle>
													<span className='h2 font-weight-bold mb-0'>
														{this.state?.count
															?.active || 0}
													</span>
												</div>
												<Col className='col-auto'>
													<div className='icon icon-shape bg-warning text-white rounded-circle shadow'>
														<i className='fas fa-chart-pie' />
													</div>
												</Col>
											</Row>
										</CardBody>
									</Card>
								</Col>
								<Col lg='6' xl='3'>
									<Card className='card-stats mb-4 mb-xl-0'>
										<CardBody>
											<Row>
												<div className='col pr-0'>
													<CardTitle
														tag='h5'
														className='text-uppercase text-muted mb-0'
													>
														Number of Expired
														Memberships
													</CardTitle>
													<span className='h2 font-weight-bold mb-0'>
														{this.state?.count
															?.expired || 0}
													</span>
												</div>
												<Col className='col-auto'>
													<div className='icon icon-shape bg-yellow text-white rounded-circle shadow'>
														<i className='fas fa-users' />
													</div>
												</Col>
											</Row>
										</CardBody>
									</Card>
								</Col>
								{/* <Col lg='6' xl='3'>
									<Card className='card-stats mb-4 mb-xl-0'>
										<CardBody>
											<Row>
												<div className='col pr-0'>
													<CardTitle
														tag='h5'
														className='text-uppercase text-muted mb-0'
													>
														Number of lapsed
														memberships
													</CardTitle>
													<span className='h2 font-weight-bold mb-0'>
														49,65%
													</span>
												</div>
												<Col className='col-auto'>
													<div className='icon icon-shape bg-info text-white rounded-circle shadow'>
														<i className='fas fa-percent' />
													</div>
												</Col>
											</Row>
											<p className='mt-3 mb-0 text-muted text-sm'>
												<span className='text-success mr-2'>
													<i className='fas fa-arrow-up' />{' '}
													12%
												</span>{' '}
												<span className='text-nowrap'>
													Since last month
												</span>
											</p>
										</CardBody>
									</Card>
								</Col> */}
							</Row>
						</div>
					</Container>
				</div>
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

export default connect(mapStateToProps)(Header);
