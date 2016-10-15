import {observable} from "mobx";
import {ExtensionCategoryJSON, SimpleMap} from "typescript-logging";

export class ExtensionCategory {

  @observable
  private _id: number;

  @observable
  private _name: string;

  @observable
  private _logLevel: string;

  @observable
  private _parent: ExtensionCategory;

  @observable
  private _children: ExtensionCategory[] = [];


  constructor(id: number, name: string, logLevel: string, parent: ExtensionCategory = null) {
    this._id = id;
    this._name = name;
    this._logLevel = logLevel;
    this._parent = parent;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get logLevel(): string {
    return this._logLevel;
  }

  get parent(): ExtensionCategory {
    return this._parent;
  }

  get children(): ExtensionCategory[] {
    return this._children;
  }

  /**
   * Only applies logLevel
   */
  applyLogLevel(logLevel: string): void {
    this._logLevel = logLevel;
  }

  static createFromJSON(category: ExtensionCategoryJSON): ExtensionCategory {
    const seen: SimpleMap<ExtensionCategory> = new SimpleMap<ExtensionCategory>();
    const extensionCategory = ExtensionCategory._createFromJSON(category, false, seen);
    if(extensionCategory.parent != null) {
      throw new Error("Category must be root, but is not: " + extensionCategory.name);
    }
    return extensionCategory;
  }

  private static _createFromJSON(category: ExtensionCategoryJSON, rootSeen: boolean, seen: SimpleMap<ExtensionCategory>): ExtensionCategory {
    if(rootSeen && category.parentId == null) {
      throw new Error("Found category that wants to be root, but already have a root category. Category that wants to be root: " + category.name);
    }

    let parentCategory: ExtensionCategory = null;
    if(category.parentId != null) {
      parentCategory  = seen.get(category.parentId.toString());
      if(parentCategory == null) {
        throw new Error("Failed to find parent category for category: " + category.name);
      }
    }

    const newCategory = new ExtensionCategory(category.id, category.name, category.logLevel, parentCategory);
    seen.put(newCategory.id.toString(), newCategory);

    if(!rootSeen && parentCategory == null) {
      rootSeen = true;
    }

    category.children.forEach((child: ExtensionCategoryJSON) => {
      newCategory.children.push(ExtensionCategory._createFromJSON(child, rootSeen, seen));
    });

    return newCategory;
  }
}