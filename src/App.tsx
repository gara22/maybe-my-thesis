import React, { useEffect, useState } from 'react'
import Topbar from './components/Topbar/Topbar'

import {
  Outlet,
} from "react-router-dom";
import "./index.css";
import { Page } from './components/Page/Page'


function App() {
  const [] = useState(0)


  // useEffect(() => {
  //   httpGet('/classrooms').then((res: any) => console.log(res.data)
  //     // axios.get('http://localhost:3000/classrooms').then(res => console.log(res)
  //   )
  //   // )
  // }, [])

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
