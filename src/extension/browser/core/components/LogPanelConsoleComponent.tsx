import * as React from "react";
import {observer} from "mobx-react";
import {LogProps} from "./LogPanelComponent";
import {Debounce} from "../util/Debounce";

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

  @Debounce.debounce
  private updateFilterText(filterValue: string): void {
    this.props.model.uiSettings.filterText = filterValue;
  }
}

