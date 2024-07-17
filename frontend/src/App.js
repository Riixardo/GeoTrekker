import React from 'react';
import AppRouter from './AppRouter';
import { TokenProvider } from './providers/TokenProvider';

const App = () => {

    return (
      <TokenProvider>
        <AppRouter />
      </TokenProvider>
    );
};

export default App;