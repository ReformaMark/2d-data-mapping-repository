'use client'
import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Megaphone } from 'lucide-react'
import Link from 'next/link'

export default function AnnouncementsPage() {
  const announcements = useQuery(api.announcements.getAnnouncements)
  return (
    <div className="p-4">
      <Card className="shadow-lg">
        <CardHeader className="flex items-center justify-center bg-gray-100">
          <CardTitle className="text-green-500 flex items-center">
            <Megaphone className="mr-2" /> Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements && announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Link
                href={`/stakeholder/farms/${announcement.additionalInformation}`}
                key={announcement._id}
                className="mb-4 p-4 hover:bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{announcement.title}</h3>
                  <p className="text-sm text-gray-600">{announcement.content}</p>
                </div>
                <div className="mt-2 md:mt-0 md:ml-4">
                  <h3 className="text-sm">{formatDate({ convexDate: announcement._creationTime })}</h3>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 my-4">
              No announcements available at the moment.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
