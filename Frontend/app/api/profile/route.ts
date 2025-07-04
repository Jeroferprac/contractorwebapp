import { NextRequest, NextResponse } from "next/server";
import { API } from "@/lib/api";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const backendRes = await fetch(API.PROFILE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await backendRes.json();

  return NextResponse.json(data, { status: backendRes.status });
}
