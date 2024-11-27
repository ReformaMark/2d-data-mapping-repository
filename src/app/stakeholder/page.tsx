import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Turu from '@/../public/images/brgy-turu-logo.jpg'
import Balitucan from '@/../public/images/brgy-balitucan-mapinya-logo.jpg'
import MaPinya from '@/../public/images/brgy-balitucan-mapinya-logo.jpg'

function Dashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Link href="/stakeholder/production-analysis?search=Turu">
        <Card className="group hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <div className="relative w-48 h-48 mb-4 overflow-hidden rounded-full mx-auto">
              <Image
                src={Turu}
                alt="Barangay Turu"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200 rounded-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardTitle>Barangay Turu</CardTitle>
            <CardDescription>Magalang, Pampanga</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Barangay Turu crop production focused on Corns and Rice.</p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/stakeholder/production-analysis?search=Balitucan">
        <Card className="group hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <div className="relative w-48 h-48 mb-4 overflow-hidden rounded-full mx-auto">
              <Image
                src={Balitucan}
                alt="Barangay Balitucan"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200 rounded-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardTitle>Barangay Balitucan</CardTitle>
            <CardDescription>Magalang, Pampanga</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Barangay Balitucan focuses on Corns and Rice as well as few other crops such as tomatoes and carrots.</p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/stakeholder/production-analysis?search=Mapinya">
        <Card className="group hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <div className="relative w-48 h-48 mb-4 overflow-hidden rounded-full mx-auto">
              <Image
                src={MaPinya}
                alt="Barangay Ma Pinya"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200 rounded-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardTitle>Barangay Mapinya</CardTitle>
            <CardDescription>Magalang, Pampanga</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Focused on Corns and Rice along with Eggplant and tomatoes.</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

export default Dashboard