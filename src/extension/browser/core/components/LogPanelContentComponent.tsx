import * as React from "react";

import {LogProps} from "./LogPanelComponent";
import {ExtensionLogMessage} from "../api/ExtensionLogMessage";
import {observer} from "mobx-react";
import {Tuple} from "../api/Tuple";

@observer
export class LogPanelContentComponent extends React.Component<LogProps,{}> {

  constructor(props: LogProps) {
    super(props);
  }

  render () {
    return (
      <div id="logMessagesComponent">
        <h1>Log Panel</h1>
        <div id="logMessages">
          {
            this.props.model.messages.filter((value : ExtensionLogMessage) => {
              return this.mustShowMessage(value);
            })
            .map((value : ExtensionLogMessage) => {
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
          {this.props.model.logLevelsSelected.map((tuple: Tuple<string,boolean>) => {
            return <td>{tuple.x}<input type="checkbox" checked={tuple.y} onChange={this.onChangeLogLevelChecked.bind(this, tuple.x)}/></td>
          })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  private onChangeLogLevelChecked(level: string, evt?: React.FormEvent<HTMLInputElement>) {
    const tupleFound = this.props.model.logLevelsSelected.filter((f: Tuple<string,boolean>) => {
      return f.x === level;
    });
    if(tupleFound.length == 1) {
      console.log(level + " switching from: " + tupleFound[0].y);
      tupleFound[0].y = !tupleFound[0].y;
      console.log(level + " switched to: " + tupleFound[0].y);
    }
    else {
      throw new Error("Did not find log level " + level);
    }
  }


  private mustShowMessage(value: ExtensionLogMessage): boolean {
    const levelMatches = (level: string): boolean => {
      return this.props.model.logLevelsSelected.some((tuple : Tuple<string,boolean>) => {
        return tuple.y && tuple.x === level;
      });
    }
    return levelMatches(value.logLevel);
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
      {this.props.value.errorAsStack != null ? <span onClick={e => this.clickMe(e)}>Click me!</span> : ''}
      {stack !== '' ? <div className="errorStack">{stack}</div> : ''}
    </div>
    );
  }

  private clickMe(evt: React.MouseEvent<HTMLElement>): void {
    this.setState({showStack: true});
  }
}