import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { useAuthActions } from "@convex-dev/auth/react"
import { TriangleAlertIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AuthFlow } from "../types"
import { toast } from "sonner"
import { VerificationForm } from "./verification-form"

interface SignUpCardProps {
    setState: (state: AuthFlow) => void
}

export const SignUpCard = ({
    setState
}: SignUpCardProps) => {
    const { signIn } = useAuthActions()

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [error, setError] = useState("");
    const [verificationCode, setVerificationCode] = useState("")
    const [pending, setPending] = useState<boolean>(false);
    const [needsVerification, setNeedsVerification] = useState(false);

    const router = useRouter()

    const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (!firstName || !lastName || !email || !password) {
            setError("All fields are required")
            return
        }

        const checkedFirstName = /^[a-zA-Z\s]+$/.test(firstName)
        const checkedLastName = /^[a-zA-Z\s]+$/.test(lastName)
        const checkedEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

        if (!checkedFirstName || !checkedLastName || !checkedEmail) {
            setError("Please check your inputs: Names should only contain letters and spaces, and email should be valid")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }

        setPending(true)
        setError("")

        try {
            // Try signing up with password-code provider first
            await signIn("password-code", {
                email,
                password,
                fname: firstName,
                lname: lastName,
                role: "stakeholder",
                stakeholderProfile: {
                    contactNumber,
                    isActive: true,
                },
                flow: "signUp",
            })
            setNeedsVerification(true)
        } catch (err) {
            console.error("Sign up error:", err)
            setError(err instanceof Error ? err.message : "Failed to sign up. Please try again.")
        } finally {
            setPending(false)
        }
    }

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault()
        setPending(true)

        try {
            await signIn("password-code", {
                email,
                code: verificationCode,
                flow: "email-verification",
            })
            // Successful verification will automatically log the user in
            router.push("/dashboard")
        } catch (error) {
            console.error(error)
            toast.error("Invalid verification code. Please try again")
        } finally {
            setPending(false)
        }
    }

    if (needsVerification) {
        return (
            <VerificationForm
                email={email}
                verificationCode={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                onSubmit={handleVerification}
                pending={pending}
            />
        )
    }

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-primary">
                    Sign up to continue
                </CardTitle>
                <CardDescription>
                    All fields are required to continue
                </CardDescription>
            </CardHeader>

            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlertIcon className="size-4" />
                    {error}
                </div>
            )}

            <CardContent className="space-y-5 px-0 pb-0">
                <form
                    onSubmit={onSignUp}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            disabled={pending}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            disabled={pending}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter your last name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            disabled={pending}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            type="email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            disabled={pending}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            type="password"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            disabled={pending}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            type="password"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                            id="contactNumber"
                            disabled={pending}
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="Enter your contact number"
                            required
                            maxLength={11}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={pending}>
                        {pending ? "Signing up..." : "Sign up"}
                    </Button>
                </form>

                <Separator />

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <span
                            className="text-primary hover:underline cursor-pointer"
                            onClick={() => setState("signIn")}>
                            Sign in
                        </span>
                    </p>

                    <p className="block lg:hidden text-sm text-muted-foreground">
                        Changed your mind? <span
                            className="text-primary hover:underline cursor-pointer"
                            onClick={() => router.push("/")}>
                            Go back to homepage.
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
        // <>
        //     {
        //         isVerifying ? (
        //             <VerificationForm
        //                 email={email}
        //                 verificationCode={verificationCode}
        //                 onChange={(e) => setVerificationCode(e.target.value)}
        //                 onSubmit={handleVerification}
        //                 pending={pending}
        //             />
        //         ) : (
        //             <Card className="w-full h-full p-8">
        //                 <CardHeader className="px-0 pt-0">
        //                     <CardTitle className="text-primary">
        //                         Sign up to continue
        //                     </CardTitle>
        //                     <CardDescription>
        //                         All fields are required to continue
        //                     </CardDescription>
        //                 </CardHeader>

        //                 {!!error && (
        //                     <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
        //                         <TriangleAlertIcon className="size-4" />
        //                         {error}
        //                     </div>
        //                 )}

        //                 <CardContent className="space-y-5 px-0 pb-0">
        //                     <form
        //                         onSubmit={onSignUp}
        //                         className="space-y-4"
        //                     >
        //                         <div className="space-y-2">
        //                             <Label htmlFor="firstName">First Name</Label>
        //                             <Input
        //                                 id="firstName"
        //                                 disabled={pending}
        //                                 value={firstName}
        //                                 onChange={(e) => setFirstName(e.target.value)}
        //                                 placeholder="Enter your first name"
        //                                 required
        //                             />
        //                         </div>

        //                         <div className="space-y-2">
        //                             <Label htmlFor="lastName">Last Name</Label>
        //                             <Input
        //                                 id="lastName"
        //                                 disabled={pending}
        //                                 value={lastName}
        //                                 onChange={(e) => setLastName(e.target.value)}
        //                                 placeholder="Enter your last name"
        //                                 required
        //                             />
        //                         </div>

        //                         <div className="space-y-2">
        //                             <Label htmlFor="email">Email</Label>
        //                             <Input
        //                                 id="email"
        //                                 disabled={pending}
        //                                 value={email}
        //                                 onChange={(e) => setEmail(e.target.value)}
        //                                 placeholder="Enter your email address"
        //                                 type="email"
        //                                 required
        //                             />
        //                         </div>

        //                         <div className="space-y-2">
        //                             <Label htmlFor="password">Password</Label>
        //                             <Input
        //                                 id="password"
        //                                 disabled={pending}
        //                                 value={password}
        //                                 onChange={(e) => setPassword(e.target.value)}
        //                                 placeholder="Enter your password"
        //                                 type="password"
        //                                 required
        //                             />
        //                         </div>

        //                         <div className="space-y-2">
        //                             <Label htmlFor="confirmPassword">Confirm Password</Label>
        //                             <Input
        //                                 id="confirmPassword"
        //                                 disabled={pending}
        //                                 value={confirmPassword}
        //                                 onChange={(e) => setConfirmPassword(e.target.value)}
        //                                 placeholder="Confirm your password"
        //                                 type="password"
        //                                 required
        //                             />
        //                         </div>

        //                         <div className="space-y-2">
        //                             <Label htmlFor="contactNumber">Contact Number</Label>
        //                             <Input
        //                                 id="contactNumber"
        //                                 disabled={pending}
        //                                 value={contactNumber}
        //                                 onChange={(e) => setContactNumber(e.target.value)}
        //                                 placeholder="Enter your contact number"
        //                                 required
        //                                 maxLength={11}
        //                             />
        //                         </div>

        //                         <Button type="submit" className="w-full" disabled={pending}>
        //                             {pending ? "Signing up..." : "Sign up"}
        //                         </Button>
        //                     </form>

        //                     <Separator />

        //                     <div className="space-y-1">
        //                         <p className="text-sm text-muted-foreground">
        //                             Already have an account? <span
        //                                 className="text-primary hover:underline cursor-pointer"
        //                                 onClick={() => setState("signIn")}>
        //                                 Sign in
        //                             </span>
        //                         </p>

        //                         <p className="block lg:hidden text-sm text-muted-foreground">
        //                             Changed your mind? <span
        //                                 className="text-primary hover:underline cursor-pointer"
        //                                 onClick={() => router.push("/")}>
        //                                 Go back to homepage.
        //                             </span>
        //                         </p>
        //                     </div>
        //                 </CardContent>
        //             </Card>
        //         )
        //     }
        // </>
    )
}