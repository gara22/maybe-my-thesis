import Topbar from './components/Topbar/Topbar';

import { Outlet } from 'react-router-dom';
import './index.css';
import { Page } from './components/Page/Page';
import { SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';
import { Button } from '@chakra-ui/react';

function App() {
  const { redirectToSignIn } = useClerk();
  return (
    <>
      <Topbar />
      <SignedIn>
        <Page>
          <Outlet />
        </Page>
      </SignedIn>
      <SignedOut>
        <Button onClick={() => redirectToSignIn()}>sign in</Button>
      </SignedOut>
    </>
  );
}

export default App;
