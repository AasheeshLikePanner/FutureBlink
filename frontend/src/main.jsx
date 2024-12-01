import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store/store.js';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Home.jsx';
import AuthTabs from './components/AuthTabs.jsx';
import EmailFlowchart from './components/EmailFlowchart.jsx';
import ReadOnlyFlowchart from './components/ReadOnlyFlowChart.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='/home' element={<Homepage/>}/>  
        <Route path='/workspace' element={<EmailFlowchart/>}/>
        <Route path='/new-flowchart' element={<EmailFlowchart/>}/>
        <Route path='/flowchart/:id?' element={<ReadOnlyFlowchart/>}/>
      </Routes>      
    </Router>
  </Provider>
)
