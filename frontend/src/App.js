import React, { useEffect, useContext } from 'react';
import axios from "axios";
import AppRouter from './AppRouter';
import LoggedInProvider from './contexts/LoggedInProvider';
import LoggedInContext from './contexts/LoggedInContext';

const PreApp = () => {

    const { setLoggedIn } = useContext(LoggedInContext);

    useEffect(() => {
        const handleBeforeUnload = async (event) => {
            // using !loggedIn sometimes doesn't work?? Maybe the state is cleared before this function executes??
            if (!sessionStorage.getItem("token")) {
                return;
            }
            const response = await axios.post("/api/logout", { token: sessionStorage.getItem("token") });
            if (response.data.code === 1) {
                console.log("Successful logout");
            }
        };

        const handleResumeSession = async () => {
            const response = await axios.post("/api/resume-session", { token: sessionStorage.getItem("token"), user_id: JSON.parse(sessionStorage.getItem("userData")).user_id });
            if (response.data.code === 1) {
                console.log("Successfully resumed session");
            }
        }

        if (sessionStorage.getItem("token")) {
            handleResumeSession();
            setLoggedIn(true);
        }

    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
        };
      }, []);

    return (
        <AppRouter />
    );
};

const App = () => {
    return (
        <LoggedInProvider>
            <PreApp/>
        </LoggedInProvider>
    )
}

export default App;