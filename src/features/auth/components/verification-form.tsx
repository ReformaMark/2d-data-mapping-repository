import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


interface VerificationFormProps {
    email: string;
    verificationCode: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    pending: boolean;
}

export function VerificationForm({
    email,
    onChange,
    onSubmit,
    pending,
    verificationCode,
}: VerificationFormProps) {
    return (
        <div className="w-full max-w-md space-y-6 bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">Verify Your Email</h1>
                <p className="text-muted-foreground">
                    We sent a verification code to {email}
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Input
                        name="verificationCode"
                        placeholder="Enter verification code"
                        value={verificationCode}
                        onChange={onChange}
                        disabled={pending}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={pending}
                >
                    {pending ? "Verifying..." : "Verify Email"}
                </Button>
            </form>
        </div>
    )
}