import { deleteSession } from "@/actions/user";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const event = await deleteSession(id);

  return NextResponse.json(event);
}