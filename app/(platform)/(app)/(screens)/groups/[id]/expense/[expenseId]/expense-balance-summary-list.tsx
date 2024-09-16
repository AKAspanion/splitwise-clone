"use client";

import { replaceUserWithYou } from "@/app/(platform)/(app)/_utils/user";
import { getOwsKeyword, getVerbKeyword } from "@/utils/validate";
import { Expense, User, UserPayment, UserSplit } from "@prisma/client";
import { useMemo, useState } from "react";
import { getInitials } from "@/utils/func";
import { getCurrencySymbol } from "@/utils/currency";

const MAX_LIST_COUNT = 2;

const BalanceSummaryList = ({
  userId,
  payments,
  splits,
  users,
  expense,
}: {
  userId: string | null;
  users: User[] | null;
  payments: UserPayment[] | null;
  splits: UserSplit[] | null;
  expense: Expense | null;
}) => {
  const [show, setShow] = useState(false);
  const summaryList = useMemo(() => {
    const symbol = getCurrencySymbol(expense?.currency);

    const list = users?.map((u) => {
      const paid = payments?.find((p) => p.userId === u.id)?.amount || 0;
      const owed = splits?.find((s) => s.userId === u.id)?.amount || 0;

      const name = getInitials(
        replaceUserWithYou(userId, u?.id, u?.name || u?.firstName),
      );

      if (!paid && !owed) {
        return `${name} ${getVerbKeyword(name)} not involved`;
      }

      return `${name} paid ${symbol}${paid} and ${getOwsKeyword(name)} ${symbol}${owed}`;
    });

    return (
      list?.sort((a) => (a.includes("not") || a.includes("₹0") ? 1 : -1)) || []
    );
  }, [payments, splits, users, userId, expense?.currency]);

  const summary = useMemo(
    () => (!show ? summaryList?.slice(0, MAX_LIST_COUNT) : summaryList),
    [show, summaryList],
  );

  return !userId ? null : (
    <div className="flex flex-col gap-2">
      {summary?.map((s, i) => (
        <div key={i} className="text-xs">
          {s}
        </div>
      ))}
      {summaryList?.length > MAX_LIST_COUNT ? (
        <div
          className="text-xs underline cursor-pointer text-sparkle"
          onClick={() => setShow((s) => !s)}
        >
          {show ? "Show less" : "Show more"}
        </div>
      ) : null}
    </div>
  );
};

export default BalanceSummaryList;
