import { NextRequest, NextResponse } from "next/server";
import {
  ApiClient,
  CreateUserRequest,
  withPublicApiClient,
} from "@/src/lib/api-client";
import { useSupabaseServer } from "@/src/lib/supabase/supabase-server";

export const dynamic = "force-dynamic";

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  recaptchaToken: string;
}

const registerHandler = async (client: ApiClient, request: NextRequest) => {
  const body = await request.json();
  const { email, password, name, recaptchaToken } = body as RegisterPayload;
  const supabase = await useSupabaseServer();

  // try {
  //   await validateRecaptcha(recaptchaToken);
  // } catch (recaptchaError: any) {
  //   console.error("Recaptcha validation failed:", recaptchaError.message);
  //   return NextResponse.json(
  //     { message: "Recaptcha validation failed. Please try again." },
  //     { status: 403 }
  //   );
  // }

  const { data: supabaseData, error: supabaseError } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

  if (supabaseError) {
    if (
      supabaseError.message.toLowerCase().includes("user already registered")
    ) {
      return NextResponse.json(
        { message: "This email is already registered. Please try to login." },
        { status: 409 }
      );
    }
    console.error("Supabase signUp error:", supabaseError);
    return NextResponse.json(
      {
        message:
          supabaseError.message ||
          "Registration failed during Supabase signup.",
      },
      { status: (supabaseError as any).status || 500 }
    );
  }

  if (!supabaseData?.user?.id) {
    console.error("Supabase signUp successful but no user data returned.");
    return NextResponse.json(
      { message: "Registration failed: Incomplete Supabase user data." },
      { status: 500 }
    );
  }

  const userRequest: CreateUserRequest = {
    supabaseId: supabaseData.user.id,
    name: name,
    email: email,
    isEmailVerified: !!supabaseData.user.email_confirmed_at,
    isPhoneVerified: !!supabaseData.user.phone_confirmed_at,
    avatarUrl: supabaseData.user.user_metadata?.avatar_url || undefined,
    authProvider: CreateUserRequest.authProvider.SUPBASE,
  };

  try {
    const data = await client.publicUserApi.createUser(userRequest);

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        user_id: data.id,
        name: data.name,
        avatar_url: data.avatarUrl,
        preferred_language: data.preferredLanguage,
      },
    });

    if (authError) {
      console.error("Error updating Supabase auth user metadata:", authError);
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Registration successful! Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (apiError: any) {
    if (apiError.status !== 409) {
      try {
        await supabase.auth.admin.deleteUser(supabaseData.user.id);
      } catch (rollbackError: any) {
        console.error(
          `Failed to rollback Supabase user ${supabaseData.user.id}:`,
          rollbackError.message
        );
      }
    }

    if (apiError.message && apiError.status === 409) {
      return NextResponse.json(
        {
          message: "This email is already registered with our service.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message:
          apiError.message || "Registration failed due to a server error.",
      },
      { status: apiError.response?.status || 500 }
    );
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
    throw new Error("Recaptcha failed");
  }
};
