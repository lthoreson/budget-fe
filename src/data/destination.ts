import { Budget } from 'src/data/budget';

export class Destination {
    constructor(public id: number | null, public name: string, public budget: Budget) {}
}