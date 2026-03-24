import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ favorites: [] });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    favorites: favorites.map((f) => f.activity),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to save favorites" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const activity = typeof body?.activity === "string" ? body.activity.trim() : null;

  if (!activity) {
    return NextResponse.json(
      { error: "Activity is required" },
      { status: 400 }
    );
  }

  await prisma.favorite.upsert({
    where: {
      userId_activity: {
        userId: session.user.id,
        activity,
      },
    },
    create: {
      userId: session.user.id,
      activity,
    },
    update: {},
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to remove favorites" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const activity = searchParams.get("activity");

  if (!activity) {
    return NextResponse.json(
      { error: "Activity query parameter is required" },
      { status: 400 }
    );
  }

  await prisma.favorite.deleteMany({
    where: {
      userId: session.user.id,
      activity,
    },
  });

  return NextResponse.json({ success: true });
}
