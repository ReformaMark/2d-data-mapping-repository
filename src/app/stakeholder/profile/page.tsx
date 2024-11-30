'use client'
import Loading from '@/components/loading'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCurrentUser } from '@/features/users/api/use-current-user'
import { formatDate } from '@/lib/utils'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'

const formSchema = z.object({
    fname: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lname: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    stakeholderProfile: z.object({
        contactNumber: z.string(),
        isActive: z.boolean()
    }).optional(),
    farmerProfile: z.object({
        contactNumber: z.string(),
        address: z.string(),
        isActive: z.boolean()
    }).optional()
})

export default function ProfilePage() {
    const { data, isLoading } = useCurrentUser()
    const editUserProfile = useMutation(api.users.editUserProfile)
    const [dialogOpen, setIsDialogOpen] = useState(false)
    
   
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          fname: data?.fname || "",
          lname: data?.lname || "",
          stakeholderProfile:  data?.stakeholderProfile ? {
            contactNumber: data?.stakeholderProfile?.contactNumber || "",
            isActive: data?.stakeholderProfile?.isActive,
          } : undefined,
          farmerProfile: data?.farmerProfile ? {
            contactNumber: data?.farmerProfile?.contactNumber || "",
            address: data?.farmerProfile?.address || "",
            isActive: data?.farmerProfile?.isActive
          } : undefined
        },
      })

      if (isLoading) {
        return <Loading />
    } 
    function onSubmit(values: z.infer<typeof formSchema>) {
        toast.promise(
            editUserProfile({
                fname: values.fname,
                lname: values.lname,
                stakeholderProfile: values.stakeholderProfile && {
                    contactNumber: values.stakeholderProfile.contactNumber,
                    isActive: values.stakeholderProfile.isActive
                },
                farmerProfile: values.farmerProfile && {
                    contactNumber: values.farmerProfile.contactNumber,
                    address: values.farmerProfile.address,
                    isActive: values.farmerProfile.isActive
                }
            }),
            {
                loading: 'Updating profile...',
                success: 'Profile updated successfully',
                error: 'Failed to update profile'
            }
        )

        setIsDialogOpen(false)
    }

    return (
        <div className="grid  grid-cols-1 gap-x-10 auto-rows-fr">
            <div className="p-4 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-4 text-center">My Profile</h1>
                <Card className="border border-gray-200 space-y-10">
                    <CardHeader className="bg-gray-100 ">
                        <div className="px-10 flex justify-between">
                            <CardTitle className="text-lg font-semibold flex gap-x-5 items-center">
                                <Avatar className="size-10">
                                    <AvatarImage src={data?.image} />
                                    <AvatarFallback className='bg-green-500 p-3 text-white'>
                                        {data?.fname[0]}{data?.lname[0]}
                                    </AvatarFallback>
                                </Avatar>
                                {data?.fname} {data?.lname}
                            </CardTitle>
                            <Dialog onOpenChange={setIsDialogOpen} open={dialogOpen}>
                                <DialogTrigger>
                                    <Button onClick={()=> setIsDialogOpen(true)} variant={'default'} className='bg-blue-500 hover:bg-blue-700'>Update Profile</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <Card className="border border-gray-200 mt-2 pt-5">
                                        <CardContent className="space-y-2">
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                                        <FormField
                                                            control={form.control}
                                                            name="fname"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>First Name</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Enter first name..." {...field} />
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
                                                                        <Input placeholder="Enter last name..." {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">
                                                        {data?.stakeholderProfile && (
                                                            <FormField
                                                                control={form.control}
                                                                name="stakeholderProfile.contactNumber"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Contact No.</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="Enter contact number..." {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        )}
                                                        {data?.farmerProfile && (
                                                            <>
                                                                <FormField
                                                                    control={form.control}
                                                                    name="farmerProfile.contactNumber"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Contact No.</FormLabel>
                                                                            <FormControl>
                                                                                <Input placeholder="Enter contact number..." {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name="farmerProfile.address"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Address</FormLabel>
                                                                            <FormControl>
                                                                                <Input placeholder="Enter address..." {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <Button type="submit">Save Changes</Button>

                                                    </div>
                                                </form>
                                            </Form>
                                        </CardContent>
                                    </Card>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className='grid grid-cols-2'>
                            <p className="font-semibold">First Name: <span className='font-medium'>{data?.fname}</span></p>
                            <p className="font-semibold">Last Name: <span className='font-medium'>{data?.lname}</span></p>
                        </div>
                        <div>
                           
                        </div>
                        {data?.stakeholderProfile && (
                            <div>
                                <p className="font-semibold">Contact No.: <span className='font-medium'>{data.stakeholderProfile.contactNumber}</span></p>
                            </div>
                        )}
                        {data?.farmerProfile && (
                            <>
                                <div>
                                    <p className="font-semibold">Contact No.: <span className='font-medium'>{data.farmerProfile.contactNumber}</span></p>
                                </div>
                                <div>
                                    <p className="font-semibold">Address: <span className='font-medium'>{data.farmerProfile.address}</span></p>
                                </div>
                            </>
                        )}
                    </CardContent>
                    <CardFooter className="bg-gray-50">
                        <p><span className="font-semibold">Member since:</span> {formatDate({convexDate: data?._creationTime || 0})}</p>
                    </CardFooter>
                </Card>
            </div>
            <div>
            
           
            </div>
        </div>
    )
}