import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

// reactstrap components
import {
  Alert,
  Card,
  CardHeader,
  CardBody,
  Media,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import moment from 'moment';
//MUI
import { DataGrid } from "@material-ui/data-grid";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import {
  LinearProgress,
  Avatar,
  Grid,
  TextField,
  Chip,
  Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
  Select,
  withStyles,
  MenuItem,
  InputLabel,
  Snackbar,
} from "@material-ui/core";

import MatEdit from "views/MatEdit";

class EditDiscountCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openSnackbar: false,
      errorSnackbar: false,
      error: null,

      name:'',
      code:'',
      amount:'',
      unit:'',
      expiration:'',
      one_time:'',
      max:'',
      used:'',
    };

    this.edit_discount_code_url =
      this.props.rcp_url.domain + this.props.rcp_url.base_url + "discounts/update/"+this.props.location.state.id.id;
  }
  
  
  componentDidMount(){
    const data = this.props.location.state.id;
//    console.log('this.props.location.state.id ==>> ',this.props.location.state.id.id);
    this.setState({name:data.name});
    this.setState({code:data.code});
    this.setState({expiration:moment(data.expiration, "DD-MM-YYYY").toISOString().slice(0,10)  });
    this.setState({one_time:data.one_time});
    this.setState({amount:data.amount});
    this.setState({unit:data.unit == undefined ? "%" :"flat"});
    this.setState({max:data.max});
    this.setState({used:data.used});
  }
  submitForm() {
    console.log('Submitted Form');
    const form = document.getElementById("edit-discount-code-form");
    form.style.pointerEvents = "none";
    //const formData = new FormData(form);
    //console.log('formData ==>> ',form);
    
    const body = {
      name: this.state.name,
      code: this.state.code,
      expiration: this.state.expiration,
      one_time:false,//this.state.one_time,
      amount:this.state.amount.toString()+this.state.unit,   
      max: this.state.max == undefined ? 'Unlimited':this.state.max,
    }
    console.log(body);
    fetch(this.edit_discount_code_url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + this.props.user.token,
      },
      body: body,//formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const { errors } = data;
        let err_messages = "";
        if (errors) {
          for (const prop in errors) {
            err_messages += prop + " : " + errors[prop];
          }
          return Promise.reject(err_messages);
        }
        this.setState({ openSnackbar: true, errorSnackbar: false });
        form.style.pointerEvents = "all";
      })
      .catch((err) => {
        this.setState({ openSnackbar: true, errorSnackbar: true, error: err });
        form.style.pointerEvents = "all";
        console.error(err);
      });
  }

  handleChange = (event) => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    console.log({ name });
    this.setState({
      [name]: value,
    });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ openSnackbar: false });
  };

  render() {

    const action = (
      <React.Fragment>
        <Button
          size="small"
          aria-label="close"
          color="inherit"
          onClick={this.handleClose}
        >
          <i className="fa fa-plus" style={{ transform: "rotate(-45deg)" }} />
        </Button>
      </React.Fragment>
    );

    return (
      <>
        <OnlyHeader />
        <Container className="mt--8" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Edit Discount Code</h3>
                </CardHeader>
                <CardBody>
                  <Form
                    id="edit-discount-code-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      return this.submitForm();
                    }}
                  >
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="name"
                          label="Name"
                          name="name"
                          variant="outlined"
                          value={this.state.name}
                         // required
                          onChange={this.handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="code"
                          label="Code"
                          name="code"
                          variant="outlined"
                          value={this.state.code}
                          //required
                          onChange={this.handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="amount"
                          label="Amount"
                          name="amount"
                          variant="outlined"
                          //required
                          value = {   parseFloat( this.state.amount.match(/\d+/g)) }
                          type="number"
                          onChange={this.handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <FormControl style={{ minWidth: "120px" }}>
                          <InputLabel id="amount_unit_label">Unit</InputLabel>
                          <Select
                            labelId="amount_unit_label"
                            id="amount_unit"
                            name="unit"
                            value = {this.state.unit }
                            onChange={this.handleChange}
                          >
                            <MenuItem value={"%"}>Percentage</MenuItem>
                            <MenuItem value={"flat"}>Flat Amount</MenuItem>
                          </Select>
                        </FormControl>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col sm={6}>
                        <Label>Expiration Date</Label>
                        <Input
                          type="date"
                          name="expiration"
                          value = {this.state.expiration}
                          className={
                            this.props.classes.date +
                            " MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl"
                          }
                          onChange={this.handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col sm={6}>
                        <FormControlLabel
                          control={<Switch name="one_time" />}
                          label="Is One Time"
                          labelPlacement="start"
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col sm={6}>
                        <TextField
                          id="max_use"
                          label="Max Use"
                          name="max"
                          variant="outlined"
                          type="number"
                          value={this.state.max}
                          onChange={this.handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup check row>
                      <Col>
                        <Button variant="contained" type="submit">
                          Submit
                        </Button>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </div>
          </Row>
          <Snackbar
            open={this.state.openSnackbar}
            autoHideDuration={4000}
            onClose={this.handleClose}
            action={action}
          >
            <Alert
              onClose={this.handleClose}
              color={this.state.errorSnackbar ? "danger" : "success"}
              style={{ width: "100%" }}
            >
              {this.state.error !== null && this.state.errorSnackbar
                ? this.state.error
                : "Discount Code Created"}
            </Alert>
          </Snackbar>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rcp_url: state.rcp_url,
    user: state.user,
  };
};

const mapDispatchToProps = { setUserLoginDetails };

const styles = {
  date: {
    "&:hover": {
      borderColor: "inherit",
    },
    "&:focus": {
      borderColor: "#3f51b5",
      borderWidth: "2px",
    },
  },
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(EditDiscountCode));
