import * as React from 'react';
import OnlyHeader from 'components/Headers/OnlyHeader';
// reactstrap components
import { Button, Card, CardHeader, Container, Row, CardBody } from 'reactstrap';
import { Redirect } from 'react-router-dom';

class Success extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (
			this.props.location.state?.name === undefined ||
			this.props.location.state?.membership_details === undefined
		)
			return <Redirect to='/admin/index' />;
		return (
			<>
				<OnlyHeader />
				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<Row className='justify-content-between'>
										<h3 className='mb-0 ml-3'>
											Success!
										</h3>
									</Row>
								</CardHeader>
								<CardBody>
									<p>
										<span className='font-weight-bold'>
											{this.props.location.state?.name + " "}
										</span>
										is now registered as an ATPI Member.
										.
									</p>
									<h3>Membership Details:</h3>
									<ul>
										<li>Member's Name: <span className='text-capitalize font-weight-bold'>{this.props.location.state?.name}</span></li>
										<li>Email: <span className='text-capitalize font-weight-bold'>{this.props.location.state
												.data.customer.email}</span></li>
										<li>Membership: <span className='text-capitalize font-weight-bold'>{this.props.location.state
												.membership_details.name}</span></li>
										<li>Renewal Date: <span className='text-capitalize font-weight-bold'>{this.props.location.state
												.membership_details.renewal_date}</span></li>
										{this.props.location.state.data.hasOwnProperty('discount') ? (<>
											<li>Coupon Used: <span className='text-capitalize font-weight-bold'>{this.props.location.state
												.data.discount.code}</span></li>
											<li>Discount: <span className='text-capitalize font-weight-bold'>{this.props.location.state
													.data.discount.total_discount+ " " + this.props.location.state
													.membership_details.currency_symbol}</span></li>
											<li>Paid: <span className='text-capitalize font-weight-bold'>{this.props.location.state
														.data.discount.total+ " " + this.props.location.state
														.membership_details.currency_symbol}</span></li>
											</>) : 
											(<li>Paid: <span className='text-capitalize font-weight-bold'>{this.props.location.state
															.membership_details.price + " " + this.props.location.state
															.membership_details.currency_symbol }</span></li>
											)}
										<li>Cost: <span className='text-capitalize font-weight-bold'>{this.props.location.state
												.membership_details.price + " " + this.props.location.state
												.membership_details.currency_symbol }</span></li>
										<li>Role: <span className='text-capitalize font-weight-bold'>{this.props.location.state
												.membership_details.role.split("_").join(" ")}</span></li>
									</ul>
								</CardBody>
							</Card>
						</div>
					</Row>
				</Container>
			</>
		);
	}
}

export default Success;
