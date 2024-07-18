import React from 'react';

const ImageButton = ({ img, alt, className, onClick}) => {

    return (
        <img src={img} alt={alt} className={className} onClick={onClick}/>
    );
};

export default ImageButton;