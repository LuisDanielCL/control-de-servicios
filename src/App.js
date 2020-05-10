import React from 'react';
import Product from './js/product';
// import Latest from './cryptocurrency/Latest';

import { BrowserRouter, Route, Switch } from "react-router-dom";


//7a6393c8-d447-42c4-a96c-c878293f246a
function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/product">
            <Product/>
          </Route>
          {/*<Route path="/service">*/}
          {/*  <Latest/>*/}
          {/*</Route>*/}
        </Switch>
      </div>
    </BrowserRouter>

  );
}

export default App;
