import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';

class SuccessPage extends React.Component {
	render() {
		return (
			<>
				<OnlyHeader />

				<Container className='mt--8' fluid>
					<Card>
						<CardHeader>User Added Successfully</CardHeader>

						<CardBody>
							<Col>
								<Row>
									<h3>First Name : </h3>

									<p>
										{
											this.props.location.state.info
												.first_name
										}{' '}
									</p>
								</Row>
								<Row>
									<h3>Last Name : </h3>

									<p>
										{
											this.props.location.state.info
												.last_name
										}{' '}
									</p>
								</Row>
								<Row>
									<h3>User Email : </h3>

									<p>
										{this.props.location.state.info.email}{' '}
									</p>
								</Row>
								<Row>
									<h3>Membership Level : </h3>

									<p>
										{
											this.props.location.state.info
												.membership_level
										}{' '}
									</p>
								</Row>

								{this.props.location.state.info.club_name !=
									undefined && (
									<Row>
										<h3>Club Name : </h3>
										<p>
											{
												this.props.location.state.info
													.club_name
											}{' '}
										</p>
									</Row>
								)}

								<Row>
									<h3>Workplace : </h3>

									<p>
										{
											this.props.location.state.info
												.workplace
										}{' '}
									</p>
								</Row>

								<Row>
									<h3>Address : </h3>

									<p>
										{this.props.location.state.info.address}{' '}
									</p>
								</Row>

								<Row>
									<h3>Address Secondary : </h3>

									<p>
										{
											this.props.location.state.info
												.address_secondary
										}{' '}
									</p>
								</Row>

								<Row>
									<h3>Country : </h3>

									<p>
										{this.props.location.state.info.country}{' '}
									</p>
								</Row>

								<Row>
									<h3>Region : </h3>

									<p>
										{this.props.location.state.info.region}{' '}
									</p>
								</Row>
							</Col>
						</CardBody>
					</Card>
				</Container>
			</>
		);
	}
}

export default SuccessPage;
