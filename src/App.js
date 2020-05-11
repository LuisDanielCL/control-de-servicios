import React from 'react';
import Product from 'js/product';
import Service from 'js/service';
import 'styles/app.scss';

import { BrowserRouter, Route, Switch } from "react-router-dom";


//7a6393c8-d447-42c4-a96c-c878293f246a
function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <div className="menu">
          <a href="/product">Productos</a>
          <a href="/service">Servicios</a>
        </div>
        <Switch>
          <Route path="/product">
            <Product/>
          </Route>
          <Route path="/service">
            <Service/>
          </Route>
        </Switch>
      </div>
    </BrowserRouter>

  );
}

export default App;
