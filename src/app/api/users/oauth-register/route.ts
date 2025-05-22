import { NextRequest, NextResponse } from "next/server";
import {
  ApiClient,
  UserRequest,
  withPublicApiClient,
} from "@/src/lib/api-client";

export const dynamic = "force-dynamic";

const registerHandler = async (client: ApiClient, request: NextRequest) => {
  const body = await request.json();
  const {
    supabaseId,
    email,
    name,
    avatarUrl,
    recaptchaToken,
    phoneNumber,
    emailVerified,
    phoneVerified,
  } = body;

  const userRequest: UserRequest = {
    supabaseId: supabaseId,
    name: name,
    email: email,
    phoneNumber: phoneNumber || "",
    emailVerified: emailVerified || false,
    phoneVerified: phoneVerified || false,
    avatarUrl: avatarUrl,
  };
  try {
    await client.publicUserApi.createUser(recaptchaToken, userRequest);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    // Rollback: delete Supabase user if backend registration fails
    // if (data?.user?.id) {
    //   await supabase.auth.admin.deleteUser(data.user.id);
    // }
    throw err;
  }
};

export const POST = withPublicApiClient(registerHandler);

const validateRecaptcha = async (recaptchaToken: string) => {
  const recaptchaResponse = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/additional-life-1747339334136/assessments?key=${String(
      process.env.GOOGLE_API_KEY
    )}`,
    {
      method: "POST",
      body: JSON.stringify({
        event: {
          token: recaptchaToken,
          expectedAction: "create-user",
          siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        },
      }),
    }
  );
  const recaptchaData = await recaptchaResponse.json();

  if (
    !recaptchaData?.riskAnalysis?.score ||
    recaptchaData?.tokenProperties?.valid !== true
  ) {
    console.log("Recaptcha failed", JSON.stringify(recaptchaData, null, 2));
    throw new Error("Recaptcha failed");
  }
};
