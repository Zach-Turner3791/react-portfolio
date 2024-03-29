import React from 'react';
import profilePicture from "../../../static/assets/images/bio/Sam.jpg";

export default function() {
  return (
    <div className='content-page-wrapper'>
        <div 
        className='left-column' 
        style={{
          background: "url(" + profilePicture + ") no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
        />
        <div className='right-column'>
        I have honed my software development skills through "Bottega University". My background is largely in operations, but I am currently in school to further my education in full-stack development. I have a strong passion for coding and have acquired skills in HTML, CSS, SCSS, JavaScript, Python, MySQL, and Git. I am eager to use my skills to contribute to the tech industry and make a meaningful impact. My ultimate goal is to become a reliable and efficient software engineer who can deliver high-quality products. When I'm not coding, I love immersing myself in the world of fantasy, particularly the works of J.R.R. Tolkien.
        </div>
    </div>
  );
}