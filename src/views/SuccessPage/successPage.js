import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Container,
	Row,
	Table,
} from 'reactstrap';

class SuccessPage extends React.Component {
	render() {
		return (
			<>
				<OnlyHeader />

				{/*
​​currency_symbol: "EUR"
​​duration: 1
​​duration_unit: "year"
​​fee: 0
​​id: 12
​​level: 0
​maximum_renewals: 0
name: "Club included members"
price: 0
renewal_date: "27/05/2023"
​role: "club_member"​
trial_duration: 0
trial_duration_unit: "day"
*/}

				<Container className='mt--8' fluid>
					<Card>
						<CardHeader>User Added Successfully</CardHeader>

						<CardBody>
							<Table striped bordered>
								<thead>
									<tr>
										<th colSpan={2}>User Info</th>

										{this.props.location.state.info
											.selectedMembership !=
											undefined && (
											<th colSpan={2}>Membership Info</th>
										)}
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>First Name</td>

										<td>
											{
												this.props.location.state.info
													.first_name
											}{' '}
										</td>

										{this.props.location.state.info
											.selectedMembership !=
											undefined && (
											<>
												<td>Membership Name </td>
												<td>
													{
														this.props.location
															.state.info
															.selectedMembership
															.name
													}{' '}
												</td>
											</>
										)}
									</tr>

									<tr>
										<td>Last Name</td>
										<td>
											{
												this.props.location.state.info
													.last_name
											}{' '}
										</td>

										{this.props.location.state.info
											.selectedMembership !=
											undefined && (
											<>
												<td>Duration </td>

												<td>
													{
														this.props.location
															.state.info
															.selectedMembership
															.duration
													}{' '}
													{
														this.props.location
															.state.info
															.selectedMembership
															.duration_unit
													}
												</td>
											</>
										)}
									</tr>

									<tr>
										<td>User Email</td>
										<td>
											{
												this.props.location.state.info
													.email
											}
										</td>

										{this.props.location.state.info
											.selectedMembership !=
											undefined && (
											<>
												<td>Trial Duration</td>
												<td>
													{
														this.props.location
															.state.info
															.selectedMembership
															.trial_duration
													}{' '}
													{
														this.props.location
															.state.info
															.selectedMembership
															.trial_duration_unit
													}
												</td>
											</>
										)}
									</tr>

									<tr>
										<td>Membership Level </td>

										<td>
											{
												this.props.location.state.info
													.membership_level
											}{' '}
										</td>

										{this.props.location.state.info
											.selectedMembership !=
											undefined && (
											<>
												<td>Maximum Renewals </td>
												<td>
													{
														this.props.location
															.state.info
															.selectedMembership
															.maximum_renewals
													}{' '}
												</td>
											</>
										)}
									</tr>

									<tr>
										<td>Workplace </td>

										<td>
											{
												this.props.location.state.info
													.workplace
											}{' '}
										</td>

										{this.props.location.state.info
											.selectedMembership !=
											undefined && (
											<>
												<td>Fee </td>
												<td>
													{
														this.props.location
															.state.info
															.selectedMembership
															.fee
													}{' '}
													{
														this.props.location
															.state.info
															.selectedMembership
															.currency_symbol
													}
												</td>
											</>
										)}
									</tr>

									<tr>
										<td>Address </td>

										<td>
											{
												this.props.location.state.info
													.address
											}{' '}
										</td>

										{this.props.location.state.info
											.selectedMembership !=
											undefined && (
											<>
												<td>Price </td>
												<td>
													{
														this.props.location
															.state.info
															.selectedMembership
															.price
													}{' '}
													{
														this.props.location
															.state.info
															.currency_symbol
													}
												</td>
											</>
										)}
									</tr>

									<tr>
										<td>Address Secondary </td>

										<td>
											{
												this.props.location.state.info
													.address_secondary
											}{' '}
										</td>

										{this.props.location.state.info
											.selectedMembership !=
											undefined && (
											<>
												<td>Renewal Date </td>
												<td>
													{
														this.props.location
															.state.info
															.selectedMembership
															.renewal_date
													}{' '}
												</td>
											</>
										)}
									</tr>

									<tr>
										<td>Country </td>

										<td>
											{
												this.props.location.state.info
													.country
											}{' '}
										</td>
									</tr>

									<tr>
										<td>Region </td>

										<td>
											{
												this.props.location.state.info
													.region
											}{' '}
										</td>
									</tr>

									{this.props.location.state.info.club_name !=
										undefined && (
										<tr>
											<td>Club Name </td>
											<td>
												{
													this.props.location.state
														.info.club_name
												}{' '}
											</td>
										</tr>
									)}
								</tbody>
							</Table>
						</CardBody>
					</Card>
				</Container>
			</>
		);
	}
}

export default SuccessPage;
