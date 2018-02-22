import React from 'react';

const MediaViewer = ({mediaUrl}) => {
  if(!mediaUrl) return null;

  if(mediaUrl.indexOf('.mp3') !== -1) {
    return <audio src={mediaUrl} controls />
  } else if(mediaUrl.indexOf('.jpg') !== -1 || mediaUrl.indexOf('.png') !== -1) {
    return <img src={mediaUrl} style={{ maxWidth: '100%'}} />
  } else if(mediaUrl.indexOf('.mp4') !== -1) {
    return <video controls="true" src={mediaUrl} style={{ maxWidth: '100%'}} />
  } else {
    return null;
  }
}

export default MediaViewer;
