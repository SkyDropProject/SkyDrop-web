import React from 'react';

const Button = (props) => (
    <button
        onClick={props.onClick}
        className={`inline-flex items-center gap-2 rounded-full  ${props.className}`}
        {...props}
    >
        {props.icon && <img src={props.icon} alt="" className="w-5 h-5" />}
        {props.children}
    </button>
);

export default Button;