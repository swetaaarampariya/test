import React from 'react';
import { RxCross2 } from 'react-icons/rx';

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
            <h3 className='text-lg font-semibold text-textPrimary-grey capitalize'>General Confirmation</h3>
            <button
              className=' w-7 h-7 rounded-md  flex items-center justify-center text-textPrimary-grey'
              onClick={toggleModal}
            >
              <RxCross2 size={25} />
            </button>
          </div>
         

          {/* Gradient Border */}
        <div className="w-full h-[1px] bg-gradient-to-r from-[#0000001A] via-[#000000] to-[#0000001A]"></div>
      
          <div className='p-6'>
            <div className='flex flex-col justify-center'>
            
              <div className='text-center mb-5'>
                
                <p className='text-[28px] p-3 text-textPrimary-150'>{confirmMsg ? confirmMsg : 'Are you sure you want to proceed?'}</p>
              </div>
              <div className='flex text-center items-center justify-center space-x-4 mb-8'>
                 <button type='button' className="bg-background-grey w-[132px] text-white text-xl px-4 py-2 rounded flex items-center justify-center gap-1 shadow "
                             onClick={() => onActive()}
                            >
                             Yes
                            </button>
                            <button type='button' className="bg-background-btnred w-[132px] text-white text-xl px-4 py-2 rounded flex items-center justify-center gap-1 shadow"
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
