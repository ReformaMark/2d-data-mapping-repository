import { ResendOTP } from "@/features/auth/ResendOTP";
import { ResendOTPPasswordReset } from "@/features/auth/ResendOTPPasswordReset";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { DataModel } from "./_generated/dataModel";

const CustomPassword = Password<DataModel>({
  id: "password-code",
  verify: ResendOTP,
  reset: ResendOTPPasswordReset,
  requireVerification: true,

  //@ts-expect-error slight type issue
  profile: (params) => {
    switch (params.flow) {
      case "signUp":
        return {
          fname: params.fname as string,
          lname: params.lname as string,
          email: params.email as string,
          role: params.role as "stakeholder" | "farmer",
          stakeholderProfile: params.stakeholderProfile as {
            contactNumber: string,
            isActive: boolean,
          },
        };
      case "signIn":
      case "email-verification":
        return {
          email: params.email as string,
        };

      case "reset":
        return {
          email: params.email as string,
        };

      case "reset-verification":
        return {
          email: params.email as string,
        };

      default:
        throw new Error("Invalid flow");
    }
  },
})

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    CustomPassword,
  ],
});