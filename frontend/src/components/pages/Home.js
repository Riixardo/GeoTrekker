import React, { useContext, useEffect } from 'react';
import HomeNavbar from '../HomeNavbar';
import Button from '../PageButton';
import ProfileButton from '../ProfileButton';
import HomeBackground from '../HomeBackground';
import LoggedInContext from '../../contexts/LoggedInContext';

const Home = () => {

  const { loggedIn } = useContext(LoggedInContext);

    // useEffect(() => {
    //     if (sessionStorage.getItem("token")) {
    //         setLoggedIn(true);
    //     }
    // }, []); 

    return (
      <div className="relative flex flex-col min-h-screen z-10">
        <HomeBackground/>
        <div className="relative flex w-full mb-50">
          {/* Empty section to pad left block */}
          <div className="inline-block w-1/3 float-left border-box text-center">
          </div>
          <div className="inline-block w-1/3 float-left border-box text-center">
            <h1 className="text-3xl font-orbitron font-bold">GeoTrekker</h1>
          </div>
          <div className="inline-block w-1/3 float-left border-box text-right">
            { !loggedIn && (<Button page={"/login"} text={"Login"}></Button>)}
            { loggedIn && (
              <div className="flex flex-col items-end">
                <ProfileButton/>
              </div>
              )}
          </div>
        </div>
        <div className="relative flex flex-col h-[calc(100vh-2rem)] items-center justify-center">
          <HomeNavbar></HomeNavbar>
        </div>
      </div>
    );
};

export default Home;