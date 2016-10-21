import * as React from "react";
import {observer} from "mobx-react";

@observer
export class LogPanelConsoleComponent extends React.Component<{},{consoleTyped: string}> {

  constructor(props: any) {
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

  private onConsoleInput(evt: React.FormEvent<HTMLInputElement>) {
    this.setState({consoleTyped: evt.currentTarget.value});
  }
}