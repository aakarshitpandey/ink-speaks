import React from 'react';
import './App.css';
import 'react-quill/dist/quill.snow.css'
import Landing from './components/Landing';
import NavBar from './components/Navigation';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import * as ROUTES from './routes/index'
import Dashboard from './components/Dashboard';
import Compose from './components/ComposeArticle';
import Blog from './components/Blog';

const App = () => (
  <Router>
    <div className="App">
      <Route path={`${ROUTES.landing}`} component={NavBar} />
      <Route exact path={`${ROUTES.landing}`} component={Landing} />
      <Route path={`${ROUTES.dashboard}`} component={Dashboard} />
      <Route path={`${ROUTES.addArticle}`} component={Compose} />
      <Route path={`${ROUTES.article}/:id`} component={Blog} />
    </div>
  </Router>
)

export default App;
