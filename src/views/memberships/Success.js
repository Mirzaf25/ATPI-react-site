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
											Successful!
										</h3>
									</Row>
								</CardHeader>
								<CardBody>
									<p>
										Registration successful for
										<span>
											{this.props.location.state?.name}
										</span>
										.
									</p>
									<h3>Membership Details:</h3>
									<ul>
										{Object.keys(
											this.props.location.state
												.membership_details
										).map((el, i) => (
											<li key={i}>
												{el
													.split('_')
													.map(el => el.toUpperCase())
													.join(' ')}
												:
												{
													this.props.location.state
														.membership_details[el]
												}
											</li>
										))}
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
