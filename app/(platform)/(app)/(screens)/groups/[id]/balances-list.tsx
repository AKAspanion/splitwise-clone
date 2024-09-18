"use client";
import { Switch } from "@/components/ui/switch";
import { calcGroupSplits } from "@/app/(platform)/(app)/_utils/calculation";
import { ExpenseWithPaymentWithSplit, GroupWIthUsers } from "@/types/shared";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BalancesLoader } from "./balances-loader";

export const BalancesList = ({
  group,
  expenses,
  onlyList = false,
}: {
  onlyList?: boolean;
  group: GroupWIthUsers | null;
  expenses: ExpenseWithPaymentWithSplit[] | null;
}) => {
  const { user } = useUser();
  const [detailed] = useState(false);

  const { data: balanceList, isLoading } = useQuery({
    queryKey: ["group-balance-list"],
    queryFn: async () => {
      return user?.id
        ? (await calcGroupSplits(
            user?.id,
            expenses || [],
            group?.users || [],
            group?.currency || "inr",
            detailed,
          )) || []
        : [];
    },
    enabled: true,
  });

  const balances = useMemo(
    () =>
      onlyList && balanceList ? balanceList.slice(0, 2) : balanceList || [],
    [balanceList, onlyList],
  );

  const noDataText = useMemo(() => {
    let text = "";
    if (!expenses?.length) {
      text = "No expenses yet";
    } else if (!balanceList?.length) {
      text = "All settled up";
    }
    return text;
  }, [balanceList?.length, expenses?.length]);

  // const handleCheck = () => {
  //   setDetailed((s) => !s);
  // };

  return isLoading ? (
    <BalancesLoader />
  ) : (
    <div>
      <div className="font-semibold text-normal flex flex-wrap-reverse justify-end gap-3 items-end">
        <div
          className={cn("flex flex-col", {
            "gap-1": onlyList,
            "gap-2": !onlyList,
          })}
        >
          {noDataText
            ? noDataText
            : balances?.map((s, i) => (
                <div
                  className="font-medium flex w-full gap-4 items-center"
                  key={i}
                >
                  <div className="font-medium" key={i}>
                    {s.message}
                  </div>
                  <Link
                    href={`/groups/${group?.id || ""}/settle?user1Id=${s.user1Id}&user2Id=${s.user2Id}&owes=${s.owes}`}
                  >
                    <Badge size="sm">Settle</Badge>
                  </Link>
                </div>
              ))}
        </div>
        <div className="flex-1" />
        {/* {onlyList ? null : (
          <div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="airplane-mode" className="text-sm">
                Detailed
              </Label>
              <Switch
                checked={detailed}
                onCheckedChange={handleCheck}
                id="airplane-mode"
              />
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};
