import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import {Button} from "@material-ui/core";
import DropAreaUpload from "../../components/Utils/DropAreaUpload";
import WP_ImagesList from "../../components/Utils/WP_ImagesList";
import CombinedDropAreaUpload from "./CombinedDropAreaUpload";

class Media extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      media: [],
      uploadAreaOpen: false,
    };
  }

  componentDidMount() {
    console.log('Component Mounted');
    if (this.state.media.length === 0)
      this.fetchMedia(
        this.props.rcp_url.domain + this.props.rcp_url.base_wp_url + "media"
      );
  }

  componentDidUpdate() {}

  fetchMedia = async (url) => {
    const queryUrl = new URL(url);
    const params = {
      per_page: 100,
      _embed: true,
    };
    for (let key in params) {
      queryUrl.searchParams.set(key, params[key]);
    }
    const res = await fetch(queryUrl);
    const data = await res.json();
    this.setState({ media: data });
  };


  updateMdeia(newMedia){
    console.log('newMedia ==>> ',newMedia);
    this.setState({media:newMedia});
  }

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


                  <CombinedDropAreaUpload/>

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
