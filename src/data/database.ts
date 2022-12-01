import { Account } from "./account";
import { Budget } from "./budget";
import { Transaction } from "./transaction";

export interface Database {
    accounts: Account[]
    budgets: Budget[]
    transactions: Transaction[]
}