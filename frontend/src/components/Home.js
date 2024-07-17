import React, { useState, useEffect } from 'react';
import HomeNavbar from './HomeNavbar';
import Button from './PageButton';
import ProfileButton from './ProfileButton';

const Home = () => {

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            setLoggedIn(true);
        }
    }, []); 

    return (
      <div className="flex flex-col min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/landscape.webp')" }}>
        <div className="flex w-full mb-50">
          {/* Empty section to pad left block */}
          <div className="inline-block w-1/3 float-left border-box text-center">
          </div>
          <div className="inline-block w-1/3 float-left border-box text-center">
            <h1 className="text-2xl font-orbitron">Home Page</h1>
          </div>
          <div className="inline-block w-1/3 float-left border-box text-right">
            { !loggedIn && (<Button page={"/login"} text={"Login"}></Button>)}
            { loggedIn && (
              <div className="flex flex-col items-end">
                <ProfileButton></ProfileButton>
              </div>
              )}
          </div>
        </div>
        <div className="flex flex-col h-screen items-center justify-center">
          <HomeNavbar></HomeNavbar>
        </div>
      </div>
    );
};

export default Home;