export class User {
  constructor(
    public id?: number,
    public name?: string,
    public mobileNumber?: string,
    public email?: string,
    public role?: string,
    public createDt?: Date,
    public authorities?: {
      id: string;
      name: string;
    }[]
  ) {}
}
