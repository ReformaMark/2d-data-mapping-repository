import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password"
import { DataModel } from "./_generated/dataModel";


const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      fname: params.firstName as string,
      lname: params.lastName as string,
      email: params.email as string,
      role: "stakeholder",
    }
  }
})

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [CustomPassword],
});
