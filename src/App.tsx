import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import { httpGet } from './utils/http'
import classes from './app.module.scss'
import Topbar from './components/Topbar/Topbar'


function App() {
  const [count, setCount] = useState(0)


  useEffect(() => {
    httpGet('/classrooms').then((res: any) => console.log(res.data)
      // axios.get('http://localhost:3000/classrooms').then(res => console.log(res)
    )
    // )
  }, [])

  return (
    <>
      <Topbar />
      <main className={classes.container}>
        asd
    </main>
    </>
  )
}

export default App
