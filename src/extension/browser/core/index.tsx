import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, IndexRoute, Route, hashHistory } from "react-router";
import {LogPanel} from "./components/LogPanelComponent";
import {MessageProcessorImpl} from "./../chrome/ts/MessageProcessorImpl"

export const messageProcessor = new MessageProcessorImpl();

ReactDOM.render(
  (
    <Router history={hashHistory}>
      <Route path="/" component={LogPanel}>
        <IndexRoute component={LogPanel} />

      </Route>
    </Router>
  ),
  document.getElementById('contentPanel')
);