'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from 'convex/react'
import { Megaphone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { api } from '../../../../convex/_generated/api'
import { formatDate } from '@/lib/utils'
import { useCurrentUser } from '@/features/users/api/use-current-user'

export default function Announcement() {
    const announcements = useQuery(api.announcements.getAnnouncements)
    const activities = useQuery(api.activities.getActivities)
    const user = useCurrentUser()
  return (
    <Card className='p-0 '>
        <CardHeader className='p-0'>
            <CardTitle className='bg-gray-100 text-green-500 flex items-center justify-center'> <Megaphone className='size-10'/> Notifications</CardTitle>
        </CardHeader>
        <CardContent className='px-5 py-10 space-y-10'>
            <Card className="relative border border-gray-200 shadow-md pt-8 rounded-md px-5">
                <h3 className='absolute top-[-10px] left-3 p-1 font-semibold text-white rounded-md bg-green-500'>Announcements</h3>
                {announcements && announcements.length > 0 ? (
                    announcements.slice(0, 5).map((announcement) => (
                        <Link href={`/stakeholder/farms/${announcement.additionalInformation}`} key={announcement._id} className="mb-4 p-2 hover:bg-gray-50 ">
                            <div className="">
                                <h3 className="text-lg font-semibold">{announcement.title}</h3>
                                <p className='text-sm'>{announcement.content}</p>
                            </div>
                            <div className="text-xs flex flex-col justify-end items-end">
                                <h3>{formatDate({convexDate: announcement._creationTime})}</h3>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-gray-500 my-4">No announcements available at the moment.</p>
                )}
                 {announcements && announcements.length > 5 && (
                <CardFooter className='flex justify-end'>
                    <Link href='/announcements'>See All</Link>
                </CardFooter>
                )}
            </Card>
            <Card className="relative border border-gray-200 shadow-md pt-8 rounded-md px-5">
                <h3 className='absolute top-[-10px] left-3 p-1 font-semibold text-white rounded-md bg-green-500'>Recent Activities</h3>
                {activities && activities.length > 0 ? (
                    activities.slice(0, 5).map((activity) => (
                        <Link href={"/stakeholder/farms"} key={activity._id}  className="mb-4 p-2 hover:bg-gray-50 flex justify-between items-center">
                            <div className="">
                                <h3 className="text-lg font-semibold">{activity.title}</h3>
                                <p>{activity.content}</p>
                            </div>
                            <div className="flex">
                                <h3>{formatDate({convexDate: activity._creationTime})}</h3>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-gray-500 my-4">No Activities available at the moment.</p>
                )}
                 {announcements && announcements.length > 5 && (
                <CardFooter className='flex justify-end'>
                    <Link href={`/activities/${user.data?._id}`}>See All</Link>
                </CardFooter>
                )}
            </Card>
         
        </CardContent>
       
    </Card>
  )
}