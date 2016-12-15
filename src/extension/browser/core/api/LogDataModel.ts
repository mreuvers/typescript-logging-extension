import {ExtensionLogMessage} from "./ExtensionLogMessage";
import {observable, action, computed, transaction} from "mobx";
import {ExtensionCategory} from "./ExtensionCategory";
import {SimpleMap, LinkedList} from "typescript-logging";
import {Tuple} from "./Tuple";


export class LogDataModel {

  private _allCategories: SimpleMap<ExtensionCategory> = new SimpleMap<ExtensionCategory>();

  private _messages: LinkedList<ExtensionLogMessage> = new LinkedList<ExtensionLogMessage>();

  // Hack for mobx to know our messages changed,
  // since LinkedList is generic I don't want to
  // add mobx tags to it.
  @observable
  private _messageChanged: number = 0;

  @observable
  private _rootCategories: ExtensionCategory[] = [];

  @observable
  private _uiSettings: UISettings = new UISettings(this);

  @action
  addMessage(msg: ExtensionLogMessage): void {
    transaction(() => {
      this._messages.addTail(msg);
      this.trimMessages(this._uiSettings.requestedLines);
      this._messageChanged++;
    })

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
    if(this._messageChanged > 0) {
      return this._messages.filter((msg: ExtensionLogMessage) => {
        return this._uiSettings.mustShowMessage(msg);
      });
    }
    return [];
  }

  get rootCategories(): ExtensionCategory[] {
    return this._rootCategories;
  }

  getCategoryById(id: number): ExtensionCategory {
    return this._allCategories.get(id.toString());
  }

  get uiSettings(): UISettings {
    return this._uiSettings;
  }

  @action
  trimMessages(keepHowMany: number) {
    if(keepHowMany != null && keepHowMany >= 0) {
      const currentSize = this._messages.getSize();
      const toRemove = currentSize - keepHowMany;
      if(toRemove > 0) {
        transaction(() => {
          for(let i = 0; i < toRemove; i++) {
            this._messages.removeHead();
          }
          this._messageChanged++;
        });
      }
    }
  }

  private addAllCategories(root: ExtensionCategory): void {
    this._allCategories.put(root.id.toString(), root);
    root.children.forEach((child : ExtensionCategory) => {
      this.addAllCategories(child);
    });
  }

}

export class UISettings {

  private model: LogDataModel;

  constructor(model: LogDataModel) {
    this.model = model;
  }

// What log levels are enabled (checked)
  @observable
  private _logLevelsSelected: Tuple<string, boolean>[] = [];

  // Did the user filter on text?
  @observable
  private _filterText: string = null;

  @observable
  private _scrollToBottom: boolean = true;

  @observable
  private _requestedLines: number = 5000;

  set logLevelsSelected(value: Tuple<string, boolean>[]) {
    this._logLevelsSelected = value;
  }

  get logLevelsSelected(): Tuple<string, boolean>[] {
    return this._logLevelsSelected;
  }

  get filterText():string {
    return this._filterText;
  }

  set filterText(value: string) {
    this._filterText = value;
  }

  get scrollToBottom(): boolean {
    return this._scrollToBottom;
  }

  set scrollToBottom(value: boolean) {
    this._scrollToBottom = value;
  }

  get requestedLines(): number {
    return this._requestedLines;
  }

  set requestedLines(value: number) {
    if(value !== this._requestedLines) {
      this._requestedLines = value;
      this.model.trimMessages(value);
    }
  }

  mustShowMessage(value: ExtensionLogMessage): boolean {
    const levelMatches = (level: string): boolean => {
      return this._logLevelsSelected.some((tuple : Tuple<string,boolean>) => {
        return tuple.y && tuple.x === level;
      });
    };

    const filterMatch = (msg: string): boolean => {
      if(this._filterText === null ||  this._filterText === '') {
        return true;
      }
      return msg.indexOf(this._filterText) !== -1;
    };
    return levelMatches(value.logLevel) && filterMatch(value.message);
  }

}