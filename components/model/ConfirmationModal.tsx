import React from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { BsExclamationCircle } from 'react-icons/bs';

type Props = {
  toggleModal: () => void;
  onActive: () => void;
  confirmMsg?: string;
};

const ConfirmationModal = ({ toggleModal, onActive, confirmMsg }: Props) => {
  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto backdrop-blur-[2px] bg-opacity-40 bg-black-500'>
      <div className='relative w-full max-w-2xl max-h-full'>
        <div className='relative animate-slide-down bg-white rounded-lg mt-[5rem] z-50'>
          <div className='flex items-center justify-between p-6  rounded-t '>
            <h3 className='text-xl font-semibold text-title  uppercase'>confirm</h3>
            <button
              className=' w-7 h-7 rounded-md bg-sidebar-color flex items-center justify-center text-white'
              onClick={toggleModal}
            >
              <IoCloseSharp size={25} />
            </button>
          </div>
          <hr className='border-gray-200/25' />
          <div className='p-6'>
            <div className='flex flex-col justify-center'>
              <BsExclamationCircle size={76} className='text-warning-400 inline-block justify-center w-full mb-5' />
              <div className='text-center mb-5'>
                <h5>Are you sure?</h5>
                <p className='text-sm p-3'>{confirmMsg ? confirmMsg : 'Do you really want to do this action?'}</p>
              </div>
              <div className='text-center space-x-4'>
                <button type='button' className='btn-primary' onClick={() => onActive()}>
                  Yes
                </button>
                <button
                  type='button'
                  className='btn-secondary'
                  onClick={() => {
                    toggleModal();
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
