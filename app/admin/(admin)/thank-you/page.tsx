"use client"
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ThankYou() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
      <div className="w-screen flex flex-col justify-center items-center m-10 md:h-screen h-auto  p-4 text-center shadow-lg bg-white rounded-2xl">
        <h1 className="text-[40px] font-medium">Welcome to <span className='text-textPrimary-green'>Gravitrain</span> </h1>
        <p className="text-textPrimary-grey mt-8 text-[18px] font-normal">
          Your registration is complete. We’ll review your information and get back to you <br />shortly via email. Stay tuned!
        </p>

        <div className="flex justify-center my-6">
          <Image src="/Image/ThankYou.svg" alt="Thank You" width={200} height={200} />
        </div>

        {role === "Facility Manager" ?
          (<button className="mt-4 h-[79px] text[20px] pl-6 p-4 bg-background-green  text-white font-medium py-2 rounded-lg"
            onClick={() => router.push('/admin/login')}>
            Login Facility Manager
          </button>)
          :
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 my-4">
            <Image
              src="/Image/GooglePlayStore.svg"
              alt="Google Play Store"
              width={200}
              height={60}
              className="sm:w-[256px] sm:h-[80px]"
            />
            <Image
              src="/Image/ApplePlayStore.svg"
              alt="App Store"
              width={200}
              height={60}
              className="sm:w-[256px] sm:h-[80px]"
            />
          </div>
        }
      </div>
    </div>
  );
}
