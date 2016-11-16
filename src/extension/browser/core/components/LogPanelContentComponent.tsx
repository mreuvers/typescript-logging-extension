import * as React from "react";
import {LogProps} from "./LogPanelComponent";
import {ExtensionLogMessage} from "../api/ExtensionLogMessage";
import {observer} from "mobx-react";
import {Tuple} from "../api/Tuple";
import {LogPanelConsoleComponent} from "./LogPanelConsoleComponent";

@observer
export class LogPanelContentComponent extends React.Component<LogProps,{}> {

  constructor(props: LogProps) {
    super(props);
  }

  componentDidUpdate() {
    if(this.props.model.uiSettings.scrollToBottom) {
      window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
    }
  }

  render () {
    return (
      <div id="logMessagesComponent">
        <h1>Log Panel</h1>
        <div id="logMessages">
          {
            this.props.model.messages.map((value : ExtensionLogMessage) => {
              return (
                <LogLineComponent value={value} />
              )
            })
          }
        </div>
        <div id="logMessagesLevels">
          <table>
            <tbody>
              <tr>
          {this.props.model.uiSettings.logLevelsSelected.map((tuple: Tuple<string,boolean>) => {
            return <td>{tuple.x}<input type="checkbox" checked={tuple.y} onChange={this.onChangeLogLevelChecked.bind(this, tuple.x)}/></td>
          })}
                <td>&nbsp;&nbsp;&nbsp;Autoscroll bottom <input type="checkbox" checked={this.props.model.uiSettings.scrollToBottom} onChange={() => this.props.model.uiSettings.scrollToBottom = !this.props.model.uiSettings.scrollToBottom} /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <LogPanelConsoleComponent model={this.props.model} />
      </div>
    );
  }

  private onChangeLogLevelChecked(level: string) {
    const tupleFound = this.props.model.uiSettings.logLevelsSelected.filter((f: Tuple<string,boolean>) => {
      return f.x === level;
    });
    if(tupleFound.length == 1) {
      tupleFound[0].y = !tupleFound[0].y;
    }
    else {
      throw new Error("Did not find log level " + level);
    }
  }
}

interface ValueModel<T> {

  value: T;

}


class LogLineComponent extends React.Component<ValueModel<ExtensionLogMessage>,{showStack: boolean}> {

  constructor(props: ValueModel<ExtensionLogMessage>) {
    super(props);

    this.state = {showStack: false};
  }

  render() {
    let stack = this.state.showStack ? this.props.value.errorAsStack: '';
    return (
    <div className={'log' + this.props.value.logLevel}>
      {this.props.value.formattedMessage}
      {this.props.value.errorAsStack != null ? <span onClick={() => this.clickMe()}>Click me!</span> : ''}
      {stack !== '' ? <div className="errorStack">{stack}</div> : ''}
    </div>
    );
  }

  private clickMe(): void {
    this.setState({showStack: true});
  }
}