import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Chat from './pages/Chat'
import Auth from './components/Auth';

function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/auth' element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
