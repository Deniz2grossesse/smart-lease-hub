import React from 'react';

const FileInputGroup = ({ children }) => {
  return (
    <div className="flex flex-wrap mt-10 gap-5 justify-center">
      {children}
    </div>
  );
};

export default FileInputGroup;