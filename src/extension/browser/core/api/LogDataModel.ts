import {ExtensionLogMessage} from "./ExtensionLogMessage";
import {observable, action, computed} from "mobx";
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

  // Did the user filter on text?
  @observable
  private _filterText: string = null;

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

  @computed
  get messages(): ExtensionLogMessage[] {
    return this._messages.filter((msg: ExtensionLogMessage) => {
      return this.mustShowMessage(msg);
    });
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

  get filterText():string {
    return this._filterText;
  }

  set filterText(value: string) {
    this._filterText = value;
  }

  private addAllCategories(root: ExtensionCategory): void {
    this._allCategories.put(root.id.toString(), root);
    root.children.forEach((child : ExtensionCategory) => {
      this.addAllCategories(child);
    });
  }

  private mustShowMessage(value: ExtensionLogMessage): boolean {
    const levelMatches = (level: string): boolean => {
      return this._logLevelsSelected.some((tuple : Tuple<string,boolean>) => {
        return tuple.y && tuple.x === level;
      });
    }

    const filterMatch = (msg: string): boolean => {
      if(this._filterText === null ||  this._filterText === '') {
        return true;
      }
      return msg.indexOf(this._filterText) !== -1;
    }
    return levelMatches(value.logLevel) && filterMatch(value.message);
  }
}
