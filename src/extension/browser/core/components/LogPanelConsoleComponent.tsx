import * as React from "react";
import {observer} from "mobx-react";
import {LogProps} from "./LogPanelComponent";

@observer
export class LogPanelConsoleComponent extends React.Component<LogProps,{consoleTyped: string}> {

  constructor(props: LogProps) {
    super(props);

    this.state = {consoleTyped: ''};

    this.onConsoleInput = this.onConsoleInput.bind(this);
  }

  render(): JSX.Element {
    return (
      <div id="logMessagesConsoleComponent">
        <input type="text" value={this.state.consoleTyped} onChange={this.onConsoleInput} />
      </div>
    );
  }

  private onConsoleInput(evt: React.FormEvent<HTMLInputElement>): void {
    const filterValue =  evt.currentTarget.value;
    this.setState({consoleTyped: filterValue});
    this.updateFilterText(filterValue);
  }

  @debounce
  private updateFilterText(filterValue: string): void {
    this.props.model.filterText = filterValue;
  }
}

function debounce (target: any, key: string, descriptor: any) {

  var queue: any = [];

  var updateDebounce = function(method: any, that: any) {
    var diff = new Date().getTime() - method._lastBounced.getTime();

    if(queue.length > 0) {
      if (diff > 1000) {
        console.log("applying");
        var result = method.apply(that, queue[queue.length-1].args);
        queue = [];
        method._lastBounced = new Date();
        return result;
      }
      else {
        setTimeout(function() {
          updateDebounce(method, that);
        }, diff);
      }
    }
    return null;
  }

  // Method value original
  var originalMethod = descriptor.value;
  originalMethod._lastBounced = new Date();

  // Edit the descriptor/value parameter
  descriptor.value = function (...args: any[]) {
    queue.push({ 'args': args });

    return updateDebounce(originalMethod, this);
  }

  return descriptor;
}
