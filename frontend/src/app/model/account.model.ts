export class Account {
  constructor(
    public customerId?: number,
    public accountNumber?: number,
    public accountType?: string,
    public branchAddress?: string
  ) {}
}
