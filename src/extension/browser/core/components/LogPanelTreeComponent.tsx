import * as React from "react";

import {LogProps} from "./LogPanelComponent";
import {ExtensionCategory} from "../api/ExtensionCategory";
import {observer} from "mobx-react";
import {messageProcessor} from "../index";
import {ExtensionMessageContentJSON, ExtensionMessageJSON, ExtensionRequestChangeLogLevelJSON} from "typescript-logging";
import {ALL_LOG_LEVELS_CATEGORY} from "../api/ExtensionLogMessage";
import {Tabs, TabList, Tab, TabPanel} from "react-tabs";
import {Numeric} from "../util/Numeric";

interface LogPanelTreeComponentState {

  applyRecursive: boolean;

}

@observer
export class LogPanelTreeComponent extends React.Component<LogProps,LogPanelTreeComponentState> {

  constructor(props: LogProps) {
    super(props);


    this.state = {applyRecursive: true};

    this.changeLogLevel = this.changeLogLevel.bind(this);
  }

  render() {
    return (
      <div id="logPanelTreeComponent">
        <div id="logPanelTreeComponentContent">
          <Tabs>
            <TabList className="tabs">
              <Tab>Categories</Tab>
              <Tab>Settings</Tab>
            </TabList>
            <TabPanel>
              <div style={{verticalAlign: 'middle'}}>Recurse <input value="Recurse" checked={this.state.applyRecursive} type="checkbox" onChange={() => this.changeRecursive()} /></div>
              {
                this.props.model.rootCategories.map((value: ExtensionCategory) => {
                  return <ul><LogCategoryComponent category={value} changeLogLevel={this.changeLogLevel} /></ul>;
                })
              }
            </TabPanel>
            <TabPanel>
              <table>
                <tbody>
                  <tr>
                    <td>Lines cached</td>
                    <td><input type="text" size={6} maxLength={6} value={this.props.model.uiSettings.requestedLines} onChange={(e) => this.changeLines(e)} /></td>
                  </tr>
                  <tr>
                    <td>Clear messages (f5)</td>
                    <td><input type="checkbox" checked={this.props.model.uiSettings.clearMessages} onChange={this.toggleClearMessages.bind(this)} /></td>
                  </tr>
                </tbody>
              </table>
            </TabPanel>
          </Tabs>



        </div>
      </div>
    );
  }

  changeLogLevel(cat: ExtensionCategory, logLevel: string): void {
    const currentState = this.state.applyRecursive;
    const content = {
      type: 'request-change-loglevel',
      value: {
        categoryId: cat.id,
        logLevel: logLevel,
        recursive: currentState
      }
    } as ExtensionMessageContentJSON<ExtensionRequestChangeLogLevelJSON>;
    const msg = {
      from: 'tsl-extension',
      data: content
    } as ExtensionMessageJSON<ExtensionRequestChangeLogLevelJSON>;

    messageProcessor.sendMessageToLoggingFramework(msg);
  }

  private toggleClearMessages() {
    this.props.model.uiSettings.clearMessages = !this.props.model.uiSettings.clearMessages;
  }

  private changeLines(evt: React.FormEvent<HTMLInputElement>): void {
    const value = evt.currentTarget.value;
    if(Numeric.isInt(value)) {
      this.props.model.uiSettings.requestedLines = parseInt(value);
    }
    else if(value === "") {
      this.props.model.uiSettings.requestedLines = null;
    }
  }

  private changeRecursive() {
    this.setState({applyRecursive: !this.state.applyRecursive});
  }

}

interface LogCategoryProps {

  category: ExtensionCategory;

  changeLogLevel: (cat: ExtensionCategory, logLevel: string) => void;
}

@observer
class LogCategoryComponent extends React.Component<LogCategoryProps,{}> {

  constructor(props: LogCategoryProps) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <li>
        {this.props.category.name}
        <select value={this.props.category.logLevel} onChange={e => this.onSelectLogLevel(e)}>
          {
            ALL_LOG_LEVELS_CATEGORY.map((level: string) => {
              return <option value={level}>{level}</option>
            })
          }
        </select>
        <ul>
        {
          this.props.category.children.map((child : ExtensionCategory) => {
            return <LogCategoryComponent category={child} changeLogLevel={this.props.changeLogLevel} />;
          })
        }
        </ul>
      </li>
    );
  }

  private onSelectLogLevel(e: React.FormEvent<HTMLSelectElement>): void {
    this.props.changeLogLevel(this.props.category, e.currentTarget.value);
  }

}