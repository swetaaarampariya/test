'use client';
import useWidth from '@/configs/common/useWidth';


interface PromptModalProps {
  show: boolean;
  toggleModal: () => void;
  onActive: (values: { payableAmount?: string; remark?: string; feedback?: string }) => void;
  setPromptData?: (data: any) => void;
  modalTitle: string;
  yes: string;
  no: string;
  setFeedback?: (value: string) => void;
  rejectTextField?: boolean;
  setApproveRemark?: (value: string) => void;
  approveTextField?: boolean;
  isEditing?: boolean;
  setAmount?: (value: string) => void;
  limitPrice?: number;
  collapsed?:boolean;
}

const PromptModal: React.FC<PromptModalProps> = ({
  show,
  toggleModal,
  setPromptData,
  yes,
  no,
  collapsed,
}) => {
  const { width, breakpoints } = useWidth();


  const switchHeaderClass = () => {
    if (collapsed) {
      return 'ltr:ml-[72px] rtl:mr-[72px]';
    } else {
      return 'ltr:ml-[248px] rtl:mr-[248px]';
    }
  };

  const handleClose = () => {
    if (setPromptData) {
      setPromptData({});
    }
    toggleModal();
  };


  return (
    <div
      className={`flex items-center justify-center z-[1000] ${show ? '' : 'hidden'} p-4 overflow-x-hidden overflow-y-auto inset-0 h-[calc(100%-1rem)] 
      max-h-full absolute backdrop-blur-[1px] bg-opacity-40 bg-black-500 ${width && width > breakpoints.lg ? switchHeaderClass() : ''} h-screen`}
    >
      <div className="relative w-full max-w-3xl max-h-full">
        <div className="relative animate-slide-down bg-white rounded-lg shadow dark:bg-gray-700 mt-[5rem] z-50">
         
        <div className="text-center text-white py-10">
                      <button type="button" className="uppercase btn-secondary font-bold px-8 mr-5" onClick={handleClose}>
                        {no}
                      </button>
                      <button type="submit" className="uppercase btn-danger font-bold ml-2 px-8"
                      
                      >
                        {yes}
                      </button>
                    </div>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
