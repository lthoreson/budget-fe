export class Transaction {
    constructor(public id: number | null, public destination: string, public amount: number, public budget: number, public account: number) {}
}