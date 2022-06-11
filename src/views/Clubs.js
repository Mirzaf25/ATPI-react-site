import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';
import { DataGrid } from '@material-ui/data-grid';

// reactstrap components
import { Card, CardHeader, Container, Row } from 'reactstrap';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';

class Clubs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			clubs: [],
			page: 1,
			number: 5,
			loading: false,
		};
	}

	componentDidMount() {
		if (null !== this.props.user.token && this.state.clubs.length === 0) {
			this.setState({ loading: true });
			this.fetchClubs(
				this.props.rcp_url.proxy_domain +
					this.props.rcp_url.base_url +
					'groups',
				this.props.user.token
			);
		}
	}

	componentDidUpdate({ user: prevUser }, { page: prevPage }) {
		if (
			null !== this.props.user.token &&
			this.props.user !== prevUser &&
			this.state.clubs.length === 0
		) {
			this.setState({ loading: true });
			this.fetchClubs(
				this.props.rcp_url.proxy_domain +
					this.props.rcp_url.base_url +
					'groups',
				this.props.user.token
			);
		}

		if (null !== this.props.user.token && this.state.page !== prevPage) {
			this.setState({ loading: true });
			this.fetchClubs(
				this.props.rcp_url.proxy_domain +
					this.props.rcp_url.base_url +
					'groups',
				this.props.user.token
			);
		}
	}

	fetchClubs = async (url, token) => {
		const urlQuery = new URL(url);
		const paramsOptions = {
			number: this.state.number,
			offset: (this.state.page - 1) * this.state.number,
			orderby: 'created_date',
			order: 'DESC',
		};
		for (let key in paramsOptions) {
			urlQuery.searchParams.set(key, paramsOptions[key]);
		}

		const res = await fetch(urlQuery, {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		});
		const data = await res.json();
		this.setState({ clubs: data, loading: false });
	};

	handlePageChange = params => {
		this.setState({ page: params + 1 });
	};

	render() {
		const columns = [
			{ field: 'id', headerName: 'ID', width: 90 },
			{ field: 'name', headerName: 'Club Name', width: 180 },
			{ field: 'membership_id', headerName: 'Membership ID', width: 180 },
			{
				field: 'membership_name',
				headerName: 'Membership Name',
				width: 180,
			},
			{ field: 'owner_name', headerName: 'Owner', width: 180 },
			{ field: 'members', headerName: 'Members', width: 180 },
			{ field: 'member_count', headerName: 'Member Count', width: 180 },
			{ field: 'seats', headerName: 'Seats', width: 180 },
			{ field: 'created_date', headerName: 'Created At', width: 180 },
		];

		const rows = this.state.clubs?.map((item, key) => {
			const date = new Date(item.created_date);
			return {
				id: item.id,
				name: item.name,
				membership_id: item.membership_id,
				membership_name: item.membership_name,
				owner_name: `${item?.owner.first_name} ${item?.owner.last_name}`,
				members:
					item?.members?.length !== 0 &&
					item?.members
						.map(el => `${el.first_name} ${el.last_name}`)
						.join(', '),
				member_count: item.member_count,
				seats: item.seats,
				created_date:
					date.getDay() +
					'-' +
					date.getMonth() +
					'-' +
					date.getFullYear(),
			};
		});

		return (
			<>
				<OnlyHeader />
				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<h3 className='mb-0'>Clubs</h3>
								</CardHeader>
								<DataGrid
									loading={this.state.loading}
									autoHeight
									rows={rows}
									columns={columns}
									onPageChange={this.handlePageChange.bind(
										this
									)}
									pageSize={
										this.state.clubs.length > 20
											? 20
											: this.state.clubs.length
									}
									page={this.state.page - 1}
									rowCount={1000}
									pagination
									paginationMode='server'
								/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Clubs);
