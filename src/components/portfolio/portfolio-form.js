import React, { Component } from 'react';
import axios from 'axios';
import DropzoneComponent from 'react-dropzone-component';

import "../../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../../node_modules/dropzone/dist/min/dropzone.min.css";

export default class PortfolioForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      category: "Personal",
      position: "",
      url: "",
      thumb_image: "",
      banner_image: "",
      logo: "",
      editMode: false,
      apiUrl: "https://zachturner.devcamp.space/portfolio/portfolio_items",
      apiAction: "post"
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.componentConfig = this.componentConfig.bind(this)
    this.djsConfig = this.djsConfig.bind(this)
    this.handleThumbDrop = this.handleThumbDrop.bind(this)
    this.handleBannerDrop = this.handleBannerDrop.bind(this)
    this.handleLogoDrop = this.handleLogoDrop.bind(this)
    this.deleteImage = this.deleteImage.bind(this)

    this.thumbRef = React.createRef();
    this.bannerRef = React.createRef();
    this.logoRef = React.createRef();
  }

  deleteImage(imageType) {
    axios.delete(`https://api.devcamp.space/portfolio/delete-portfolio-image/${this.state.id}?image_type=${imageType}`, {withCredentials: true})
    .then(res => {
      this.setState({
        [`${imageType}_url`]: ""
      })
    })
    .catch(err => {
      console.log('deleteImageErr', err);
    })
  }

  componentDidUpdate() {
    if (Object.keys(this.props.portfolioToEdit).length > 0) {
      const {
        id,
        name,
        description,
        category,
        position,
        url,
        thumb_image_url,
        banner_image_url,
        logo_url
      } = this.props.portfolioToEdit;

      this.props.clearPortfolioToEdit();

      this.setState({
        id: id,
        name: name || "",
        description: description || "",
        category: category || "Personal",
        position: position || "",
        url: url || "",
        editMode: true,
        apiUrl: `https://zachturner.devcamp.space/portfolio/portfolio_items/${id}`,
        apiAction: "patch",
        thumb_image_url: thumb_image_url || "",
        banner_image_url: banner_image_url || "",
        logo_url: logo_url || ""
      });
    }
  }

  handleBannerDrop() {
    return {
      addedfile: file => this.setState({ banner_image: file })
    }
  }

  handleLogoDrop() {
    return {
      addedfile: file => this.setState({ logo: file })
    }
  }

  handleThumbDrop() {
    return {
      addedfile: file => this.setState({ thumb_image: file })
    }
  }

  componentConfig() {
    return {
      iconFileTypes: [".jpg", ".png"],
      showFIletypeIcon: true,
      postUrl: "https://httpbin.org/post"
    }
  }

  djsConfig() {
    return {
      addRemoveLinds: true,
      maxFiles: 1
    }
  }

  buildForm() {
    let formData = new FormData();

    formData.append("portfolio_item[name]", this.state.name);
    formData.append("portfolio_item[description]", this.state.description);
    formData.append("portfolio_item[url]", this.state.url);
    formData.append("portfolio_item[category]", this.state.category);
    formData.append("portfolio_item[position]", this.state.position);

    if (this.state.thumb_image) {
      formData.append("portfolio_item[thumb_image]", this.state.thumb_image);
    }

    if (this.state.banner_image) {
      formData.append("portfolio_item[banner_image]", this.state.banner_image);
    }

    if (this.state.logo) {
      formData.append("portfolio_item[logo]", this.state.logo);
    }

    return formData;
  }

  characterLimit() {
    this.setState({
      description
    })
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  
  handleSubmit(event) {
    event.preventDefault()
    axios({
      method: this.state.apiAction,
      url: this.state.apiUrl,
      data: this.buildForm(),
      withCredentials: true
    })
      .then(response => {
        if (this.state.editMode) {
          this.props.handleEditFormSubmission();
        } else {
          this.props.handleNewFormSubmission(response.data.portfolio_item)
        }
        console.log("here's state before the change", this.state);
        
        this.setState({
          name: "",
          description: "",
          category: "Personal",
          position: "",
          url: "",
          thumb_image: "",
          banner_image: "",
          logo: "",
          editMode: true,
          apiUrl: `https://zachturner.devcamp.space/portfolio/portfolio_items`,
          apiAction: "post"
        }); 
        console.log("here's state after the change", this.state);
        
        [this.thumbRef, this.bannerRef, this.logoRef].forEach(ref => {
          ref.current.dropzone.removeAllFiles();
        })
      }).catch(error => {
        console.log("API handleSubmit error in portfolio-form", error);
      })
      
   

  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className='portfolio-form-wrapper'>
        <div className='two-column'>
          <input
            type='text'
            name='name'
            placeholder='Portfolio Item Name'
            value={this.state.name}
            onChange={this.handleChange}
          />

          <input
            type='text'
            name='url'
            placeholder='URL'
            value={this.state.url}
            onChange={this.handleChange}
          />
        </div>

        <div className='two-column'>
          <input
            type='text'
            name='position'
            placeholder='Position '
            value={this.state.position}
            onChange={this.handleChange}
          />

          <select
            name='category'
            placeholder='Category'
            value={this.state.category}
            onChange={this.handleChange}
            className='select-element'
          >
            <option value="Personal">Personal</option>
            <option value="Scheduling">Scheduling</option>
            <option value="School">School</option>
          </select>
        </div>

        <div className='one-column'>
          <textarea
            type='text'
            name='description'
            placeholder='Description'
            maxLength={250}
            value={this.state.description}
            onChange={this.handleChange}
          />
        </div>

        <div className='image-uploaders three-column'>

          {this.state.thumb_image_url && this.state.editMode ? (
            <div className='portfolio-manager-image-wrapper'>
              <img src={this.state.thumb_image_url} />

              <div className='image-removal-link'>
                <a onClick={() => this.deleteImage("thumb_image")}>
                  Remove File 
                </a>
              </div>
            </div>
          ) : (
            <DropzoneComponent
              ref={this.thumbRef}
              config={this.componentConfig()}
              djsConfig={this.djsConfig()}
              eventHandlers={this.handleThumbDrop()}
            >
              <div className='dz-message'>Thumbnail</div>
            </DropzoneComponent>
          )}
 
          {this.state.banner_image_url && this.state.editMode ? (
            <div className='portfolio-manager-image-wrapper'>
              <img src={this.state.banner_image_url} />

              <div className='image-removal-link'>
                <a onClick={() => this.deleteImage("banner_image")}>
                  Remove File
                </a>
              </div>
            </div>
          ) : (
            <DropzoneComponent
              ref={this.bannerRef}
              config={this.componentConfig()}
              djsConfig={this.djsConfig()}
              eventHandlers={this.handleBannerDrop()}
            >
              <div className='dz-message'>Banner</div>
            </DropzoneComponent>
          )}
          
          {this.state.logo_url && this.state.editMode ? (
            <div className='portfolio-manager-image-wrapper'>
              <img src={this.state.logo_url} />

              <div className='image-removal-link'>
                <a onClick={() => this.deleteImage("logo")}>
                  Remove File
                </a>
              </div>
            </div>
          ) : (
            <DropzoneComponent
              ref={this.logoRef}
              config={this.componentConfig()}
              djsConfig={this.djsConfig()}
              eventHandlers={this.handleLogoDrop()}
            >
              <div className='dz-message'>Logo</div>
            </DropzoneComponent>
          )}

        </div>

        <div>
          <button className='btn' type='submit'>Save</button>
        </div>
      </form>
    );
  }
}