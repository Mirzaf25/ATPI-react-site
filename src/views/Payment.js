import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';
import { DataGrid } from '@material-ui/data-grid';

// reactstrap components
import {
	Badge,
	Card,
	CardHeader,
	CardFooter,
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
	DropdownToggle,
	Media,
	Pagination,
	PaginationItem,
	PaginationLink,
	Progress,
	Table,
	Container,
	Row,
	UncontrolledTooltip,
} from 'reactstrap';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
import MatEdit from './MatEdit';

class Payments extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			payments: [],
			page: 1,
			number: 20,
		};
	}

	componentDidMount() {
		if (null === this.props.user.token) {
			this.fetchToken(
				this.props.rcp_url.domain +
					this.props.rcp_url.auth_url +
					'token'
			);
		} else if (this.state.payments?.length === 0) {
			this.fetchPayment(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'payments',
				this.props.user.token
			);
		}
	}

	componentDidUpdate({ user: prevUser }, { page: prevPage }) {
		if (
			null !== this.props.user.token &&
			prevUser.token !== this.props.user.token &&
			this.state.payments?.length === 0
		) {
			this.fetchPayment(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'payments',
				this.props.user.token
			);
		}

		if (null !== this.props.user.token && prevPage !== this.state.page) {
			this.fetchPayment(
				this.props.rcp_url.proxy_domain +
					this.props.rcp_url.base_url +
					'payments',
				this.props.user.token,
				this.state.page
			);
		}
	}

	handlePageChange = params => {
		this.setState({ page: params + 1 });
	};

	async fetchToken(token_url) {
		const response = await fetch(token_url, {
			method: 'post',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: process.env.REACT_APP_ATPI_USERNAME, // Hardcoded for now.
				password: process.env.REACT_APP_ATPI_PASSWORD, // Hardcoded for now.
			}),
		});

		const data = await response.json();
		this.props.setUserLoginDetails(data);
	}

	fetchPayment = async (url, token, page = this.state.page) => {
		const urlQuery = new URL(url);
		const paramsOptions = {
			number: this.state.number,
			offset: (page - 1) * this.state.number,
			order_by: 'created_date',
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
		this.setState({ payments: data });
	};

	render() {
		const columns = [
			{ field: 'id', headerName: 'ID', width: 100 },
			{
				field: 'membership_number',
				headerName: 'Membership Number',
				width: 180,
			},
			{
				field: 'first_name',
				headerName: 'First Name',
				width: 180,
			},
			{
				field: 'last_name',
				headerName: 'Last Name',
				width: 180,
			},
			{
				field: 'invoice_url',
				headerName: 'Invoice URL',
				width: 180,
				renderCell: ({ row }) => {
					return (
						<a href={row.invoice_url} target='_blank'>
							{row.invoice_url}
						</a>
					);
				},
			},
			{
				field: 'payment_method',
				headerName: 'Payment Method',
				width: 180,
			},
			{ field: 'customer_id', headerName: 'Customer ID', width: 180 },
			{ field: 'status', headerName: 'Status', width: 180 },
			{ field: 'amount', headerName: 'Amount', width: 180 },
			{ field: 'subscription', headerName: 'Subscription', width: 180 },
			{ field: 'created', headerName: 'Created', width: 180 },
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
										'payment/edit/' + params.row.id
									)
								}
								handleDeleteClick={() => {
									this.deleteCustomer(
										this.props.rcp_url.domain +
											this.props.rcp_url.base_url +
											'payments/delete/',
										params.row.id
									);
								}}
							/>
						</div>
					);
				},
			},
		];

		const rows = this.state.payments.map((item, key) => {
			const date = new Date(item.date);
			return {
				id: item.id,
				membership_number: item.membership_number,
				first_name: item.first_name,
				last_name: item.last_name,
				invoice_url: item.invoice_url,
				name: item.membership_name,
				status: item.status,
				amount: item.amount,
				subscription: item.subscription,
				payment_method: item.gateway,
				created:
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
									<h3 className='mb-0'>Payments</h3>
								</CardHeader>
								{/*}
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Customer Name</th>
                      <th scope="col">Status</th>
                      <th scope="col">Recurring</th>
                      <th scope="col">Created</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.memberships.map((item, key) => (
                      <tr key={key}>
                        <th>{item.id}</th>
                        <td>{item.membership_name}</td>
                        <td>{item.customer_name}</td>
                        <td>{item.status}</td>
                        <td>{item.recurring_amount}</td>
                        <td>{item.created_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                    */}
								<DataGrid
									loading={this.state.payments.length === 0}
									autoHeight
									rows={rows}
									columns={columns}
									onPageChange={this.handlePageChange.bind(
										this
									)}
									pageSize={
										this.state.payments.length > 20
											? 20
											: this.state.payments.length
									}
									rowCount={1000}
									pagination
									paginationMode='server'
								/>
								{/* Add Pagination */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
