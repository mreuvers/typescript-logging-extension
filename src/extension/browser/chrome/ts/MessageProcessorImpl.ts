import {ExtensionMessageJSON} from "typescript-logging";
import {AbstractMessageProcessor} from "../../core/api/message/AbstractMessageProcessor";

declare var sendMessageToDevTools: any;

/**
 * Custom message processor for the chrome extension.
 */
export class MessageProcessorImpl extends AbstractMessageProcessor {

  processMessage(msg: ExtensionMessageJSON<any>): void {
    super.processMessage(msg);
  }


  sendMessageToLoggingFramework(msg: ExtensionMessageJSON<any>): void {
    console.log("Sending message to devtools: " + msg);
    sendMessageToDevTools(msg);
  }
}