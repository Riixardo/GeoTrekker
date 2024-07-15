import React from 'react';
import HomeNavbar from './HomeNavbar';
import Button from './Button';


const Home = () => {
    return (
      <div className="flex flex-col items-center font-orbitron w-full min-h-screen">
      <div className='flex w-full'>
        {/* Empty section to pad left block */}
        <div className="inline-block w-1/3 float-left border-box text-center">
        </div>
        <div className="inline-block w-1/3 float-left border-box text-center">
          <h1 className="text-2xl">Home Page</h1>
        </div>
        <div className="inline-block w-1/3 float-left border-box text-right">
          <Button page={"/login"} text={"Login"}></Button>
        </div>
      </div>
        <div className="flex flex-col items-center justify-center">
          <HomeNavbar></HomeNavbar>
        </div>
      </div>
    );
};

export default Home;