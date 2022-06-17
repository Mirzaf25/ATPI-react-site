import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

// reactstrap components
import { Col, Table } from 'reactstrap';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';

class ClubDetails extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.club === null) return null;

		return (
			<Table bordered striped className='mb-2'>
				<thead>
					<tr>
						<th className='border-right-0'>
							<h2>Club Details</h2>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className='font-weight-bold'>Club Name</td>
						<td>{this.props.club?.name}</td>
					</tr>
					<tr>
						<td className='font-weight-bold'>Club Description</td>
						<td>{this.props.club?.description}</td>
					</tr>
					<tr>
						<td className='font-weight-bold'>Member Count</td>
						<td>{this.props.club?.member_count}</td>
					</tr>
					<tr>
						<td className='font-weight-bold'>Seats</td>
						<td>{this.props.club?.seats}</td>
					</tr>
					{'membership' in this.props && (
						<>
							<tr>
								<td className='font-weight-bold'>
									Club Membership Status
								</td>
								<td>{this.props?.membership?.status}</td>
							</tr>
							<tr>
								<td className='font-weight-bold'>
									Club Membership Renewal Date
								</td>
								<td>{this.props?.membership?.expired_date}</td>
							</tr>
						</>
					)}
					<tr>
						<td className='font-weight-bold'>Role</td>
						<td className='text-capitalize'>
							{this.props.roles
								.map(el => el.split('_').join(' '))
								.join(', ')}
						</td>
					</tr>
					<tr>
						<td className='font-weight-bold'>Club Owner</td>
						<td>
							<ul className='ni-ul ml-0'>
								{Object.keys(this.props.club?.owner).map(
									(key, index) => (
										<li key={index}>
											<span className='mb-0 text-sm font-weight-600 text-capitalize'>
												{key.split('_').join(' ')}
											</span>
											<span
												dangerouslySetInnerHTML={{
													__html:
														'&colon;&nbsp;&nbsp;' +
														this.props.club?.owner[
															key
														],
												}}
											/>
										</li>
									)
								)}
							</ul>
						</td>
					</tr>
					<tr>
						<td className='font-weight-bold'>Club Members</td>
						<td>
							<ul className='ni-ul ml-0'>
								{this.props.club?.members
									.filter(el => el.role !== 'owner')
									.map((el, index) => (
										<div key={index} className='mb-2'>
											{Object.keys(el).map(
												(key, index) => (
													<li key={index}>
														<span className='mb-0 text-sm font-weight-600 text-capitalize'>
															{key
																.split('_')
																.join(' ')}
														</span>
														<span
															dangerouslySetInnerHTML={{
																__html:
																	'&colon;&nbsp;&nbsp;' +
																	el[key],
															}}
														/>
													</li>
												)
											)}
										</div>
									))}
							</ul>
						</td>
					</tr>
				</tbody>
			</Table>
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

export default connect(mappropsToProps, mapDispatchToProps)(ClubDetails);
