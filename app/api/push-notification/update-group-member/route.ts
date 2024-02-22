import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { sendNotification } from "@/lib/onesignal";
import { Group, User } from "@prisma/client";
import { db } from "@/lib/db";
import { APILogger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateGroupMemberNotificationBody = await req.json();
    const creatorId = body?.userId;
    const friendId = body?.friendId;
    const groupId = body?.groupId;

    if (creatorId && friendId && groupId) {
      const promises = [
        db.group.findUnique({ where: { id: groupId } }),
        db.user.findUnique({ where: { id: friendId } }),
        db.user.findUnique({ where: { id: creatorId } }),
      ];
      const [group, friend, creator] = (await Promise.all(promises)) as [
        Group,
        User,
        User,
      ];
      const heading = "Added to group";
      const notifications = [
        sendNotification({
          heading,
          content: `You have been added in group ${group?.title || ""} by ${creator?.firstName || creator?.name || "Someone"}`,
          external_id: [friend?.id],
          options: { url: `/groups/${groupId}` },
        }),
        sendNotification({
          heading,
          content: `You added ${friend?.firstName || friend?.name || "Someone"} in group ${group?.title || ""}`,
          external_id: [creator?.id],
          options: { url: `/groups/${groupId}` },
        }),
      ];

      const data = await Promise.allSettled(notifications);

      data.forEach(
        async (n) => await APILogger.info(`Update Group ${n.status}`, n),
      );

      return NextResponse.json(
        { message: "Messages processed", data },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: "Cannot process messages" },
        { status: 400 },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Somethig went wrong" },
      { status: 500 },
    );
  }
}
