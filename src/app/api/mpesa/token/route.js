import { NextResponse } from "next/server";

export async function GET() {
  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      return NextResponse.json(
        {
          success: false,
          message: "M-PESA credentials are missing.",
        },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString("base64");

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Daraja error:", data);

      return NextResponse.json(
        {
          success: false,
          message: "Unable to connect to M-PESA.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Daraja connection successful.",
    });
  } catch (error) {
    console.error("M-PESA connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong connecting to M-PESA.",
      },
      { status: 500 }
    );
  }
}