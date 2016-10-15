import {ExtensionMessageJSON} from "typescript-logging";

export interface MessageProcessor {

  processMessage(msg: ExtensionMessageJSON<any>): void;

  sendMessageToLoggingFramework(msg: ExtensionMessageJSON<any>): void;
}