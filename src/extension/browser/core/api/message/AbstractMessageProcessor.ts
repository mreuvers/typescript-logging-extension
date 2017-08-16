import {
  ExtensionMessageJSON, ExtensionCategoryJSON, ExtensionMessageContentJSON,
  ExtensionCategoriesUpdateMessageJSON, ExtensionCategoryLogMessageJSON
} from "typescript-logging";
import {MessageProcessor} from "../MessageProcessor";
import {ExtensionCategory} from "../ExtensionCategory";
import {LogPanelConnector} from "../LogPanelConnector";
import {ExtensionLogMessage} from "../ExtensionLogMessage";

export abstract class AbstractMessageProcessor implements MessageProcessor {

  processMessage(msg: ExtensionMessageJSON<any>): void {
    if(msg.from) {
      switch(msg.from) {
        case 'tsl-logging':
          this.processMessageFromLoggingFramework(msg.data);
          break;
        case 'tsl-devtools':
          this.processMessageFromDevTools(msg.data);
          break;
        default:
          console.log("Dropped non supported msg.from=" + msg.from);
          break;
      }
    }
    else {
      console.log("Dropped non ExtensionMessage");
    }
  }

  sendMessageToLoggingFramework(msg: ExtensionMessageJSON<any>): void {
    // Do nothing, subclass needs to deal with this.
  }

  private processMessageFromLoggingFramework(content: ExtensionMessageContentJSON<any>): void {
    switch(content.type) {
      case 'root-categories-tree':
        const value = content.value as ExtensionCategoryJSON[];
        value.forEach((cat: ExtensionCategoryJSON) => {
          LogPanelConnector.INSTANCE.addRootCategory(ExtensionCategory.createFromJSON(cat));
        });
        break;
      case 'log-message':
        const logMessage = ExtensionLogMessage.createFromJSON(content.value as ExtensionCategoryLogMessageJSON, LogPanelConnector.INSTANCE.dataModel);
        LogPanelConnector.INSTANCE.addMessage(logMessage);
        break;
      case 'categories-rt-update':
        const catRTUpdate = content.value as ExtensionCategoriesUpdateMessageJSON;
        catRTUpdate.categories.forEach((cat: {id: number, logLevel: string}) => {
          const category = LogPanelConnector.INSTANCE.getCategoryById(cat.id);
          if(category != null) {
            category.applyLogLevel(cat.logLevel);
          }
        });
        break;
      default:
        throw new Error("Unsupported message type: " + content.type)
    }
  }

  private processMessageFromDevTools(content: ExtensionMessageContentJSON<any>) {
    switch(content.type) {
      case "clear":
        LogPanelConnector.INSTANCE.clear();
        break;
      case "saveCategoryStateAndClear":
        LogPanelConnector.INSTANCE.saveCategoryStateAndClear();
        break;
      case "restoreState":
        LogPanelConnector.INSTANCE.restoreCategoryState();
        break;
    }
  }
}
