'use client'
import { useMutation, useQuery } from 'convex/react'
import React, { useState } from 'react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import corn from '@/../public/images/corn.png';
import rice from '@/../public/images/rice.png';
import carrot from '@/../public/images/carrots.png';
import tomatoes from '@/../public/images/tomatoes.png';
import eggplant from '@/../public/images/eggplant.png';
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { MessageSquareIcon, Mountain } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useCurrentUser } from '@/features/users/api/use-current-user'
import Loading from '@/components/loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'

function FarmProfilePage({ params }: { params: { farmId: string } }) {
    const farm = useQuery(api.agriculturalPlots.getFarmById, {
        farmId: params.farmId as Id<"agriculturalPlots">
    })
    const [messageValue, setMessageValue] = useState<string>('')
    const [open, setOpen] = useState(false)
    const sendMessage = useMutation(api.chats.sendMessage)
    const user = useCurrentUser()

    const handleSend = async() => {
      if (messageValue === "") {
          toast.error("Invalid message! Please Try again.")
          return
      }
      if (farm?.userId) {
          toast.promise(sendMessage({
              recieverId: farm.userId as Id<'users'>,
              message: messageValue
          }),
          {
              loading: 'Sending your message...',
              success: "Message sent.",
              error: "Unable to send your message."
          })
          setMessageValue("")
          setOpen(false)
      } else {
          toast.warning("Please select user first.")
      }
  }

    if (!farm) return <Loading/>

    return (
        <article className="p-4  w-full bg-white rounded-md shadow-md"> 
            <header className="bg-gray-100 p-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold flex gap-x-10 uppercase"><Mountain className='text-green' color='green'/> {farm.mapMarker?.title}</h1>
                {user?.data?._id !== farm.userId && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger onClick={()=>setOpen(!open)} className='flex flex-col items-center justify-center hover:text-green-500 transition-colors duration-300 ease-in'>
                            <MessageSquareIcon />
                            <h5>Send Message</h5>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Send a Message</DialogTitle>
                                <DialogDescription>
                                    Write your message below:
                                </DialogDescription>
                            </DialogHeader>
                            <Textarea 
                              value={messageValue} 
                              onChange={(e) => {
                                    setMessageValue(e.target.value)
                                }}
                              placeholder="Type your message here..." 
                              className="w-full" />
                            <DialogFooter>
                                <Button onClick={handleSend}>Send</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </header>
            <section className="p-6 space-y-6">
                <div className="col-span-2 flex justify-end">

                </div>
                <div className="grid grid-cols-2 items-start">
                    <div>
                        <h2 className="text-xl font-semibold">Current Crops</h2>
                        <div className="flex space-x-4 mt-2">
                            {farm.cropHistory.map((crop, index) => (
                                <div key={index} className="flex items-center space-x-2 capitalize">
                                    {crop?.name === 'corn' && <Image height={200} width={200} src={corn.src} alt="Corn" className="w-8 h-8" />}
                                    {crop?.name === 'rice' && <Image height={200} width={200} src={rice.src} alt="Rice" className="w-8 h-8" />}
                                    {crop?.name === 'carrot' && <Image height={200} width={200} src={carrot.src} alt="Carrot" className="w-8 h-8" />}
                                    {crop?.name === 'tomatoes' && <Image height={200} width={200} src={tomatoes.src} alt="Tomatoes" className="w-8 h-8" />}
                                    {crop?.name === 'eggplant' && <Image height={200} width={200} src={eggplant.src} alt="Eggplant" className="w-8 h-8" />}
                                    <span className="font-medium">{crop?.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Potential Crops</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 mt-2">
                            {farm.landUseType.map((type, index) => (
                                <div key={index} className="flex items-center space-x-2 capitalize">
                                    {type === 'corn' && <Image height={200} width={200} src={corn.src} alt="Corn" className="w-8 h-8" />}
                                    {type === 'rice' && <Image height={200} width={200} src={rice.src} alt="Rice" className="w-8 h-8" />}
                                    {type === 'carrots' && <Image height={200} width={200} src={carrot.src} alt="Carrot" className="w-8 h-8" />}
                                    {type === 'tomatoes' && <Image height={200} width={200} src={tomatoes.src} alt="Tomatoes" className="w-8 h-8" />}
                                    {type === 'eggplant' && <Image height={200} width={200} src={eggplant.src} alt="Eggplant" className="w-8 h-8" />}
                                    <span className="font-medium">{type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='w-full'>
                    <h2 className="text-xl font-semibold">Farm Details</h2>
                    <div className="grid grid-cols-3">
                        <p className="mt-2"><span className="font-semibold">Area:</span> <span className="font-normal">{farm.area} hectares</span></p>
                        <p><span className="font-semibold">Possible Yields:</span> <span className="font-normal">{farm.mapMarker?.yields} tons</span></p>
                        <p><span className="font-semibold">Status:</span> <Badge className="ml-1">{farm.status}</Badge></p>
                    </div>
                </div>
            </section>
            <Separator className='my-5'/>
            <section className="p-6 space-y-6">
                <div>
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold">Crop Management</h2>
                       
                    </div>
                    {farm.cropManagement ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fertilizer Application */}
                    <Card className="bg-white shadow-md">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="text-gray-700 font-bold">Fertilizer Application</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600">Type:</span>
                          <Badge>{farm.cropManagement.fertilizerApplication.type || "N/A"}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600">Quantity:</span>
                          <Badge>{farm.cropManagement.fertilizerApplication.quantity || 0} kg</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600">Schedule:</span>
                          <Badge>{farm.cropManagement.fertilizerApplication.applicationSchedule || "No schedule provided"}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  
                    {/* Pest and Disease Control */}
                    <Card className="bg-white shadow-md">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="text-gray-700 font-bold">Pest and Disease Control</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-gray-600">Pests:</span>
                          {farm.cropManagement.pestAndDiseaseControl.pests.length > 0 ? (
                            farm.cropManagement.pestAndDiseaseControl.pests.map((pest, index) => (
                              <Badge key={index} className="bg-green-100 text-green-700">
                                {pest}
                              </Badge>
                            ))
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600">None</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-gray-600">Diseases:</span>
                          {farm.cropManagement.pestAndDiseaseControl.diseases.length > 0 ? (
                            farm.cropManagement.pestAndDiseaseControl.diseases.map((disease, index) => (
                              <Badge key={index} className="bg-red-100 text-red-700">
                                {disease}
                              </Badge>
                            ))
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600">None</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-gray-600">Control Measures:</span>
                          {farm.cropManagement.pestAndDiseaseControl.controlMeasures.length > 0 ? (
                            farm.cropManagement.pestAndDiseaseControl.controlMeasures.map((measure, index) => (
                              <Badge key={index} className="bg-blue-100 text-blue-700">
                                {measure}
                              </Badge>
                            ))
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600">None</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  
                    {/* Crop Rotation Plan */}
                    <Card className="bg-white shadow-md">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="text-gray-700 font-bold">Crop Rotation Plan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          {farm.cropManagement.cropRotationPlan.schedule || "No schedule provided"}
                        </p>
                      </CardContent>
                    </Card>
                  
                    {/* Growth Monitoring */}
                    <Card className="bg-white shadow-md">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="text-gray-700 font-bold">Growth Monitoring</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600">Stage:</span>
                          <Badge>{farm.cropManagement.growthMonitoring.growthStage || "N/A"}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-gray-600">Health Assessments:</span>
                          {farm.cropManagement.growthMonitoring.healthAssessments.length > 0 ? (
                            farm.cropManagement.growthMonitoring.healthAssessments.map((assessment, index) => (
                              <Badge key={index} className="bg-yellow-100 text-yellow-700">
                                {assessment}
                              </Badge>
                            ))
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600">None</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  
                    {/* Harvesting Methods */}
                    <Card className="bg-white shadow-md">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="text-gray-700 font-bold">Harvesting Methods</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge className="bg-purple-100 text-purple-700">
                          {farm.cropManagement.harvestingMethods || "Not specified"}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                  
                     
                    ) : (
                        <p>The owner or the farmer has not yet provided crop management information.</p>
                    )}
                </div>
                <Separator className='my-5'/>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className='flex justify-between items-center'>
                            <h2 className="text-2xl font-semibold text-gray-800">Soil Information</h2>
                        
                        </div>
                        {farm.soilInfo ? (
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Type:</strong> {farm.soilInfo.type}</p>
                                <p><strong>pH Level:</strong> {farm.soilInfo.pH}</p>
                                <p><strong>Texture:</strong> {farm.soilInfo.texture}</p>
                                <p><strong>Nutrient Content:</strong> Nitrogen - {farm.soilInfo.nutrientContent.nitrogen}, Phosphorus - {farm.soilInfo.nutrientContent.phosphorus}, Potassium - {farm.soilInfo.nutrientContent.potassium}</p>
                                <p><strong>Moisture:</strong> Current - {farm.soilInfo.moisture.current}, Historical - {farm.soilInfo.moisture.historical.join(', ')}</p>
                                <p><strong>Erosion Risk:</strong> {farm.soilInfo.erosionRisk}</p>
                            </div>
                        ) : (
                            <p className="text-red-500">The owner or the farmer has not yet provided soil health information.</p>
                        )}
                    </div>
                    <div className="space-y-6">
                        <div className='flex justify-between items-center'>
                            <h2 className="text-2xl font-semibold text-gray-800">Irrigation</h2>
                
                        </div>
                        {farm.irrigationSystem ? (
                            <div className="space-y-2 text-gray-700">
                                <p><strong>System:</strong> {farm.irrigationSystem}</p>
                                <p><strong>Water Source:</strong> {farm.waterSource}</p>
                                <p><strong>Water Usage:</strong> {farm.waterUsage} liters</p>
                                <p><strong>Rainfall Data:</strong> Season - {farm.rainfallData?.season}, Amount - {farm.rainfallData?.rainfallAmount} mm</p>
                            </div>
                        ) : (
                            <p className="text-red-500">The owner or the farmer has not yet provided irrigation information.</p>
                        )}
                    </div>
                    <div className="space-y-6">
                        <div className='flex justify-between items-center'>
                            <h2 className="text-2xl font-semibold text-gray-800">Farm Infrastructure</h2>
                    
                        </div>
                        {farm.farmInfrastructure ? (
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Storage Facilities:</strong> {farm.farmInfrastructure.storageFacilities.join(', ')}</p>
                                <p><strong>Farm Equipment:</strong> {farm.farmInfrastructure.farmEquipment.join(', ')}</p>
                                <p><strong>Transportation:</strong> {farm.farmInfrastructure.transportation.join(', ')}</p>
                            </div>
                        ) : (
                            <p className="text-red-500">The owner or the farmer has not yet provided farm infrastructure information.</p>
                        )}
                    </div>
                    <div className="space-y-6">
                        <div className='flex justify-between items-center'>
                            <h2 className="text-2xl font-semibold text-gray-800">Owner Information</h2>
    
                        </div>
                        {farm.ownership?.owner ? (
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Owner Name:</strong> {farm.ownership.owner.name}</p>
                                <p><strong>Owner Contact:</strong> {farm.ownership.owner.contact}</p>
                                <p><strong>Owner Role:</strong> {farm.ownership.owner.role}</p>
                            </div>
                        ) : (
                            <p className="text-red-500">The owner or the farmer has not yet provided owner information.</p>
                        )}
                    </div>
                </div>
            </section>
        </article>
    )
}

export default FarmProfilePage