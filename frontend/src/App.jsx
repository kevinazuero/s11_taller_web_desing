import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from "./pages/Tasks";
import Home from "./pages/Home";
import PersonsPage from "./pages/Person";



function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/Home" element={<Home />} />
        <Route path="/person" element={<PersonsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;