import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'

import AppBar from 'components/AppBar'
import './App.css'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <AppBar />
      </BrowserRouter>
    );
  }
}

export default App;
