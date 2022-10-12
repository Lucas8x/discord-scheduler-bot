export abstract class MovieModel {
  private id: number;
  private name: string | null;

  constructor(id: number) {
    this.id = id;
    this.name = null;
  }

  public getID = (): number => this.id;

  public setID = (id: number) => {
    this.id = id;
  };

  public getName = () => this.name;

  public setName = (name: string) => {
    this.name = name;
  };

  abstract fetch(): void;

  //abstract convert(): void;
}
