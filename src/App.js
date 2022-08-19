import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Chat from './pages/Chat'
import Auth from './components/Auth';

function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/auth' element={<Auth />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
