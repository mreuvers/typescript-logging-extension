import {ExtensionLogMessage} from "./ExtensionLogMessage";
import {observable, action} from "mobx";
import {ExtensionCategory} from "./ExtensionCategory";
import {SimpleMap} from "typescript-logging";
import {Tuple} from "./Tuple";


export class LogDataModel {

  @observable
  private _messages:ExtensionLogMessage[] = [];

  @observable
  private _rootCategories: ExtensionCategory[] = [];

  private _allCategories: SimpleMap<ExtensionCategory> = new SimpleMap<ExtensionCategory>();


  // What log levels are enabled (checked)
  @observable
  private _logLevelsSelected: Tuple<string, boolean>[] = [];

  @action
  addMessage(msg: ExtensionLogMessage): void {
    this._messages.push(msg);
  }

  @action
  addRootCategory(root: ExtensionCategory): void {
    if(root.parent != null) {
      throw new Error("Root category must not have a parent");
    }
    // Only add something we do not know yet.
    if(!this._allCategories.exists(root.id.toString())) {
      this._rootCategories.push(root);

      this.addAllCategories(root);
    }
  }

  get messages(): ExtensionLogMessage[] {
    return this._messages;
  }

  get rootCategories(): ExtensionCategory[] {
    return this._rootCategories;
  }

  set logLevelsSelected(value: Tuple<string, boolean>[]) {
    this._logLevelsSelected = value;
  }

  get logLevelsSelected(): Tuple<string, boolean>[] {
    return this._logLevelsSelected;
  }

  getCategoryById(id: number): ExtensionCategory {
    return this._allCategories.get(id.toString());
  }

  private addAllCategories(root: ExtensionCategory): void {
    this._allCategories.put(root.id.toString(), root);
    root.children.forEach((child : ExtensionCategory) => {
      this.addAllCategories(child);
    });
  }
}
