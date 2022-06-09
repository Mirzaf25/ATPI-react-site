import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

// reactstrap components
import { Col, Form, FormGroup, Input, Label } from 'reactstrap';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
import {
	TextField,
	Button,
	Select,
	InputLabel,
	MenuItem,
	OutlinedInput,
	ListItem,
	ListItemText,
} from '@material-ui/core';

import MatEdit from 'views/MatEdit';

class UpdateCustomer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Form
				name='update_customer'
				id='update_customer'
				onSubmit={this.props.updateCustomer}
			>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='ATPI Membership number'
							name='user_login'
							variant='outlined'
							helperText={'You cannot change this.'}
							required
							value={this.props.customer?.user_login || ''}
							InputLabelProps={{
								shrink:
									this.props.customer?.user_login !==
									undefined,
							}}
							disabled
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='First Name'
							name='first_name'
							variant='outlined'
							inputRef={node => {
								if (node) node.dataset.field = 'user_args';
							}}
							required
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.user_args?.first_name || ''}
							InputLabelProps={{
								shrink: this.props.customer?.first_name !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Last Name'
							inputRef={node => {
								if (node) node.dataset.field = 'user_args';
							}}
							name='last_name'
							variant='outlined'
							required
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.user_args?.last_name || ''}
							InputLabelProps={{
								shrink: this.props.customer?.last_name !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Email'
							inputRef={node => {
								if (node) node.dataset.field = 'user_args';
							}}
							name='user_email'
							variant='outlined'
							required
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.user_args?.user_email || ''}
							InputLabelProps={{
								shrink: this.props.customer?.email !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Workplace'
							name='workplace'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.workplace || ''}
							InputLabelProps={{
								shrink: this.props.customer?.workplace !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Job Title'
							name='reference_club'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.reference_club || ''}
							InputLabelProps={{
								shrink:
									this.props.customer?.reference_club !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col sm={8}>
						<TextField
							className='w-100'
							id='outlined-basic'
							label='Address'
							name='address_one'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.address_one || ''}
							InputLabelProps={{
								shrink: this.props.customer?.address_one !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col sm={8}>
						<TextField
							className='w-100'
							id='outlined-basic'
							label='Address Secondary'
							name='address_two'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.address_two || ''}
							InputLabelProps={{
								shrink: this.props.customer?.address_two !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Town'
							name='town'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.town || ''}
							InputLabelProps={{
								shrink: this.props.customer?.town !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='County'
							name='county'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.county || ''}
							InputLabelProps={{
								shrink: this.props.customer?.county !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Eircode'
							name='eircode'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.eircode || ''}
							InputLabelProps={{
								shrink: this.props.customer?.eircode !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Country'
							name='country'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.country || ''}
							InputLabelProps={{
								shrink: this.props.customer?.country !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Phone'
							name='phone'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.phone || ''}
							InputLabelProps={{
								shrink: this.props.customer?.phone !== '',
							}}
						/>
					</Col>
				</FormGroup>
				{this.props.user.is_admin && (
					<FormGroup row>
						<Col>
							<InputLabel id='region_label'>Region</InputLabel>
							<Select
								style={{ width: '225px' }}
								labelId='region_label'
								id='region'
								name='region'
								value={this.props.form?.region || ''}
								onChange={this.props.handleChange}
								input={<OutlinedInput />}
								MenuProps={{
									PaperProps: {
										style: {
											maxHeight: 48 * 4.5 + 8,
											width: 250,
										},
									},
								}}
							>
								<MenuItem value={'NW'}>
									<ListItemText primary={'NW'} />
								</MenuItem>
								<MenuItem value={'SW'}>
									<ListItemText primary={'SW'} />
								</MenuItem>
								<MenuItem value={'SE'}>
									<ListItemText primary={'SE'} />
								</MenuItem>
								<MenuItem value={'NE'}>
									<ListItemText primary={'NE'} />
								</MenuItem>
								<MenuItem value={'NI'}>
									<ListItemText primary={'NI'} />
								</MenuItem>
								<MenuItem value={'INT'}>
									<ListItemText primary={'INT'} />
								</MenuItem>
							</Select>
						</Col>
					</FormGroup>
				)}
				{/* {this.props.user.is_admin && (
					<FormGroup row>
						<Label sm={4} for='region'>
							Region
						</Label>
						<Col md={6}>
							<Input name='region' type='select'>
								<option value='NW'>NW</option>
								<option value='SW'>SW</option>
								<option value='SE'>SE</option>
								<option value='NE'>NE</option>
								<option value='NI'>NI</option>
								<option value='INT'>INT</option>
							</Input>
						</Col>
					</FormGroup>
				)} */}
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Customer ID'
							name='customer_id'
							variant='outlined'
							helperText={'You cannot change this.'}
							required
							className='d-none'
							type='hidden'
							value={this.props.customer?.id || ''}
							InputLabelProps={{
								shrink: this.props.customer?.id !== '',
							}}
							disabled
						/>
					</Col>
					<Col>
						<TextField
							id='outlined-basic'
							label='User ID'
							name='user_id'
							type='hidden'
							className='d-none'
							variant='outlined'
							helperText={'You cannot change this.'}
							required
							value={this.props.customer?.user_id || ''}
							InputLabelProps={{
								shrink: this.props.customer?.user_id !== '',
							}}
							disabled
						/>
					</Col>
				</FormGroup>
				<FormGroup>
					<Col>
						<Button variant='contained' type='submit'>
							Update User
						</Button>
					</Col>
				</FormGroup>
			</Form>
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

export default connect(mappropsToProps, mapDispatchToProps)(UpdateCustomer);
