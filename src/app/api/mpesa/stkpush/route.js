import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import adminApp from "../../../../lib/firebaseAdmin";

const db = getFirestore(adminApp);

function getTimestamp() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");
}

export async function POST(request) {
  try {
    const { phone, amount, orderId } = await request.json();

    if (!phone || !amount || !orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone, amount, and order ID are required.",
        },
        { status: 400 }
      );
    }

    const key = process.env.MPESA_CONSUMER_KEY;
    const secret = process.env.MPESA_CONSUMER_SECRET;
    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;

    if (!key || !secret || !shortCode || !passkey || !callbackUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "M-PESA environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(
      `${key}:${secret}`
    ).toString("base64");

    const tokenResponse = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
        cache: "no-store",
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to authenticate with M-PESA.",
        },
        { status: 500 }
      );
    }

    const timestamp = getTimestamp();

    const password = Buffer.from(
      `${shortCode}${passkey}${timestamp}`
    ).toString("base64");

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Number(amount),
          PartyA: phone,
          PartyB: shortCode,
          PhoneNumber: phone,
          CallBackURL: callbackUrl,
          AccountReference: orderId,
          TransactionDesc: "SOLEVA sneaker order",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("STK error:", data);

      return NextResponse.json(
        {
          success: false,
          message:
            data.errorMessage ||
            "Unable to start M-PESA payment.",
        },
        { status: response.status }
      );
    }

    await db.collection("orders").doc(orderId).update({
      checkoutRequestId: data.CheckoutRequestID,
      paymentStatus: "Pending",
    });

    return NextResponse.json({
      success: true,
      message:
        data.CustomerMessage ||
        "M-PESA payment request sent.",
      checkoutRequestId: data.CheckoutRequestID,
    });
  } catch (error) {
    console.error("STK Push error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong with the M-PESA request.",
      },
      { status: 500 }
    );
  }
}