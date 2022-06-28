import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';
//import CloseIcon from '@mui/icons-material/Close';

// reactstrap components
import {
	Badge,
	Card,
	CardHeader,
	CardBody,
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
	Col,
	UncontrolledTooltip,
	Navbar,
	NavLink,
	Form,
	FormGroup,
	Dropdown,
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter,
	ButtonGroup,
	Spinner,
} from 'reactstrap';

//MUI
import { DataGrid } from '@material-ui/data-grid';
import { setFilrLoading } from '../../features/filr/filrSlice';

import fileIcons from '../../variables/file-icons';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
import {
	Grid,
	List,
	ListItem,
	ListItemIcon,
	Drawer,
	IconButton,
	Button,
	Link,
	LinearProgress,
	Breadcrumbs,
	withStyles,
	Grow,
	TextField,
	Snackbar,
} from '@material-ui/core';
import ListItemButton from '@material-ui/core/Button';

import 'file-viewer';

class Filr extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			files: [],
			drawer: false,
			selectedFile: {},
			viewFiles: [],
			viewLoading: false,
			currentFolder: null,
			dropdownOpen: false,
			createFolderModalStatus: false,
			uploadFileModalStatus: false,
			uploadType: '',
			newFolderName: '',
			newFolderId: '',
			selectedFile: Object,
			showFolderNav: true,
			/*      snackbarStatus : false,
      snackBarMessage:'Default Text',*/
		};
		this.breadcrumbs = [
			<Link
				underline='hover'
				color='inherit'
				href='#'
				onClick={e => {
					e.preventDefault();
					if (this.state.files.length !== 0) {
						this.setState({
							viewFiles: this.state.files.filter(
								el =>
									el.metadata['assigned-folder'] === undefined
							),
						});
					}
				}}
			>
				...
			</Link>,
		];
	}

	/*  handleSnackbarChange = () =>{
    this.setState({snackbarStatus: !this.state.snackbarStatus});
  }*/

	fileChangedHandler = event => {
		this.setState({ selectedFile: event.target.files[0] });
	};

	uploadHandler = () => {
		// @todo upload to api
	};

	createFolder = async e => {
		e.preventDefault();

		if (this.props.user.token === null) return;

		// @todo create folder

		this.setState({ newFolderName: '' });
	};

	handleFolderNameChange = e => {
		this.setState({ newFolderName: e.target.value });
	};

	handleFolderIdChange = e => {
		this.setState({ newFolderId: e.target.value });
	};

	toggleCreateFolderModal = () => {
		this.setState({
			createFolderModalStatus: !this.state.createFolderModalStatus,
		});
	};
	clearFields = () => {
		this.setState({
			newFolderId: '',
			newFolderName: '',
		});
	};
	toggleUploadFileModal = () => {
		this.setState({
			uploadFileModalStatus: !this.state.uploadFileModalStatus,
		});
	};
	dropdownToggle = () => {
		this.setState({ dropdownOpen: !this.state.dropdownOpen });
	};
	componentDidMount() {
		if (this.state.files.length === 0)
			this.fetchFiles(
				this.props.rcp_url.proxy_domain +
					this.props.rcp_url.base_wp_url +
					'filr'
			);
	}

	componentDidUpdate(
		prevProps,

		{ files: prevFiles, viewFiles: prevViewFiles }
	) {
		if (this.state.files.length !== 0 && prevFiles !== this.state.files) {
			this.setState({
				viewFiles: this.state.files.filter(
					el => el.metadata['assigned-folder'] === undefined
				),
			});
		}
		if (prevViewFiles !== this.state.viewFiles) {
			const index = this.breadcrumbs.findIndex(
				item => item.key == this.state.currentFolder
			);

			if (index !== -1) {
				this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
			} else {
				const folder = this.state.files.find(
					el => el.id == this.state.currentFolder
				);
				//use indexes to clear up breadcrumbs.
				if (
					folder !== undefined &&
					folder?.metadata['assigned-folder'] != 0
				) {
					this.breadcrumbs.push(
						<Link
							underline='hover'
							key={folder.id}
							color='inherit'
							href='#'
							data-id={folder.id}
							onClick={e => {
								e.preventDefault();
								this.openFolder(folder);
							}}
						>
							{folder?.title.rendered}
						</Link>
					);
				} else if (folder !== undefined) {
					this.breadcrumbs = [
						<Row>
							<Link
								underline='hover'
								key='000'
								color='inherit'
								data-id={'root'}
								href='#'
								onClick={e => {
									e.preventDefault();
									this.setState({ viewFiles: prevViewFiles });
									this.setState({ viewLoading: false });
									this.setState({ currentFolder: null });

									document
										.querySelectorAll('.folder-icon')
										.forEach(el => {
											if (
												el.classList.contains(
													'fa-folder-open'
												)
											) {
												el.classList.toggle(
													'fa-folder-open'
												);
											}
										});

									this.setState({ showFolderNav: false });
								}}
							>
								../
							</Link>

							<Link
								underline='hover'
								key={folder?.id}
								color='inherit'
								data-id={folder.id}
								href='#'
								onClick={e => {
									e.preventDefault();
									this.openFolder(folder);
								}}
							>
								{folder?.title.rendered}
							</Link>
						</Row>,
					];
					this.setState({ showFolderNav: true });
				}
			}
		}
	}

	fetchFiles = async url => {
		const queryUrl = new URL(url);
		const params = {
			per_page: 100,
		};
		for (let key in params) {
			queryUrl.searchParams.set(key, params[key]);
		}
		const res = await fetch(queryUrl);
		const data = await res.json();
		this.setState({ files: data });
	};

	openFolder = item => {
		console.log(item);
		this.setState({
			viewLoading: true,
			currentFolder: item.id,
			viewFiles: this.state.files.filter(el => {
				return (
					el.metadata.hasOwnProperty('assigned-folder') &&
					el.metadata['assigned-folder'] == item.id
				);
			}),
		});
		document.querySelectorAll('.folder-icon').forEach(el => {
			if (
				el.classList.contains('fa-folder-open') ||
				el.dataset.id == item.id
			) {
				el.classList.toggle('fa-folder-open');
			}
		});
		// @todo fetch from api
		setTimeout(() => {
			this.setState({ viewLoading: false });
		}, 2000);
	};

	dropdownToggle = () => {
		this.setState({ dropdownOpen: !this.state.dropdownOpen });
	};

	fileChangedHandler = event => {
		this.setState({ selectedFile: event.target.files[0] });
	};

	uploadHandler = () => {
		// @todo upload to api
	};

	handleFolderNameChange = e => {
		this.setState({ newFolderName: e.target.value });
	};

	handleFolderIdChange = e => {
		this.setState({ newFolderId: e.target.value });
	};

	toggleCreateFolderModal = () => {
		this.setState({
			createFolderModalStatus: !this.state.createFolderModalStatus,
		});
	};
	clearFields = () => {
		this.setState({
			newFolderId: '',
			newFolderName: '',
		});
	};
	toggleUploadFileModal = () => {
		this.setState({
			uploadFileModalStatus: !this.state.uploadFileModalStatus,
		});
	};
	dropdownToggle = () => {
		this.setState({ dropdownOpen: !this.state.dropdownOpen });
	};

	clearFields = () => {
		this.setState({
			newFolderId: '',
			newFolderName: '',
		});
	};

	createNewFolder = async (url, payload, onSuccess = () => {}) => {
		this.props.setFilrLoading(true);

		try {
			const response = await fetch(url, {
				method: 'post',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.props.user.token}`,
				},
				body: JSON.stringify(payload),
			});
			this.setState({ viewFiles: [payload, ...this.state.viewFiles] });
			await this.props.setFilrLoading(false);
			onSuccess();
		} catch (error) {
			this.props.setFilrLoading(false);
		}
	};

	openFolder = item => {
		this.setState({
			viewLoading: true,
			currentFolder: item.id,
			viewFiles: this.state.files.filter(el => {
				return (
					el.metadata.hasOwnProperty('assigned-folder') &&
					el.metadata['assigned-folder'] == item.id
				);
			}),
		});
		document.querySelectorAll('.folder-icon').forEach(el => {
			if (
				el.classList.contains('fa-folder-open') ||
				el.dataset.id == item.id
			) {
				el.classList.toggle('fa-folder-open');
			}
		});
		// @todo fetch from api
		setTimeout(() => {
			this.setState({ viewLoading: false });
		}, 2000);
	};

	render() {
		const columns = [
			{
				field: 'name',
				headerName: 'Name',
				width: 180,
				renderCell: params => {
					return (
						<div
							className='d-flex justify-content-between align-items-center'
							style={{ cursor: 'pointer' }}
						>
							<i
								className={
									(typeof params.row.fileIcon === 'string'
										? params.row.fileIcon
										: 'fa fa-file text-red') + ' mr-2'
								}
								style={{ fontSize: '1rem' }}
							/>
							<Link
								onClick={() => {
									if (params.row.isFolder) {
										this.openFolder(params.row);
									} else {
										this.setState({
											selectedFile: params.row,
											drawer: true,
										});
									}
								}}
							>
								{params.row.name}
							</Link>
						</div>
					);
				},
			},
			{
				field: 'modified',
				headerName: 'Modified Date',
				width: 180,
			},
			{
				field: 'status',
				headerName: 'Status',
				width: 180,
			},
		];
		const rows = [];
		/* const action = (
      <React.Fragment>
        <Button
          size="small"
          aria-label="close"
          color="inherit"
          onClick={this.handleSnackbarChange}
        >
          Close
        </Button>
      </React.Fragment>
    );
    */
		const folder = this.state.files.find(
			el => el.id == this.state.currentFolder
		);

		return (
			<>
				<Modal
					isOpen={this.state.uploadFileModalStatus}
					toggle={this.toggleUploadFileModal}
				>
					<ModalHeader>
						Upload File
						{folder?.title.rendered == undefined
							? ' to root'
							: ' to ' + folder?.title.rendered}
					</ModalHeader>
					<ModalBody>
						<input type='file' onChange={this.fileChangedHandler} />
						<Button
							variant='contained'
							onClick={this.uploadHandler}
						>
							Upload
						</Button>
					</ModalBody>
					<ModalFooter></ModalFooter>
				</Modal>

				<Modal
					isOpen={this.state.createFolderModalStatus}
					toggle={() => {
						this.clearFields();
						this.toggleCreateFolderModal();
					}}
				>
					<ModalHeader
						toggle={() => {
							this.clearFields();
							this.toggleCreateFolderModal();
						}}
					>
						Create Folder
						{folder?.title.rendered == undefined
							? ' in root'
							: ' in ' + folder?.title.rendered}{' '}
					</ModalHeader>
					<Form
						onSubmit={e => {
							e.preventDefault();
							this.createNewFolder(
								this.props.rcp_url.proxy_domain +
									this.props.rcp_url.base_wp_url +
									'filr',
								{
									title: this.state.newFolderName,
									metadata: {
										'is-folder': true,
										'assigned-folder': this.state
											.newFolderId
											? this.state.newFolderId
											: this.state.currentFolder,
									},
								},
								() => {
									alert('Folder added successfully!');
									this.fetchFiles(
										this.props.rcp_url.proxy_domain +
											this.props.rcp_url.base_wp_url +
											'filr'
									);
									this.clearFields();
									this.toggleCreateFolderModal();
								}
							);
						}}
					>
						<ModalBody>
							<Col>
								<FormGroup>
									<TextField
										onChange={e =>
											this.handleFolderNameChange(e)
										}
										value={this.state.newFolderName}
										required
										name='folder_name'
										id='folder_name'
										label='Name'
										variant='outlined'
										size='small'
										className='w-100'
									/>
								</FormGroup>
								<FormGroup>
									<TextField
										onChange={e =>
											this.handleFolderIdChange(e)
										}
										value={this.state.newFolderId}
										name='folder_id'
										id='folder_id'
										label='Folder Id (Optional)'
										variant='outlined'
										className='w-100'
										size='small'
									/>
								</FormGroup>
							</Col>
						</ModalBody>
						<ModalFooter>
							{' '}
							<Button
								type='submit'
								variant='contained'
								disabled={this.props.filr.loading}
							>
								{this.props.filr.loading ? (
									<Spinner size='sm' />
								) : (
									'Submit'
								)}
							</Button>
						</ModalFooter>
					</Form>
				</Modal>

				{/*
<Snackbar
        open={this.state.snackbarStatus}
        autoHideDuration={4000}
        onClose={this.handleSnackbarChange}
        message={this.state.snackBarMessage}
        action={action}
      />
*/}
				<OnlyHeader />
				<Container className='mt--8' fluid>
					{/*        <Button onClick={this.handleSnackbarChange}>Snack Bar</Button>
					 */}
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<h3 className='mb-0'>ATPI Library</h3>
									<h4>Files shared with all club members</h4>

									<Row className='d-flex flex-row-reverse '>
										<Dropdown
											isOpen={this.state.dropdownOpen}
											toggle={this.dropdownToggle}
										>
											<DropdownToggle caret>
												Options
											</DropdownToggle>
											<DropdownMenu>
												<DropdownItem
													onClick={
														this
															.toggleUploadFileModal
													}
												>
													Upload File
												</DropdownItem>
												<DropdownItem
													onClick={
														this
															.toggleCreateFolderModal
													}
												>
													Create Folder
												</DropdownItem>
											</DropdownMenu>
										</Dropdown>
									</Row>
								</CardHeader>

								<CardBody>
									<Breadcrumbs maxItems={6}>
										{this.state.showFolderNav
											? this.breadcrumbs
											: []}
									</Breadcrumbs>
									<Grid container spacing={2}>
										<Grid item xs={12} md={4}>
											<Navbar className='p-0'>
												<List className='w-100'>
													{this.state.files.length !==
														0 &&
														this.state.files
															.filter(
																el =>
																	el.metadata[
																		'is-folder'
																	]?.includes(
																		'true'
																	) &&
																	el.metadata[
																		'assigned-folder'
																	] === '0'
															)
															.map(
																(item, key) => (
																	<NavLink
																		key={
																			key
																		}
																	>
																		<ListItem>
																			<ListItemButton
																				startIcon={
																					<i
																						className='fa fa-folder text-orange folder-icon'
																						data-id={
																							item.id
																						}
																					/>
																				}
																				className='w-100 justify-content-start text-capitalize folder-buttons'
																				onClick={this.openFolder.bind(
																					this,
																					item
																				)}
																			>
																				{item.title.rendered.slice(
																					0,
																					20
																				) +
																					'...'}
																			</ListItemButton>
																		</ListItem>
																	</NavLink>
																)
															)}
												</List>
											</Navbar>
										</Grid>
										<Grid item xs={12} md={8}>
											<List>
												{this.state.files.length !==
													0 &&
													// this.state.files
													//   .filter(
													//     (el) =>
													//       el.metadata["assigned-folder"] === undefined
													//   )
													this.state.viewFiles.map(
														(item, key) => {
															const isFolder =
																item.hasOwnProperty(
																	'metadata'
																) &&
																item.metadata.hasOwnProperty(
																	'is-folder'
																) &&
																item.metadata[
																	'is-folder'
																] === 'true'
																	? true
																	: false;
															const fileType =
																!isFolder &&
																item.metadata[
																	'file-download'
																]
																	?.split('.')
																	.pop();
															const fileUrl = isFolder
																? null
																: item.metadata[
																		'file-download'
																  ];
															const fileIcon = isFolder
																? 'fa fa-folder text-orange'
																: fileIcons
																		.filter(
																			el =>
																				el.type.includes(
																					fileType
																				)
																		)
																		?.pop()
																		?.icon;
															//console.log(fileIcon);  @todo it return undefined after a while.
															rows.push({
																id: item.id,
																fileUrl: fileUrl,
																fileType: fileType,
																fileIcon: fileIcon,
																name:
																	item.title
																		.rendered,
																modified:
																	item.modified,
																status:
																	item.status,
																isFolder: isFolder,
															});

															// return (
															//   <>
															//     <ListItem key={key}>
															//       <ListItemButton
															// onClick={() =>
															//   this.setState({
															//     selectedFile: item,
															//     drawer: true,
															//   })
															// }
															//         className="w-100 text-capitalize justify-content-start"
															//       >
															//         <ListItemIcon className="fs-2 justify-content-center">
															//           <i
															//             className={
															//               typeof fileIcon === "string"
															//                 ? fileIcon
															//                 : "fa fa-file"
															//             }
															//           />
															//         </ListItemIcon>
															//         {item.title.rendered}
															//       </ListItemButton>
															//     </ListItem>
															//   </>
															// );
														}
													)}
												<DataGrid
													loading={
														this.state.viewLoading
													}
													components={{
														LoadingOverlay: LinearProgress,
													}}
													checkboxSelection
													autoHeight
													rows={rows}
													columns={columns}
												/>
											</List>
										</Grid>
									</Grid>
								</CardBody>
							</Card>
							<Drawer
								anchor='left'
								open={this.state.drawer}
								className={this.props.classes.fileViewer}
							>
								{Object.keys(this.state.selectedFile).length !==
									0 && (
									<>
										<Row
											style={{
												width: window.innerWidth * 0.75,
											}}
											className='pt-3 pl-3'
										>
											<Col xs={8}>
												<h2>
													{
														this.state.selectedFile
															.name
													}
												</h2>
											</Col>
											<Col
												className='d-flex justify-content-end  align-items-center'
												xs={4}
											>
												<IconButton
													className='p-2 mr-3'
													onClick={() =>
														this.setState({
															drawer: false,
														})
													}
													size='small'
												>
													<i
														className='fa fa-plus'
														style={{
															transform:
																'rotate(45deg)',
														}}
													/>
												</IconButton>
											</Col>
										</Row>
										<file-viewer
											style={{ height: '80%' }}
											id='file-viewer'
											filename={
												this.state.selectedFile.name
											}
											url={
												this.state.selectedFile.fileUrl
											}
										>
											<div
												className='w-100 h-100 d-flex justify-content-center align-items-center'
												slot='not-supported'
											>
												Not supported
											</div>
										</file-viewer>
										<Row className='mt-3'>
											<Col xs={6}></Col>
											<Col
												xs={6}
												className='d-flex justify-content-center'
											>
												<Button
													className='mr-2'
													variant='contained'
												>
													<a
														className='text-black'
														href={
															this.state
																.selectedFile
																.fileUrl
														}
														target='_blank'
													>
														Download
													</a>
												</Button>
												<Button
													onClick={() =>
														this.setState({
															drawer: false,
														})
													}
													variant='outlined'
												>
													Cancel
												</Button>
											</Col>
										</Row>
									</>
								)}
							</Drawer>
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
		filr: state.filr,
	};
};

const mapDispatchToProps = { setUserLoginDetails, setFilrLoading };

const styles = {
	fileViewer: {
		'& .MuiPaper-root.MuiDrawer-paper': {
			width: '75%',
		},
	},
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(Filr));
