import * as React from "react";
import {LogDataModel} from "../api/LogDataModel";
import {LogPanelConnector} from "../api/LogPanelConnector";
import {LogPanelContentComponent} from "./LogPanelContentComponent";
import {LogPanelTreeComponent} from "./LogPanelTreeComponent";
import {Tuple} from "../api/Tuple";
import {ALL_LOG_LEVELS_CATEGORY} from "../api/ExtensionLogMessage";

export interface LogProps {

  model: LogDataModel;

}



class LogPanelComponent extends React.Component<LogProps,{}> {

  constructor(props: LogProps) {
    super(props);
  }

  render () {

    return (
      <div id="logPanelComponent">
        <LogPanelTreeComponent model={this.props.model} />
        <LogPanelContentComponent model={this.props.model} />
      </div>
    )
  }
}

const LogPanelComponentWrapper = () => {
  const levels: Tuple<string,boolean>[] = [];

  ALL_LOG_LEVELS_CATEGORY.forEach((level: string) => {
    levels.push({x: level, y: true});
  });

  // Initiate the log levels to render (for selection)
  LogPanelConnector.INSTANCE.dataModel.logLevelsSelected = levels;

  return (
    <LogPanelComponent model={LogPanelConnector.INSTANCE.dataModel} />
  );
}

export const LogPanel = LogPanelComponentWrapper;