import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const token = req.nextUrl.searchParams.get("token");

  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  const subscriber = await prisma.subscriber.findUnique({
    where: { confirmToken: token },
    include: { waitlist: true },
  });

  if (!subscriber || subscriber.waitlist.slug !== slug) {
    return NextResponse.json({ error: "Invalid or expired confirmation link" }, { status: 404 });
  }

  if (!subscriber.confirmed) {
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { confirmed: true, confirmToken: null },
    });
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_URL}/j/${slug}?confirmed=true`
  );
}
