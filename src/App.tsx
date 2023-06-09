import './App.css';
import Upload from './views/Upload';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Nav from './views/components/Nav';
import Home from './views/Home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Nav />}>
            <Route path='/' element={<Home />}></Route>
            <Route path='/upload' element={<Upload />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
