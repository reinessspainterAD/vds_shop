import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './components/Landing/BodyGroup/Landing/Landing.jsx'
import SignIn from './components/Sign_in_up/SignIn/SignIn.jsx'
import SignUp from './components/Sign_in_up/SignUp/SignUp.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import ProtectedRoute from './api/ProtectedRoute.jsx'
import Server from './components/Dashboard/ActiveServers/Server/Server.jsx'
import Configurator from './components/Configurator/Configurator.jsx'
import './App.css'

function App() {

  return (
    <section className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}></Route>
          <Route path='/register' element={<SignUp />}></Route>
          <Route path='/login' element={<SignIn />}></Route>
          <Route 
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }>
          </Route>
          <Route
            path='/dashboard/vm/:vmid'
            element={
              <ProtectedRoute>
                <Server/>
              </ProtectedRoute>
            }>
          </Route>
          <Route
            path='/configurator'
            element={
              <ProtectedRoute>
                <Configurator/>
              </ProtectedRoute>
            }>
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <Header />
      <Body />
      <Footer /> */}



    </section>
  )
  
}

export default App
