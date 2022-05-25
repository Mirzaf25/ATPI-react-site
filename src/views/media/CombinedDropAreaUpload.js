import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import {
  Button,
  ImageList,
  ImageListItem,
  CircularProgress,
} from "@material-ui/core";
import WP_ImagesList from "../../components/Utils/WP_ImagesList";



class CombinedDropAreaUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      media: [],
      selectedMedia: null,
      uploadFiles: [],
      uploading: false,
      uploadAreaOpen: false,
    };
    this.handleFiles = this.handleFiles.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.highlight = this.highlight.bind(this); 
    this.unhighlight = this.unhighlight.bind(this); 
  }
  

  componentDidMount() {
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


  handleFiles(e) {
    var files = e.dataTransfer == undefined ?  e.target.files : e.dataTransfer.files ;


    if (files !== undefined && typeof this.props.rcp_url === "object") {
      
      Object.values(files).forEach(this.uploadFile);
    } else {
      this.refs.dropArea !== undefined &&
      this.refs.dropArea.classList.remove("highlight");
    }
  }


  uploadFile(file) {

    this.setState({ uploading: true, uploadFiles: [...this.state.uploadFiles, file] });

    let formData = new FormData();

    formData.append("file", file);
    formData.append("title", file.name);
    
    fetch(
      this.props.rcp_url.domain + this.props.rcp_url.base_wp_url + "media",
      {
        method: "post",
        headers: {
          Authorization: "Bearer " + this.props.user.token,
        },
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState((prevState) => {
          return {
            media: [data, ...prevState.media],
            uploading: false,
            uploadFiles: [],
          };
        });
      }).then(()=>{
        this.props.updateFunc(this.state.media);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ uploading: false, uploadFiles: [] });
      });

  }

  highlight(e) {
    e.preventDefault();
    e.stopPropagation();
    this.refs.dropArea.classList.add("highlight");
  }

  unhighlight(e) {
    e.preventDefault();
    e.stopPropagation();
    this.refs.dropArea.classList.remove("highlight");
  }

  handleDrop(e) {
    e.persist();
    e.preventDefault();
    e.stopPropagation();
    this.handleFiles(e);
  }

  render() {
    var uploadedFilesPreview = this.state.uploadFiles;
    return (
      <>
     <Container>
          
          <Col>
          
          <Row>
            <div className="col">

                  <div
                    style={{
                      display: "block",
                      transform: "scaleY(1)",
                      transition: "all 0.5s ease-out",
                    }}
                   ref={"dropArea"}
                    id="drop-area"
                    onDragEnter={(e) => this.highlight(e)}
                    onDragOver={(e) => this.highlight(e)}
                    onDragLeave={(e) => this.unhighlight(e)}
                    onDrop={e=>this.handleDrop(e)}
                  >
                    <form className="my-form">
                      <p>
                        Upload (multiple files -- will be done) single file with
                        the file dialog or by dragging and dropping images onto
                        the dashed region
                      </p>
                      <input
                        type="file"
                        id="fileElem"
                        ref="fileInput"
                        // multiple --- add after loading icon issue resolve
                        accept="image/*"
                        onChange={e=>this.handleFiles(e)}
                      />
                      <label className="button" htmlFor="fileElem">
                        Select some files
                      </label>
                    </form>
                    <Row>
                      <ImageList gap={8}>

                        {uploadedFilesPreview.length !== 0 &&
                          uploadedFilesPreview.map((item, key) => (
                            <ImageListItem
                              className="position-relative"
                              key={key}
                            >
                              {this.state.uploading && (
                                <CircularProgress
                                  className="position-absolute top-50 left-50"
                                  style={{
                                    top: "50%",
                                    left: "50%",
                                    zIndex: 2,
                                  }}
                                />
                              )}
                              <img
                                className="mw-100"
                                style={{ objectFit: "cover" }}
                                src={window.URL.createObjectURL(item)}
                              />
                            </ImageListItem>
                          ))}
                      </ImageList>
                    </Row>
                  </div>
            </div>
          </Row>

          <WP_ImagesList media = {this.state.media}/>
          </Col>


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

export default connect(mapStateToProps, mapDispatchToProps)(CombinedDropAreaUpload);
