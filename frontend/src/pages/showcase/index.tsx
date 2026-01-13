import React from "react";
import Layout from "../../components/Layout";
import AuthenticatedNav from "../../components/AuthenticatedNav";
import Carousel from "./Carousel";

const index = () => {
  return (
    <Layout overflowHidden={true}>
      <AuthenticatedNav />

      <div className="py-10">
        <div className="text-center w-[39rem] mx-auto">
          <p className="text-3xl md:text-3xl font-semibold text-white leading-tight tracking-wider">
            Celebrating milestones, sharing moments — your journey, our
            highlights.
          </p>
        </div>
        <div className="w-full h-screen absolute right-0">
          <Carousel>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 max-w-4xl w-full p-4">
              <p className="font-bold text-xl text-center">
                Dean’s Lister 2nd Semester A.Y. 2024 - 2025
              </p>
              <p className="text-center text-xs">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </Carousel>

          
        </div>
       
      </div>
    </Layout>
  );
};

export default index;
