import { EqualExpense } from "../model/expense/equal-expense";
import { ExactExpense } from "../model/expense/exact-expense";
import { Expense } from "../model/expense/expense";
import { ExpenseData } from "../model/expense/expense-data";
import { ExpenseType } from "../model/expense/expense-type";
import { PercentExpense } from "../model/expense/percent-expense";
import { PercentSplit } from "../model/split/percent-split";
import { Split } from "../model/split/split";
import { User } from "../model/user/user";

export class ExpenseService {
  public static createExpense(
    expenseType: ExpenseType,
    amount: number,
    expensePaidBy: User,
    splits: Split[],
    expenseData: ExpenseData
  ) {
    switch (expenseType) {
      case ExpenseType.EXACT: {
        const exp = new ExactExpense(
          amount,
          expensePaidBy,
          splits,
          expenseData
        );
        if (exp.validate()) {
          return exp;
        } else {
          throw new Error("Exact type expense validation failed");
        }
      }
      case ExpenseType.PERCENT: {
        for (const split of splits) {
          const percentSplit = <PercentSplit>split;
          split.setAmount((amount * percentSplit.getPercent()) / 100.0);
        }
        const exp = new PercentExpense(
          amount,
          expensePaidBy,
          splits,
          expenseData
        );
        if (exp.validate()) {
          return exp;
        } else {
          throw new Error("Percent type expense validation failed");
        }
      }
      case ExpenseType.EQUAL: {
        const totalSplits = splits.length;
        const splitAmount =
          Number(Math.round((amount * 100) / totalSplits)) / 100.0;
        for (const split of splits) {
          split.setAmount(splitAmount);
        }
        const exp = new EqualExpense(
          amount,
          expensePaidBy,
          splits,
          expenseData
        );
        if (exp.validate()) {
          return exp;
        } else {
          throw new Error("Equal type expense validation failed");
        }
      }
      default:
        return null;
    }
  }
}
