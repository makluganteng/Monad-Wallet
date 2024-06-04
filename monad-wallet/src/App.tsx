import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './page/Login'
import MainPage from './page/MainPage'

function App() {

  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main-page" element={<MainPage />} />
      </Routes>
  )
}

export default App
