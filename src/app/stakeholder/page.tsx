import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Turu from '@/../public/images/brgy-turu-logo.jpg'
import Balitucan from '@/../public/images/brgy-balitucan-mapinya-logo.jpg'
import MaPinya from '@/../public/images/brgy-balitucan-mapinya-logo.jpg'
import Announcement from '@/features/stakeholders/components/announcement'
import PriceDisplay from '@/features/stakeholders/components/prices'

function Dashboard() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        <Link href="/stakeholder/production-analysis?search=Turu" className='contents'>
          <Card className="group hover:shadow-lg transition-shadow duration-200 p-0 space-y-5">
            <CardHeader className='p-0'>
              <CardTitle className='text-center text-white uppercase py-3 md:py-4 bg-green-500'>Barangay Turu</CardTitle>
            </CardHeader>
            <CardContent className='p-0 flex flex-col justify-between '>
              <div className="relative w-36 h-36 md:w-40 md:h-40 mb-4 overflow-hidden rounded-full mx-auto">
                <Image
                  src={Turu}
                  alt="Barangay Turu"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200 rounded-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardContent>
            <CardFooter className='bg-gray-50 px-8 md:px-10 py-4 md:py-5 text-muted-foreground h-20 md:h-24 min-h-fit'>
              Barangay Turu crop production focused on Corns and Rice.
            </CardFooter>
          </Card>
        </Link>
        <Link href="/stakeholder/production-analysis?search=Balitucan" className='contents'>
          <Card className="group hover:shadow-lg transition-shadow duration-200 p-0 space-y-5">
            <CardHeader className='p-0'>
              <CardTitle className='text-center text-white uppercase py-3 md:py-4 bg-green-500'>Sitio Balitucan</CardTitle>
            </CardHeader>
            <CardContent className='p-0 flex flex-col justify-between '>
              <div className="relative w-36 h-36 md:w-40 md:h-40 mb-4 overflow-hidden rounded-full mx-auto">
                <Image
                  src={Balitucan}
                  alt="Sitio Balitucan"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200 rounded-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardContent>
            <CardFooter className='text-muted-foreground px-8 md:px-10 py-4 md:py-5 bg-gray-50 h-20 md:h-24 min-h-fit'>
              Sitio Balitucan focuses on Corns and Rice as well as few other crops such as tomatoes and carrots.
            </CardFooter>
          </Card>
        </Link>
        <Link href="/stakeholder/production-analysis?search=Mapinya" className='contents'>
          <Card className="group hover:shadow-lg transition-shadow duration-200 p-0 space-y-5">
            <CardHeader className='p-0'>
              <CardTitle className='text-center text-white uppercase py-3 md:py-4 bg-green-500'>Sitio Mapinya</CardTitle>
            </CardHeader>
            <CardContent className='p-0 flex flex-col justify-between '>
              <div className="relative w-36 h-36 md:w-40 md:h-40 mb-4 overflow-hidden rounded-full mx-auto">
                <Image
                  src={MaPinya}
                  alt="Sitio Ma Pinya"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200 rounded-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardContent>
            <CardFooter className='text-muted-foreground px-8 md:px-10 py-4 md:py-5 bg-gray-50 h-20 md:h-24 min-h-fit'>
              Sitio Mapinya are also focused on Corns and Rice along with Eggplant and tomatoes.
            </CardFooter>
          </Card>
        </Link>

      
      </div>
      <PriceDisplay/>
      <Announcement/>
    </div>
  )
}

export default Dashboard