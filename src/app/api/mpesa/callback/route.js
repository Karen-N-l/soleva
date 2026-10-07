import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import adminApp from "../../../../lib/firebaseAdmin";

const db = getFirestore(adminApp);

export async function POST(request) {
  try {
    const data = await request.json();

    console.log(
      "M-PESA Callback:",
      JSON.stringify(data, null, 2)
    );

    const callback = data?.Body?.stkCallback;

    if (!callback) {
      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Callback received",
      });
    }

    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;

    if (!checkoutRequestId) {
      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "No CheckoutRequestID provided",
      });
    }

    const snapshot = await db
      .collection("orders")
      .where("checkoutRequestId", "==", checkoutRequestId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log("Order not found:", checkoutRequestId);

      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Callback received",
      });
    }

    const orderDoc = snapshot.docs[0];

    if (resultCode === 0) {
      const metadata =
        callback.CallbackMetadata?.Item || [];

      const receipt = metadata.find(
        (item) => item.Name === "MpesaReceiptNumber"
      );

      await orderDoc.ref.update({
        paymentStatus: "Paid",
        mpesaReceiptNumber: receipt?.Value || "",
        paymentResult: callback.ResultDesc,
      });

      console.log(
        "Payment marked as Paid:",
        orderDoc.id
      );
    } else {
      await orderDoc.ref.update({
        paymentStatus: "Failed",
        paymentResult: callback.ResultDesc,
      });

      console.log(
        "Payment marked as Failed:",
        orderDoc.id
      );
    }

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Callback processed successfully",
    });
  } catch (error) {
    console.error("M-PESA Callback Error:", error);

    return NextResponse.json(
      {
        ResultCode: 1,
        ResultDesc: "Callback processing failed",
      },
      { status: 500 }
    );
  }
}