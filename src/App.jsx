import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './components/Landing/BodyGroup/Landing/Landing.jsx'
import SignIn from './components/Sign_in_up/SignIn/SignIn.jsx'
import SignUp from './components/Sign_in_up/SignUp/SignUp.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import './App.css'

function App() {

  return (
    <section className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}></Route>
          <Route path='/register' element={<SignUp />}></Route>
          <Route path='/login' element={<SignIn />}></Route>
          <Route path='/dashboard'element={<Dashboard/>}></Route>
          <Route path='/configurator'element={<></>}></Route>
        </Routes>
      </BrowserRouter>
      {/* <Header />
      <Body />
      <Footer /> */}



    </section>
  )
  
}

export default App
