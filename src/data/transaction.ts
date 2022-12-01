export class Transaction {
    constructor(public id: number, public destination: string, public amount: number, public budget: number) {}
}