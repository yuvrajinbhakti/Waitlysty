import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const waitlists = await prisma.waitlist.findMany({
    where: { userId },
    include: { _count: { select: { subscribers: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ waitlists });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.plan === "FREE") {
    const count = await prisma.waitlist.count({ where: { userId } });
    if (count >= 1) {
      return NextResponse.json({ error: "Free plan allows 1 waitlist. Upgrade to create more." }, { status: 403 });
    }
  }

  const { name, slug, tagline } = await req.json();
  if (!name || !slug) return NextResponse.json({ error: "Name and slug required" }, { status: 400 });
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Slug can only contain lowercase letters, numbers, and hyphens" }, { status: 400 });
  }

  try {
    const waitlist = await prisma.waitlist.create({
      data: { userId, name, slug, tagline },
      include: { _count: { select: { subscribers: true } } },
    });
    return NextResponse.json({ waitlist }, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
    console.error("[waitlists/create]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
