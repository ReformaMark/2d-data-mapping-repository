"use client"

import Loading from "@/components/loading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "convex/react"
import { BarChart, MapPin, Users, Wheat } from "lucide-react"
import { api } from "../../../../convex/_generated/api"

interface BarangayOverviewProps {
    barangayName: "Turu" | "Balitucan" | "Mapinya"
}

interface PlotWithDetails {
    _id: string;
    area: number;
    status: string;
    yields: number;
    currentCrop: string | null;
    farmerName: string;
}

export function BarangayOverview({ barangayName }: BarangayOverviewProps) {
    const plots = useQuery(api.admin.getBarangayPlots, { 
        name: barangayName 
    }) as PlotWithDetails[] | undefined
    
    const barangayData = useQuery(api.admin.getBarangayDetails, {
        name: barangayName
    })

    if (!plots || !barangayData) return <Loading />

    const stats = [
        {
            title: "Total Area",
            value: `${plots.reduce((sum, plot) => sum + plot.area, 0).toFixed(2)} ha`,
            icon: MapPin,
            description: "Total agricultural area",
            color: "text-emerald-500"
        },
        {
            title: "Active Farmers",
            value: barangayData.farmerCount,
            icon: Users,
            description: "Registered farmers",
            color: "text-blue-500"
        },
        {
            title: "Active Plots",
            value: plots.filter(plot => plot.status === 'active').length,
            icon: Wheat,
            description: "Currently cultivated plots",
            color: "text-amber-500"
        },
        {
            title: "Production Volume",
            value: `${plots.reduce((total, plot) => total + (plot.yields || 0), 0).toFixed(2)} MT`,
            icon: BarChart,
            description: "Total production records",
            color: "text-purple-500"
        }
    ]

    // Calculate chart data from active plots only
    // const chartData = plots
    //     .filter(plot => plot.status === 'active')
    //     .reduce((acc, plot) => {
    //         if (plot.currentCrop) {
    //             const existing = acc.find(item => item.cropType === plot.currentCrop);
    //             if (existing) {
    //                 existing.totalYields += plot.yields || 0;
    //             } else {
    //                 acc.push({
    //                     cropType: plot.currentCrop,
    //                     totalYields: plot.yields || 0
    //                 });
    //             }
    //         }
    //         return acc;
    //     }, [] as { cropType: string, totalYields: number }[]);

    // const COLORS = {
    //     corn: '#FFD700', // Yellow
    //     tomatoes: '#FF0000', // Red
    //     eggplant: '#8A2BE2', // Violet
    //     carrot: '#ffa500', // Orange
    //     rice: '#D2B48C' // Light Brown
    // };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* <Card>
                <CardHeader>
                    <CardTitle>Agricultural Production by Crop Type</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mt-4 flex justify-center items-center">
                        <ul className="list-none grid grid-cols-5">
                            {chartData.map((entry, index) => (
                                <li key={`legend-${index}`} className="flex items-center">
                                    <span
                                        className="inline-block w-10 h-3 mr-2"
                                        style={{ backgroundColor: COLORS[entry.cropType.toLowerCase() as keyof typeof COLORS] }}
                                    ></span>
                                    <span className="capitalize">{entry.cropType}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="totalYields"
                                    nameKey="cropType"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    fill="#8884d8"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {chartData.map((entry) => (
                                        <Cell 
                                            key={`cell-${entry.cropType}`} 
                                            fill={COLORS[entry.cropType.toLowerCase() as keyof typeof COLORS]} 
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value, name, props: any) => [
                                        `${value} tons ${props?.payload?.[0]?.percent ? `(${(props.payload[0].percent * 100).toFixed(2)}%)` : ''}`,
                                        name
                                    ]} 
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card> */}
        </div>
    )
}