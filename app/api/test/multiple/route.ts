import { ExpenseType } from "@/lib/model/expense/expense-type";
import { Group } from "@/lib/model/group/group";
import { Payment } from "@/lib/model/payment/payment";
import { EqualSplit } from "@/lib/model/split/equal-split";
import { ExactSplit } from "@/lib/model/split/exact-split";
import { PercentSplit } from "@/lib/model/split/percent-split";
import { User } from "@/lib/model/user/user";
import { ExpenseRepository } from "@/lib/repository/expense-repository";
import { SplitWiseService } from "@/lib/service/splitwise-service";
import { NextResponse } from "next/server";

export async function GET(_req: Request) {
  try {
    const ankit = new User("1", "ankit", "u1@gmail.com", "9890098900");
    const komal = new User("2", "komal", "u2@gmail.com", "9999999999");
    const akash = new User("3", "akash", "u3@gmail.com", "9898989899");
    const amit = new User("4", "amit", "u4@gmail.com", "8976478292");

    const group = new Group("Split");
    group.addUser(ankit);
    group.addUser(komal);
    group.addUser(akash);
    group.addUser(amit);

    // Adding Expenses
    const expenseRepository = new ExpenseRepository(group);
    const service = new SplitWiseService(expenseRepository);

    console.log(service.getBalances());
    console.log(service.getBalance(ankit));
    console.log("-----------------");
    // service.addExpense(
    //   "GoaFlight",
    //   ExpenseType.EQUAL,
    //   [new Payment(ankit, 600), new Payment(komal, 900)],
    //   [new EqualSplit(ankit), new EqualSplit(komal), new EqualSplit(akash)]
    // );
    // service.addExpense(
    //   "GoaFlight",
    //   ExpenseType.PERCENT,
    //   [new Payment(ankit, 600), new Payment(komal, 900)],
    //   [
    //     new PercentSplit(ankit, 25),
    //     new PercentSplit(komal, 50),
    //     new PercentSplit(akash, 25),
    //   ]
    // );
    service.addExpense(
      "GoaFlight",
      ExpenseType.EXACT,
      // [new Payment(ankit, 500), new Payment(komal, 1000)],
      [new Payment(ankit, 1500)],
      [
        new ExactSplit(ankit, 500),
        new ExactSplit(komal, 250),
        new ExactSplit(akash, 750),
      ]
    );

    return NextResponse.json(
      { message: service.getBalances() },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Somethig went wrong" },
      { status: 500 }
    );
  }
}

// SHOW u1
// EXPENSE u1 1000 4 u1 u2 u3 u4 EQUAL
// SHOW u4
// SHOW u1
// EXPENSE U1 1250 2 U2 U3 EXACT 370 880
// SHOW
// EXPENSE u4 1200 4 u1 u2 u3 u4 PERCENT 40 20 20 20
// SHOW u1
// SHOW
