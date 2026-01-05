import React, { useState } from 'react'; // 1. Import useState
import Footer from '../../../components/Footer';
import AuthenticatedNav from '../../../components/AuthenticatedNav';
import SAMPLE from "../../../assets/image 8.png";
import { IoMdAdd } from "react-icons/io";
import ProductModal from './ProductModal'; // 2. Import your Modal Component

const Index = () => {
  // 3. Create state to track if modal is open or closed
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
        <div className="relative w-full max-w-[90rem] p-6 text-white">
          <AuthenticatedNav />

          <div className="py-4">
            <div className="flex justify-end gap-5">
              <button 
                // 4. Add onClick handler to open the modal
                onClick={() => setIsModalOpen(true)}
                className='flex w-full sm:w-auto items-center border px-2 py-4 text-sm rounded-lg hover:bg-white/10 transition'
              >
                <IoMdAdd className="mr-2" /> 
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-5 gap-10 py-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                <div
                  className="group w-full bg-[#290B54] p-4 flex flex-col justify-center border border-purple-200/40 rounded-2xl 
             transition-transform duration-300 hover:scale-110 relative z-10 cursor-pointer"
                  key={c}
                >
                  <div className="w-full flex justify-center">
                    <img
                      src={SAMPLE}
                      alt=""
                      className="w-[70%] transition-transform duration-500 ease-out group-hover:scale-150 relative z-20"
                    />
                  </div>
                  <div>
                    <p>CSP-S Pin</p>
                    <p>&#8369;30</p>
                    <p className="text-[gray] mt-2">Stock 10</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Render the Modal and pass the state props */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <Footer />
    </>
  );
}

export default Index;