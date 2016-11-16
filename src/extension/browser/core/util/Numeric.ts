export class Numeric {

  static isInt(value: any): boolean {
    let x: any;
    if (isNaN(value)) {
      return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
  }

}