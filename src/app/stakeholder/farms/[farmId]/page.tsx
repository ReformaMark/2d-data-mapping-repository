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

function FarmProfilePage({ params }: { params: { farmId: string } }) {
    const farm = useQuery(api.agriculturalPlots.getFarmById, {
        farmId: params.farmId as Id<"agriculturalPlots">
    })

    if (!farm) return <p>Loading...</p>

    return (
        <article className="p-4 max-w-3xl mx-auto">
            <header className="bg-blue-600 text-white p-6">
                <h1 className="text-3xl font-bold">{farm.mapMarker?.title}</h1>
            </header>
            <section className="p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold">Current Crops</h2>
                    <div className="flex space-x-4 mt-2">
                        {farm.cropHistory.map((crop, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                {crop?.name === 'corn' && <Image src={corn.src} alt="Corn" className="w-8 h-8" />}
                                {crop?.name === 'rice' && <Image src={rice.src} alt="Rice" className="w-8 h-8" />}
                                {crop?.name === 'carrots' && <Image src={carrot.src} alt="Carrot" className="w-8 h-8" />}
                                {crop?.name === 'tomatoes' && <Image src={tomatoes.src} alt="Tomatoes" className="w-8 h-8" />}
                                {crop?.name === 'eggplant' && <Image src={eggplant.src} alt="Eggplant" className="w-8 h-8" />}
                                <span className="font-medium">{crop?.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Potential Crops</h2>
                    <div className="flex space-x-4 mt-2">
                        {farm.landUseType.map((type, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                {type === 'corn' && <Image src={corn.src} alt="Corn" className="w-8 h-8" />}
                                {type === 'rice' && <Image src={rice.src} alt="Rice" className="w-8 h-8" />}
                                {type === 'carrots' && <Image src={carrot.src} alt="Carrot" className="w-8 h-8" />}
                                {type === 'tomatoes' && <Image src={tomatoes.src} alt="Tomatoes" className="w-8 h-8" />}
                                {type === 'eggplant' && <Image src={eggplant.src} alt="Eggplant" className="w-8 h-8" />}
                                <span className="font-medium">{type}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Farm Details</h2>
                    <p className="mt-2">Area: <span className="font-normal">{farm.area} hectares</span></p>
                    <p>Possible Yields: <span className="font-normal">{farm.mapMarker?.yields} tons</span></p>
                    <p>Status: <Badge className="ml-1">{farm.status}</Badge></p>
                </div>
            </section>
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