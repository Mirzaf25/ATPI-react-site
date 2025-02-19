import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';
import {
	DataGrid,
	GridToolbar,
	GridToolbarContainer,
} from '@material-ui/data-grid';

// reactstrap components
import {
	Card,
	CardHeader,
	Container,
	Row,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Label,
	Col,
	Input,
	Form,
	FormGroup,
} from 'reactstrap';

import { TextField, InputAdornment, IconButton } from '@material-ui/core';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
import MatEdit from '../MatEdit';
class Customers extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			memberships: [],
			customers: [],
			page: 1,
			search: '',
			customersLoading: false,
			searched: false,
			number: 20,
			toggle: false,
		};
	}
	componentDidMount() {
		if (
			null !== this.props.user.token &&
			this.state.customers.length === 0
		) {
			this.fetchCustomers(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'customers',
				this.props.user.token
			);
		}
	}

	componentDidUpdate(props, { page: prevPage, customers: prevCustomers }) {
		if (
			null !== this.props.user.token &&
			this.state.customers.length === 0 &&
			!this.state.searched
		) {
			this.fetchCustomers(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'customers',
				this.props.user.token
			);
		}

		if (null !== this.props.user.token && prevPage !== this.state.page) {
			this.fetchCustomers(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'customers',
				this.props.user.token,
				this.state.page
			);
		}
	}

	CustomToolbar = () => (
		<GridToolbarContainer className='justify-content-between'>
			<GridToolbar />
			<TextField
				id='search_membership'
				InputProps={{
					endAdornment: (
						<InputAdornment
							style={{ color: '#3f51b5' }}
							position='start'
						>
							<IconButton
								size='small'
								onClick={() => {
									this.setState({
										customersLoading: true,
										searched: true,
									});
									this.fetchCustomers(
										this.props.rcp_url.domain +
											this.props.rcp_url.base_url +
											'customers',
										this.props.user.token,
										this.state.page,
										this.state.search
									);
								}}
							>
								<i className='fa fa-search' />
							</IconButton>
							{this.state.searched && (
								<IconButton
									size='small'
									onClick={() => {
										this.setState({
											searched: false,
											search: '',
										});

										this.fetchCustomers(
											this.props.rcp_url.domain +
												this.props.rcp_url.base_url +
												'customers',
											this.props.user.token,
											this.state.page,
											''
										);
									}}
								>
									<i className='fa fa-times' />
								</IconButton>
							)}
						</InputAdornment>
					),
				}}
				variant='standard'
				value={this.state.search}
				onChange={e => this.setState({ search: e.target.value })}
			/>
		</GridToolbarContainer>
	);

	fetchCustomers = async (url, token, page = this.state.page) => {
		const urlQuery = new URL(url);
		const paramsOptions = {
			number: this.state.number,
			offset: (page - 1) * this.state.number,
			order_by: 'created_date',
			order: 'DESC',
		};

		if (this.state.search.length !== 0) {
			paramsOptions.search_user = this.state.search;
		}
		for (let key in paramsOptions) {
			urlQuery.searchParams.set(key, paramsOptions[key]);
		}
		const res = await fetch(urlQuery, {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		});

		if (res.status !== 200) {
			this.setState({ customers: [] });
			return;
		}
		const data = await res.json();

		const { errors } = data;

		if (errors) {
			this.setState({ customers: [], customersLoading: false });
			return;
		}
		this.setState({ customers: data, customersLoading: false });
	};

	toggleModal = () => {
		this.setState({ toggle: !this.state.toggle });
	};

	handlePageChange = params => {
		this.setState({ page: params + 1, customersLoading: true });
	};

	deleteCustomer = async (url, id) => {
		const res = await fetch(url + id, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + this.props.user.token,
			},
		});
		if (res.status !== 200) return this.setState({ error: 'error' });
		const data = await res.json();
		const { errors } = data;
		if (errors) return this.setState({ error: 'error' });
		this.setState({
			customers: this.state.customers.filter(el => el.id !== id),
		});
	};

	render() {
		const columns = [
			{ field: 'id', headerName: 'ID', width: 100, hide: true },
			{
				field: 'membership_number',
				headerName: 'Membership Number',
				width: 180,
				hide: true,
			},
			{ field: 'first_name', headerName: 'First Name', width: 180 },
			{ field: 'last_name', headerName: 'Last Name', width: 180 },
			{ field: 'email', headerName: 'Email', width: 180 },
			{ field: 'workplace', headerName: 'Workplace', width: 180 },
			{ field: 'reference_club', headerName: 'Job Title', width: 180 },
			{
				field: 'membership_type',
				headerName: 'Membership Type',
				width: 180,
			},
			{
				field: 'membership_status',
				headerName: 'Membership Status',
				width: 180,
			},
			{ field: 'renewal_date', headerName: 'Renewal date', width: 180 },
			{ field: 'club_member', headerName: 'Club Member', width: 180 },
			{
				field: 'actions',
				type: 'actions',
				headerName: 'Actions',
				width: 100,
				cellClassName: 'actions',
				renderCell: params => {
					return (
						<div
							className='d-flex justify-content-between align-items-center'
							style={{ cursor: 'pointer' }}
						>
							<MatEdit
								index={params.row.id}
								handleClick={() =>
									this.props.history.push(
										'customer/' + params.row.id
									)
								}
								handleDeleteClick={() => {
									this.deleteCustomer(
										this.props.rcp_url.domain +
											this.props.rcp_url.base_url +
											'customers/delete/',
										params.row.id
									);
								}}
							/>
						</div>
					);
				},
			},
		];

		const rows =
			this.state.customers.length !== 0
				? this.state.customers.map((item, key) => {
						return {
							id: item.id,
							membership_number: item.user_login,
							workplace: item.workplace,
							reference_club: item.reference_club,
							membership_id:
								item.memberships.length === 0
									? 'No Memberhsip'
									: item.memberships[0],
							first_name: item.first_name,
							last_name: item.last_name,
							email: item.email,
							membership_type:
								item.memberships_data.length === 0
									? 'No Memberhsip'
									: item.memberships_data[0].type,
							membership_status:
								item.memberships_data.length === 0
									? 'No Membership'
									: item.memberships_data[0].status,
							club_member: item.is_club_member
								? item.club_member
								: 'Not a club member',
							renewal_date:
								item.memberships_data.length === 0
									? 'No Renewal Date'
									: item.memberships_data[0].expired_date,
						};
				  })
				: [];

		return (
			<>
				<OnlyHeader />
				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<h3 className='mb-0'>Members</h3>
								</CardHeader>
								<DataGrid
									loading={this.state.customersLoading}
									autoHeight
									rows={rows}
									columns={columns}
									onPageChange={this.handlePageChange.bind(
										this
									)}
									pageSize={
										this.state.customers.length > 20
											? 20
											: this.state.customers.length
									}
									rowCount={1000}
									paginationMode='server'
									page={this.state.page - 1}
									pagination
									components={{
										Toolbar: this.CustomToolbar,
										NoRowsOverlay: () => (
											<div
												height='100%'
												alignItems='center'
												justifyContent='center'
											>
												No rows found.
											</div>
										),
									}}
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

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
