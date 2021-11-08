export class Vector {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add = (vector: Vector): Vector => {
    return new Vector(this.x + vector.x, this.y + vector.y);
  };

  public subtract = (vector: Vector): Vector => {
    return new Vector(this.x - vector.x, this.y - vector.y);
  };

  public multiply = (scalar: number): Vector => {
    return new Vector(this.x * scalar, this.y * scalar);
  };

  public dotProduct = (vector: Vector): number => {
    return this.x * vector.x + this.y * vector.y;
  };

  public magnitude = (): number => {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  };

  public direction = (): number => {
    return Math.atan2(this.x, this.y);
  };
}
