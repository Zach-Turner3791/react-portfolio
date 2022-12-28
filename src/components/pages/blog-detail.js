import React, { Component } from 'react';
import Axios from 'axios';
import axios from 'axios';

export default class BlogDetail extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
    currentId: this.props.match.params.slug,
    blogItem: {}
   }
  }

    getBlogItem() {
      axios.get(`https://zachturner.devcamp.space/portfolio/portfolio_blogs/${this.state.currentId}`)
      .then(response =>  {
        this.setState({blogItem: response.data.portfolio_blog})
      })
      .catch(err => {
        console.log("error", err);
      })
    }

    componentDidMount() {
      this.getBlogItem()
    }


  render() {
    const {
      title,
      content,
      featured_image_url,
      blog_status
    } = this.state.blogItem;

    return (
      <div className='blog-container'>
        <div className='content-container'>
          <h1>{title}</h1>

          <div className='featured-image-wrapper'>
            <img src={featured_image_url} />
            <div className='content'>
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }
}