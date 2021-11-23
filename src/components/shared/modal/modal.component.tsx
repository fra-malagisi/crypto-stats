import React from 'react';
import { ModalProps } from 'types';

const Modal = ({ title, show, content, onClose }: ModalProps): JSX.Element => {
  if (!show) {
    return <></>;
  }

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-gray-50 rounded">
        <div className="p-6">
          <h4 className="m-0 font-bold">{title}</h4>
        </div>
        <div className="p-6 border-t-2 border-b-2"> {content}</div>
        <div className="p-6">footer</div>
      </div>
    </div>
  );
};

export default Modal;
