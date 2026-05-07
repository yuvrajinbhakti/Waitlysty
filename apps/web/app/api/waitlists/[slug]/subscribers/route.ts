import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const userId = (session.user as any).id;

  const waitlist = await prisma.waitlist.findFirst({ where: { slug, userId } });
  if (!waitlist) return NextResponse.json({ error: "Waitlist not found" }, { status: 404 });

  const subscribers = await prisma.subscriber.findMany({
    where: { waitlistId: waitlist.id },
    orderBy: { position: "asc" },
  });

  if (req.nextUrl.searchParams.get("format") === "csv") {
    const header = "position,email,name,confirmed,referralCount,joinedAt\n";
    const rows = subscribers
      .map((s) => `${s.position},${s.email},${s.name ?? ""},${s.confirmed},${s.referralCount},${s.createdAt.toISOString()}`)
      .join("\n");
    return new NextResponse(header + rows, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${slug}-subscribers.csv"`,
      },
    });
  }

  return NextResponse.json({ subscribers, total: subscribers.length });
}
