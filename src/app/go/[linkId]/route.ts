import { NextRequest, NextResponse } from "next/server";
import { getPrisma, isDatabaseAvailable } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ linkId: string }> }
) {
  const { linkId } = await context.params;

  if (!isDatabaseAvailable()) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const prisma = getPrisma();

  const link = await prisma.link.findFirst({
    where: { id: linkId, isActive: true },
  });

  if (!link) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  await prisma.linkClick.create({
    data: {
      linkId: link.id,
      userAgent: request.headers.get("user-agent") ?? undefined,
      referrer: request.headers.get("referer") ?? undefined,
    },
  });

  return NextResponse.redirect(link.url);
}
