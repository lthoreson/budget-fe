export class Budget {
    constructor(public id: number | null, public name: string, public total: number, public associations: string[] = []) {}
}