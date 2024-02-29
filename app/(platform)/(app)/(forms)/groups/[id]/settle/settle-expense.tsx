import { AutoContainer } from "@/components/container/auto-container";
import { Header } from "@/components/container/header";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { UISpinner } from "@/components/ui-spinner";
import { auth } from "@clerk/nextjs";
import SettleUsers from "./settle-users";

const Form = dynamic(() => import("./(form)/form"), {
  loading: () => <UISpinner />,
});

const SettleExpense = async ({
  params,
  searchParams,
}: ServerSideComponentProp) => {
  const { userId } = auth();
  const groupId = params["id"] || "";
  const backTo = groupId ? `/groups/${groupId}` : `/groups`;

  const user1Id = searchParams["user1Id"] || "";
  const user2Id = searchParams["user2Id"] || "";

  const owes = searchParams["owes"] || "";
  const amount = isNaN(owes) ? 0 : parseFloat(owes);

  return (
    <AutoContainer header={<Header backTo={backTo} title="Settlement" />}>
      <Suspense>
        <div className="flex flex-col gap-4 sm:gap-6">
          <SettleUsers user1Id={user1Id} user2Id={user2Id} />
          <Form
            groupId={groupId}
            amount={amount}
            user1Id={user1Id}
            user2Id={user2Id}
          />
        </div>
      </Suspense>
    </AutoContainer>
  );
};

export default SettleExpense;
