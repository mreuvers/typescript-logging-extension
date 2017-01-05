import * as React from "react";
import {LogProps} from "./LogPanelComponent";
import {ExtensionLogMessage} from "../api/ExtensionLogMessage";
import {observer} from "mobx-react";
import {Tuple} from "../api/Tuple";
import {LogPanelConsoleComponent} from "./LogPanelConsoleComponent";
import {MessageFormatUtils, DateFormat} from "typescript-logging"

@observer
export class LogPanelContentComponent extends React.Component<LogProps,{}> {

  private _downloadUrl: string = null;

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
                <td>
                  &nbsp;&nbsp;&nbsp;Autoscroll bottom <input type="checkbox" checked={this.props.model.uiSettings.scrollToBottom} onChange={() => this.props.model.uiSettings.scrollToBottom = !this.props.model.uiSettings.scrollToBottom} />
                  <span style={{marginLeft: 20}}><button style={{marginBottom: 5}} onClick={this.onSaveLog.bind(this)}>Save log...</button></span>
                </td>
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

  private onSaveLog() {
    // Revoke open url, prevent memory leak.
    if(this._downloadUrl !== null) {
      URL.revokeObjectURL(this._downloadUrl);
      this._downloadUrl = null;
    }

    const blob = this.props.model.getSelectedLogLinesAsBlob();
    this._downloadUrl = URL.createObjectURL(blob);

    const dateStr = MessageFormatUtils.renderDate(new Date(), new DateFormat());

    const link = document.createElement('a');
    link.setAttribute('download', 'log-' + dateStr + '.txt');
    link.href = this._downloadUrl;
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
      const event = new MouseEvent('click');
      link.dispatchEvent(event);
      document.body.removeChild(link);
    });
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
    const showStack = this.state.showStack;
    const errorAsStack = this.props.value.errorAsStack;
    const sign = showStack ? '(-)' : '(+)';
    return (
    <div className={'log' + this.props.value.logLevel}>
      {this.props.value.formattedMessage}
      {errorAsStack != null ? <span onClick={() => this.clickMe()} >[<span className="errorStackClick">{sign} Stack</span>]</span> : ''}
      {showStack && errorAsStack != null ? <div className="errorStack">{errorAsStack.map((v: string) => { return [<br />,v] })}</div> : ''}
    </div>
    );
  }

  private clickMe(): void {
    this.setState({showStack: !this.state.showStack});
  }
}