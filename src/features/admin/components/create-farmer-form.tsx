"use client"

import { useMutation, useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import z from "zod"
import { api } from "../../../../convex/_generated/api"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Id } from "../../../../convex/_generated/dataModel"
import { toast } from "sonner"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    fname: z.string().min(2, "First name must be at least 2 characters"),
    lname: z.string().min(2, "Last name must be at least 2 characters"),
    barangayId: z.string(),
    contactNumber: z.string().min(11, "Contact number must be at least 11 digits"),
    address: z.string().min(5, "Address must be at least 5 characters"),
})

export const CreateFarmerForm = () => {
    const router = useRouter()
    const createFarmer = useMutation(api.admin.createFarmer)
    const barangays = useQuery(api.barangays.list)
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            fname: "",
            lname: "",
            barangayId: "" as Id<"barangays">,
            contactNumber: "",
            address: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            await createFarmer({
                ...values,
                barangayId: values.barangayId as Id<"barangays">,
            })
            toast.success("Farmer account created successfully")
            router.push("/admin/user-management")
        } catch (error) {
            toast.error("Failed to create farmer account")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!barangays) return null

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="farmer@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Juan" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Dela Cruz" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="barangayId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Barangay</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a barangay" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {barangays.map((barangay) => (
                                        <SelectItem key={barangay._id} value={barangay._id}>
                                            {barangay.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                                <Input placeholder="09123456789" {...field} maxLength={11} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Complete Address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Farmer"}
                </Button>
            </form>
        </Form>
    )
}