import React from 'react';
import './App.css';
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Landing from './components/Landing';
import NavBar from './components/Navigation';
import * as ROUTES from './routes/index'
import Dashboard from './components/Dashboard';
import Compose from './components/ComposeArticle';
import Blog from './components/Blog';
import MyAccount from './components/MyAccount';
import PrivacyPolicy from './components/Policy/privacypolicy'
import Terms from './components/Policy/terms'

const App = () => (
  <Router>
    <div className="App">
      <Route path={`${ROUTES.landing}`} component={NavBar} />
      <Route exact path={`${ROUTES.landing}`} component={Landing} />
      <Route path={`${ROUTES.dashboard}`} component={Dashboard} />
      <Route path={`${ROUTES.addArticle}`} component={Compose} />
      <Route path={`${ROUTES.article}/:id`} component={Blog} />
      <Route path={`${ROUTES.myaccount}`} component={MyAccount} />
      <Route path={`${ROUTES.terms}`} component={Terms} />
      <Route path={`${ROUTES.privacy}`} component={PrivacyPolicy} />
    </div>
  </Router>
)

export default App;
