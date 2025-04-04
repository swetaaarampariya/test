import { CgSpinner } from 'react-icons/cg';

export default function Loading() {
  return (
    <div className='flex justify-center items-center w-full gap-2 text-lg'>
      <CgSpinner className='animate-spin' size={30} />
    </div>
  );
}
