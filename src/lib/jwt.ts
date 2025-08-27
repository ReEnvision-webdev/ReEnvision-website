import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { StandardResponse } from "./types";

export const getDecodedJwt = async (req: NextRequest) => {
  return await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    raw: false,
  });
};

export const restrictAdmin = async (
  req: NextRequest,
): Promise<NextResponse | void> => {
  const token = await getDecodedJwt(req);

  if (!token) {
    const response: StandardResponse = {
      success: false,
      message: null,
      error: "Unauthorized",
      data: null,
    };

    return NextResponse.json(response, {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else if (!token.isAdmin || (token.exp as number) < Date.now() / 1000) {
    const response: StandardResponse = {
      success: false,
      message: null,
      error: "Forbidden",
      data: null,
    };

    return NextResponse.json(response, {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
