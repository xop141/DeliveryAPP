import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

const SkeletonGrid = () => {
    return (
        <div className='flex gap-[120px]  flex-col'>
           {Array.from({length : 3}).map((skel,index)=>(
            <div key={index} className='flex flex-col gap-[20px]'>
             <div className='flex justify-between'>
             <Skeleton className='w-[150px] h-[30px]' />
             <Skeleton className='w-[150px] h-[30px]' />
         </div>
         <div className='flex justify-between'>
             {Array.from({ length: 5 }).map((skel, index) => (
                 <Skeleton key={index} className='w-[300px] h-[300px]' />
             ))}
         </div>
         </div>
           ))}
        </div>
    )
}

export default SkeletonGrid
