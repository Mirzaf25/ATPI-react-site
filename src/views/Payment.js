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
import MatEdit from './MatEdit';

class Payments extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			payments: [],
			page: 1,
			number: 5,
		};
	}

	componentDidMount() {
		if (this.state.payments?.length === 0) {
			this.fetchPayment(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'payments',
				this.props.user.token
			);
		}
	}

	componentDidUpdate() {
		if (this.state.payments?.length === 0) {
			this.fetchPayment(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'payments',
				this.props.user.token
			);
		}
	}

	fetchPayment = async url => {
		const urlQuery = new URL(url);
		const paramsOptions = {
			number: this.state.number,
			offset: (this.state.page - 1) * this.state.number,
			orderby: 'ID',
			order: 'ASC',
		};
		for (let key in paramsOptions) {
			urlQuery.searchParams.set(key, paramsOptions[key]);
		}

		const res = await fetch(urlQuery, {
			headers: {},
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
									pagination
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
	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
