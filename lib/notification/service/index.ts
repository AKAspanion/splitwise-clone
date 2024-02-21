import { Expense } from "@prisma/client";

const ContentType = "application/json";

export class NotificationService {
  public static async sendNotification(
    heading: string,
    content: string,
    external_id: string[],
  ) {
    try {
      await fetch("/api/push-notification", {
        method: "POST",
        headers: { "Content-Type": ContentType },
        body: JSON.stringify({
          heading,
          content,
          external_id,
        } satisfies SendNotificationUserbody),
      });
    } catch (error) {
      console.log(error);
    }
  }

  public static async createFriend(userId: string, friendId: string) {
    try {
      await fetch("/api/push-notification/update-group-member", {
        method: "POST",
        headers: { "Content-Type": ContentType },
        body: JSON.stringify({
          userId,
          friendId,
        } satisfies CreateFriendNotificationBody),
      });
    } catch (error) {
      console.log(error);
    }
  }

  public static async updateGroupMember(
    userId: string,
    friendId: string,
    groupId: string,
  ) {
    try {
      await fetch("/api/push-notification/update-group-member", {
        method: "POST",
        headers: { "Content-Type": ContentType },
        body: JSON.stringify({
          userId,
          friendId,
          groupId,
        } satisfies UpdateGroupMemberNotificationBody),
      });
    } catch (error) {
      console.log(error);
    }
  }

  public static async createExpense(userId: string, exp: Expense) {
    try {
      await fetch("/api/push-notification/create-expense", {
        method: "POST",
        headers: { "Content-Type": ContentType },
        body: JSON.stringify({
          groupId: exp?.groupId || "",
          expenseId: exp?.id || "",
          userId,
        } satisfies CreateExpenseNotificationBody),
      });
    } catch (error) {
      console.log(error);
    }
  }
}
