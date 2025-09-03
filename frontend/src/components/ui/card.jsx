import React from "react";

const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg p-5 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
