import { useState } from "react";
import Image from "next/image";

interface CertificateUploaderProps {
    onUploadSuccess: (updatedList: string[]) => void;
    documentList: string[];
    filePath: string;
}

const CertificateUploader: React.FC<CertificateUploaderProps> = ({ onUploadSuccess, documentList, filePath }) => {
    const API_URL_AUTH = process.env.NEXT_PUBLIC_APP_API_URL + "/api";
    const [currentDocs, setCurrentDocs] = useState<string[]>(documentList);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);

        if (selectedFiles.length > 0) {
            await handleUpload(selectedFiles);
        }
    };

    const handleUpload = async (selectedFiles: File[]) => {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("certificates", file));
        try {
            const response = await fetch(`${API_URL_AUTH}/user/upload-certificates`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            console.log("Upload Response:", data);

            const updatedDocs = [...currentDocs, ...data?.data];
            setCurrentDocs(updatedDocs);
            onUploadSuccess(updatedDocs);
        } catch (error) {
            console.log('error :>> ', error);
        } finally {
            // setUploading(false);
        }
    };

    const handleDelete = (fileName: string) => {
        const updatedDocs = currentDocs.filter((doc) => doc !== fileName);
        setCurrentDocs(updatedDocs);
        onUploadSuccess(updatedDocs);
    };
    

    return (
        <div className="mt-8 p-6 bg-white">
            <h3 className="text-lg font-semibold text-textPrimary-150 mb-8">Certificates</h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-4 border-none bg-[#ECEDF2] p-6 rounded-lg flex flex-col items-center text-gray-500 w-full">
                    <div className="border-dashed border-2 pt-10 border-[#5799D9] bg-white w-full h-[150px] flex flex-col justify-center items-center rounded-lg mb-1">
                        <input type="file" multiple accept=".pdf,.jpg,.png" className="hidden" id="certificate-upload" onChange={handleFileChange} />
                        <label htmlFor="certificate-upload" className="cursor-pointer">
                            <Image
                                    src="/Image/Document.svg"
                                    alt="certificate"
                                    width={55}
                                    height={55}
                                />

                            <p className="text-sm text-center capitalize">
                                Drop your file(s) here, or <span className="text-blue-500 cursor-pointer">Browse</span>
                            </p>
                        </label>
                    </div>
                </div>
                <div className="hidden md:block md:col-span-1 h-full w-[2px] bg-gradient-to-t from-[#37695F1A] via-[#37695F] to-[#37695F1A] mx-auto"></div>
                <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentDocs.map((doc, index) => (
                        <div key={index} className="bg-white p-6 flex items-center gap-4">
                            <span className="text-[#A4A4A4] text-3xl">
                                <Image
                                    src="/Image/Certificate.svg"
                                    alt="certificate"
                                    width={43}
                                    height={55}
                                />
                            </span>
                            <a href={`${filePath}/${doc}`} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-[#4C4C5C] hover:underline">
                                Certificate {index + 1}
                            </a>
                            <button onClick={() => handleDelete(doc)} className="ml-3 text-red-500 hover:text-red-700">
                            <Image
                                    src="/Image/Trash.svg"
                                    alt="certificate"
                                    width={16}
                                    height={16}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CertificateUploader;