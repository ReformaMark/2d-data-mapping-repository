'use client';

import { useEffect, useState } from 'react';
import { scrapeAndExtractPrices } from '../../../../actions/scrape';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import corn from '@/../public/images/corn.png';
import rice from '@/../public/images/rice.png';
import carrot from '@/../public/images/carrots.png';
import tomatoes from '@/../public/images/tomatoes.png';
import eggplant from '@/../public/images/eggplant.png';
import Image from 'next/image';

interface Data {
  product: string;
  range: string;
}
export default function PriceDisplay() {
  const [prices, setPrices] = useState<Data[]> ([]);
  const [date, setDate] = useState<string| undefined> ();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleScrape(); 
  },[])

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    setPrices([]);

    try {
      const response = await scrapeAndExtractPrices();

      if (response.data) {
        setPrices(response.data);
        setDate(response.date);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };
  const findProduct = (productName: string) => {
    return prices.find(price => price.product.toLowerCase() === productName.toLowerCase());
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Price Monitoring</h1>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!loading ? prices.length > 0 && (
        <div className="mt-4">
          <Card>
         
              <CardHeader>
                <CardTitle>Retail Price of Selected Agri-fishery Commodities as of {date} (Market Price)</CardTitle>
                <CardDescription>Source: https://www.da.gov.ph/price-monitoring/ (Daily Retail Price Range)</CardDescription>
              </CardHeader>
              <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center  w-1/4">
                    <Image src={rice} alt="Rice" width={50} height={50} className=''/>
                    <span className='font-semibold text-xs'>(Rice Per KG)</span>
                  </div>
                  <div className="font-semibold flex-1">
                    <p> <span className='w-1/3 inline-block'>{findProduct("Special Rice")?.product}:</span>  <span className="font-medium">{findProduct("Special Rice")?.range}</span></p>
                    <p> <span className='w-1/3 inline-block'>{findProduct("Premium Rice")?.product}:</span> <span className="font-medium">{findProduct("Premium Rice")?.range}</span></p>
                    <p> <span className='w-1/3 inline-block'>{findProduct("Well Milled Rice")?.product}:</span> <span className="font-medium">{findProduct("Well Milled Rice")?.range}</span></p>
                    <p> <span className='w-1/3 inline-block'>{findProduct("Regular Milled Rice")?.product}:</span> <span className="font-medium">{findProduct("Regular Milled Rice")?.range}</span></p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center w-1/4">
                    <Image src={corn} alt="Corn" width={50} height={50} className=''/>
                    <span className='font-semibold text-xs'>(Corn Per KG)</span>

                  </div>
                  <div className="font-semibold flex-1">
                    <p><span className='w-1/3 inline-block'>{findProduct("Corn (White)")?.product}:</span> <span className="font-medium">{findProduct("Corn (White)")?.range}</span></p>
                    <p><span className='w-1/3 inline-block'>{findProduct("Corn (Yellow)")?.product}:</span> <span className="font-medium">{findProduct("Corn (Yellow)")?.range}</span></p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center  w-1/4">
                    <Image src={carrot} alt="Carrot" width={50} height={50} className=''/>
                    <span className='font-semibold text-xs'>(Carrot Per KG)</span>

                  </div>
                  <div className="font-semibold flex-1">
                    <p><span className='w-1/3 inline-block'>{findProduct("Carrot (Karot)")?.product}:</span> <span className="font-medium">{findProduct("Carrot (Karot)")?.range}</span></p>
                 
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center  w-1/4">
                    <Image src={tomatoes} alt="Tomato" width={50} height={50} className=''/>
                    <span className='font-semibold text-xs'>(Tomatoes Per KG)</span>

                  </div>
                  <div className="font-semibold flex-1">
                    <p><span className='w-1/3 inline-block'>{findProduct("Tomato")?.product}:</span> <span className="font-medium">{findProduct("Tomato")?.range}</span></p>
                 
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center  w-1/4">
                    <Image src={eggplant} alt="Eggplant" width={50} height={50} className=''/>
                    <span className='font-semibold text-xs'>(Eggplant Per KG)</span>

                  </div>
                  <div className="font-semibold flex-1">
                    <p><span className='w-1/3 inline-block'>{findProduct("Eggplant (Talong)")?.product}:</span> <span className="font-medium">{findProduct("Eggplant (Talong)")?.range}</span></p>
                 
                  </div>
                </div>
              </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="flex items-center justify-center h-40">
          <p className="mt-4">Fetching and reading data from the source...</p>
        </Card>
      )}
    </div>
  );
}
