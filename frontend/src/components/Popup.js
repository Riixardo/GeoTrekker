import React from 'react';

const Popup = ({ text, onClick, buttonText}) => {

    return (
        <div className="absolute w-96 h-48 bg-gray-500 z-50 border rounded border-4 text-center flex flex-col items-center">
            <p className="mb-24">{text}</p>
            <button className="w-32 mb-8 border rounded bg-gray-200" onClick={onClick}>{buttonText}</button>
        </div>
    );
};

export default Popup;