import Topbar from './components/Topbar/Topbar'

import {
  Outlet,
} from "react-router-dom";
import "./index.css";
import { Page } from './components/Page/Page'


function App() {
  return (
    <>
      <Topbar />
      <Page>
        <Outlet />
      </Page>
    </>
  )
}

export default App
