import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReferralCode } from "@/lib/auth";
import { sendConfirmationEmail } from "@/lib/email";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { email, name, ref } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { headers: CORS, status: 400 });

  const waitlist = await prisma.waitlist.findUnique({
    where: { slug },
    include: { _count: { select: { subscribers: true } } },
  });
  if (!waitlist) return NextResponse.json({ error: "Waitlist not found" }, { headers: CORS, status: 404 });

  const owner = await prisma.user.findUnique({ where: { id: waitlist.userId } });
  if (owner?.plan === "FREE" && waitlist._count.subscribers >= 100) {
    return NextResponse.json({ error: "Waitlist is full." }, { headers: CORS, status: 403 });
  }

  const existing = await prisma.subscriber.findUnique({
    where: { waitlistId_email: { waitlistId: waitlist.id, email } },
  });
  if (existing) {
    return NextResponse.json({
      message: "Already on the list", position: existing.position,
      referralLink: `${process.env.NEXT_PUBLIC_URL}/j/${slug}?ref=${existing.referralCode}`,
    }, { headers: CORS });
  }

  let referredById: string | undefined;
  if (ref) {
    const referrer = await prisma.subscriber.findUnique({ where: { referralCode: ref } });
    if (referrer?.waitlistId === waitlist.id) referredById = referrer.id;
  }

  const position = waitlist._count.subscribers + 1;

  const subscriber = await prisma.$transaction(async (tx) => {
    const sub = await tx.subscriber.create({
      data: {
        waitlistId: waitlist.id, email, name, position,
        referralCode: generateReferralCode(),
        referredById,
        confirmed: !waitlist.emailConfirmEnabled,
      },
    });
    if (referredById) {
      await tx.subscriber.update({
        where: { id: referredById },
        data: { referralCount: { increment: 1 }, position: { decrement: 1 } },
      });
    }
    return sub;
  });

  if (waitlist.emailConfirmEnabled) {
    await sendConfirmationEmail({
      to: email, name: name ?? "there", waitlistName: waitlist.name, subject: waitlist.confirmSubject,
      confirmUrl: `${process.env.NEXT_PUBLIC_URL}/api/waitlists/${slug}/confirm?token=${subscriber.confirmToken}`,
    });
  }

  return NextResponse.json({
    message: "Joined!", position: subscriber.position,
    referralCode: subscriber.referralCode,
    referralLink: `${process.env.NEXT_PUBLIC_URL}/j/${slug}?ref=${subscriber.referralCode}`,
  }, { headers: CORS, status: 201 });
}
