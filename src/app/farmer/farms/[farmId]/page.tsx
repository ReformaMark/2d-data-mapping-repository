'use client'
import { useQuery } from 'convex/react'
import React from 'react'
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
import Link from 'next/link'
import { useCurrentUser } from '@/features/users/api/use-current-user'
import Loading from '@/components/loading'

function FarmProfilePage({ params }: { params: { farmId: string } }) {
    const farm = useQuery(api.agriculturalPlots.getFarmById, {
        farmId: params.farmId as Id<"agriculturalPlots">
    })
    const user = useCurrentUser()

    if (!farm) return <Loading/>

    return (
        <article className="p-4  w-full bg-white rounded-md shadow-md"> 
            <header className="bg-gray-100 p-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold flex gap-x-10 uppercase"><Mountain className='text-green' color='green'/> {farm.mapMarker?.title}</h1>
                {user?.data?._id !== farm.userId && (
                    <Link href={`/farmer/message?sendMessageTo=${farm.user._id}`} className='flex flex-col items-center justify-center hover:text-green-500 transition-colors duration-300 ease-in'><MessageSquareIcon/><h5>Send Message</h5></Link>
                )}
            </header>
            <section className="p-6 space-y-6 ">
                <div className="grid grid-cols-2 items-center">
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
                        <div className="">
                        <h2 className="text-xl font-semibold">Potential Crops</h2>
                            <div className="flex space-x-4 mt-2">
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
                </div>
                <Separator className='my-5'/>
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
                    <h2 className="text-xl font-semibold">Crop Management</h2>
                    {farm.cropManagement ? (
                        <div className="space-y-2">
                            <p>Fertilizer Application: {farm.cropManagement.fertilizerApplication.type}, {farm.cropManagement.fertilizerApplication.quantity} kg, Schedule: {farm.cropManagement.fertilizerApplication.applicationSchedule}</p>
                            <p>Pest and Disease Control: Pests - {farm.cropManagement.pestAndDiseaseControl.pests.join(', ')}, Diseases - {farm.cropManagement.pestAndDiseaseControl.diseases.join(', ')}, Control Measures - {farm.cropManagement.pestAndDiseaseControl.controlMeasures.join(', ')}</p>
                            <p>Crop Rotation Plan: {farm.cropManagement.cropRotationPlan.schedule}</p>
                            <p>Growth Monitoring: Stage - {farm.cropManagement.growthMonitoring.growthStage}, Health Assessments - {farm.cropManagement.growthMonitoring.healthAssessments.join(', ')}</p>
                            <p>Harvesting Methods: {farm.cropManagement.harvestingMethods}</p>
                        </div>
                    ) : (
                        <p>The owner or the farmer has not yet provided crop management information.</p>
                    )}
                </div>
                <Separator className='my-5'/>
                <div>
                    <h2 className="text-xl font-semibold">Soil Health</h2>
                    {farm.soilInfo ? (
                        <div className="space-y-2">
                            <p>Type: {farm.soilInfo.type}</p>
                            <p>pH Level: {farm.soilInfo.pH}</p>
                            <p>Texture: {farm.soilInfo.texture}</p>
                            <p>Nutrient Content: Nitrogen - {farm.soilInfo.nutrientContent.nitrogen}, Phosphorus - {farm.soilInfo.nutrientContent.phosphorus}, Potassium - {farm.soilInfo.nutrientContent.potassium}</p>
                            <p>Moisture: Current - {farm.soilInfo.moisture.current}, Historical - {farm.soilInfo.moisture.historical.join(', ')}</p>
                            <p>Erosion Risk: {farm.soilInfo.erosionRisk}</p>
                        </div>
                    ) : (
                        <p>The owner or the farmer has not yet provided soil health information.</p>
                    )}
                </div>
                <Separator className='my-5'/>
                <div>
                    <h2 className="text-xl font-semibold">Irrigation</h2>
                    {farm.irrigationSystem ? (
                        <div className="space-y-2">
                            <p>System: {farm.irrigationSystem}</p>
                            <p>Water Source: {farm.waterSource}</p>
                            <p>Water Usage: {farm.waterUsage} liters</p>
                            <p>Rainfall Data: Season - {farm.rainfallData?.season}, Amount - {farm.rainfallData?.rainfallAmount} mm</p>
                        </div>
                    ) : (
                        <p>The owner or the farmer has not yet provided irrigation information.</p>
                    )}
                </div>
                <Separator className='my-5'/>
                <div>
                    <h2 className="text-xl font-semibold">Farm Infrastructure</h2>
                    {farm.farmInfrastructure ? (
                        <div className="space-y-2">
                            <p>Storage Facilities: {farm.farmInfrastructure.storageFacilities.join(', ')}</p>
                            <p>Farm Equipment: {farm.farmInfrastructure.farmEquipment.join(', ')}</p>
                            <p>Transportation: {farm.farmInfrastructure.transportation.join(', ')}</p>
                        </div>
                    ) : (
                        <p>The owner or the farmer has not yet provided farm infrastructure information.</p>
                    )}
                </div>
                <Separator className='my-5'/>
                <div>
                    <h2 className="text-xl font-semibold">Financial Information</h2>
                    {farm.financialInformation ? (
                        <div className="space-y-2">
                            <p>Input Costs: Seeds - {farm.financialInformation.inputCosts.seeds}, Fertilizers - {farm.financialInformation.inputCosts.fertilizers}, Labor - {farm.financialInformation.inputCosts.labor}, Equipment - {farm.financialInformation.inputCosts.equipment}</p>
                            <p>Production Costs: Cost per Hectare - {farm.financialInformation.productionCosts.costPerHectare}</p>
                            <p>Market Value: Current Price - {farm.financialInformation.marketValue.currentPrice}, Expected Price - {farm.financialInformation.marketValue.expectedPrice}</p>
                            <p>Profit Margins: Expected Profit - {farm.financialInformation.profitMargins.expectedProfit}</p>
                        </div>
                    ) : (
                        <p>The owner or the farmer has not yet provided financial information.</p>
                    )}
                </div>
            </section>
        </article>
    )
}

export default FarmProfilePage