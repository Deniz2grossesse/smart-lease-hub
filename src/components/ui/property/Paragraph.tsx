import React from 'react';

export const ParagraphTitle = ({ children }) => {
  return <h2 className="text-xl font-bold mb-4">{children}</h2>;
};

export const ParagraphContent = ({ children }) => {
  return <p className="text-gray-600 mb-4">{children}</p>;
};

export const Paragraph = ({ children }) => {
  return (
    <div className="hover:bg-gray-50 duration-200 p-4 rounded-xl mt-5 mb-5">
      {children}
    </div>
  );
};