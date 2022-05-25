import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import {
  Button,
  Divider,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal,
  List,
  ListItem,
  Grid,
  IconButton,
} from "@material-ui/core";

class WP_ImagesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
//      media: [],
      selectedMedia: null,
    };
  }

  componentDidMount() {
    /*console.log('Component Mounted');
    if (this.state.media.length === 0)
      this.fetchMedia(
        this.props.rcp_url.domain + this.props.rcp_url.base_wp_url + "media"
      );*/
  }

  componentDidUpdate() {}

/*  fetchMedia = async (url) => {
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
  };*/ 

  openImage(e, id) {
    e.preventDefault();
    this.setState({
      selectedMedia: this.props.media.filter((el) => el.id === id).pop(),
    });
  }

  render() {
    return (
      <>
        
        <Container className="mt-4">
          
            <div className="col">
{/* Start SHOW IMAGE LIST */}                                
                <ImageList variant="masonry" cols={3} gap={8}>
                    {this.props.media.length !== 0 &&
                      this.props.media.map((item, key) => (
                        <ImageListItem key={key}>
                          <a
                            href="#"
                            className="position-absolute top-0 bottom-0 left-0 right-0"
                            style={{ zIndex: 2 }}
                            onClick={(e) => this.openImage(e, item.id)}
                          ></a>

                          <img
                            src={item.source_url}
                            alt={item.title.rendered}
                          />
                        </ImageListItem>
                      ))}
                  </ImageList>
{/* END SHOW IMAGE LIST */}   

{/* Start show image details */}                
                <Modal open={this.state.selectedMedia !== null}>
                  <>
                    {this.state.selectedMedia !== null && (
                      <div
                        className="position-absolute"
                        style={{
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "80%",
                          height: "80%",
                        }}
                      >
                        <Card className="h-100">
                          <CardHeader className="bg-white d-flex justify-content-between">
                            <h3 className="ml-3">
                              {this.state.selectedMedia.title.rendered}
                            </h3>
                            <IconButton
                              className="p-2 mr-3"
                              onClick={() =>
                                this.setState({ selectedMedia: null })
                              }
                              size="small"
                            >
                              <i
                                className="fa fa-plus"
                                style={{ transform: "rotate(45deg)" }}
                              />
                            </IconButton>
                          </CardHeader>
                          <CardBody
                            className="pl-1 pr-1 mh-100"
                            style={{ overflow: "hidden auto" }}
                          >
                            <Row
                              container
                              spacing={2}
                              className="h-100"
                              style={{ maxHeight: "80%" }}
                            >
                              <Col
                                sm={8}
                                xs={12}
                                className="h-100 d-flex justify-content-center"
                              >
                                <img
                                  className="mw-100 mh-100 h-100"
                                  style={{ objectFit: "contain" }}
                                  src={this.state.selectedMedia.source_url}
                                  alt={
                                    this.state.selectedMedia?.title?.rendered
                                  }
                                />
                              </Col>
                              <Col
                                item
                                sm={4}
                                xs={12}
                                style={{ maxHeight: "80%" }}
                              >
                                <List>
                                  <ListItem className="flex-wrap">
                                    Uploaded on:
                                    <span
                                      className="ml-1 font-weight-600"
                                      style={{ color: "#525f7f" }}
                                    >
                                      {this.state.selectedMedia.modified}
                                    </span>
                                  </ListItem>
                                  <Divider component="li" />
                                  <ListItem className="flex-wrap">
                                    Uploaded by:
                                    <span
                                      className="ml-1 font-weight-600"
                                      style={{ color: "#525f7f" }}
                                    >
                                      {this.state.selectedMedia._embedded
                                        ?.author.length !== 0 &&
                                        this.state.selectedMedia._embedded?.author.pop()
                                          ?.name}
                                    </span>
                                  </ListItem>
                                  <Divider component="li" />
                                  <ListItem className="flex-wrap">
                                    File Name:
                                    <span
                                      className="ml-1 font-weight-600"
                                      style={{ color: "#525f7f" }}
                                    >
                                      {this.state.selectedMedia.title.rendered}
                                    </span>
                                  </ListItem>
                                  <Divider component="li" />
                                  <ListItem className="flex-wrap">
                                    File Type:
                                    <span
                                      className="ml-1 font-weight-600"
                                      style={{ color: "#525f7f" }}
                                    >
                                      {this.state.selectedMedia.mime_type}
                                    </span>
                                  </ListItem>
                                  <Divider component="li" />
                                  <ListItem
                                    className="flex-wrap"
                                    disablePadding
                                  >
                                    Dimensions:
                                    <span
                                      className="ml-1 font-weight-600"
                                      style={{ color: "#525f7f" }}
                                    >
                                      {this.state.selectedMedia.media_details
                                        .width +
                                        " by " +
                                        this.state.selectedMedia.media_details
                                          .width +
                                        " pixels"}
                                    </span>
                                  </ListItem>
                                </List>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </div>
                    )}
                  </>
                </Modal>

        {/* End show image details */}                
              
            </div>
          
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

export default connect(mapStateToProps, mapDispatchToProps)(WP_ImagesList);
