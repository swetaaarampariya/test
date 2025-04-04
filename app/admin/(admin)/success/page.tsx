import Image from 'next/image';

export default function Success() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 md:p-28">
      <div className="md:w-[600px] md:h-[500px] md:flex md:justify-center md:flex-col w-auto h-auto p-6 text-center shadow-lg bg-white rounded-2xl">
        
        
        <div className="flex justify-center my-6">
          <Image src="/Image/Success.svg" alt="Thank You" width={200} height={200} />
        </div>

        <h1 className="text-gray-600 font-semibold text-[20px] mt-2">
        Your Password Has Been Updated Successfully.
        </h1>
      </div>
    </div>
  );
}
