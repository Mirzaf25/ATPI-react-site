import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import {Button} from "@material-ui/core";
import DropAreaUpload from "./DropAreaUpload";
import WP_ImagesList from "./WP_ImagesList";

class Media extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadAreaOpen: false,
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}



  render() {
    return (
      <>
        <OnlyHeader />
        <Container className="mt--8" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0 d-flex justify-content-between pl-3 pr-3">
                  <h3 className="mb-0">Media</h3>
                  <Button
                    variant="contained"
                    onClick={() =>
                      this.setState({
                        uploadAreaOpen: !this.state.uploadAreaOpen,
                      })
                    }
                  >
                        {this.state.uploadAreaOpen ? "Close" : "Upload"}              
                  </Button>
                </CardHeader>

                <CardBody>


                {this.state.uploadAreaOpen && <DropAreaUpload /> }
               <WP_ImagesList/>
              

                </CardBody>

              </Card>
            </div>
          </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(Media);
