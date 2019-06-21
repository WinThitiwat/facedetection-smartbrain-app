import React from 'react';
import './ImageLinkForm.css';

// ImageLinkForm component - a form to detect image's input event, such as text field for url, and detect button
// and callback to its parent to set new state of input
const ImageLinkForm = ({onInputChange, onPictureSubmit}) => {
  return(
    <div>
      <p className='f3'>
        {'This Magic Brain will detect faces in your pictures. Give it a try!'}
      </p> 
      <div className='center'>
        <div className='form center pa4 br3 shadow-5'>
          <input type='tex' className='f4 pa2 w-70 center' onChange={onInputChange}/>
          <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
          onClick={onPictureSubmit}
          >Detect</button>
        </div>
      </div>
    </div>
  );
}

export default ImageLinkForm;