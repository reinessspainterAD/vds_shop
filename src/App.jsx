import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing/Landing.jsx'
import SignIn from './pages/SignIn/SignIn.jsx'
import SignUp from './pages/SignUp/SignUp.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import ProtectedRoute from './api/ProtectedRoute.jsx'
import Server from './components/DashboardGroup/ActiveServers/Server/Server.jsx'
import Configurator from './pages/Configurator/Configurator.jsx'
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
