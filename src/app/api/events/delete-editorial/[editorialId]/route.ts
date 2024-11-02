import { deleteEditorial } from "@/actions/events";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req:NextRequest,{params}:any){
  try {
    const res= await deleteEditorial(params.editorialId);

    return NextResponse.json({success:true})
  } catch (error) {
    return NextResponse.json({success:false,error})
  }
}
