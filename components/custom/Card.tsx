'use client';

import React from 'react'
type CardPropsType = {
    title: string
    points: string[]
    buttons: Array<{
        name: string;
        btnOnClick: () => void;
    }>;
}

const Card = ({title, buttons, points}:CardPropsType) => {
  return (
    <div className='flex flex-col gap-2 md:gap-4 bg-orange-400 p-8 rounded-md'>
        <div>
            <h1 className='text-4xl'>
                {/* title */}
                {title}
            </h1>
        </div>
        <div>
            {/* points */}
            <ul className='flex flex-col gap-2 list-disc pl-6'>
                {points.map((point, index) => (
                    <li key={index} className='hover:inset-10'>{point}</li>
                ))}
            </ul>
        </div>
        <div>
            {/* buttons */}
            {
                buttons.map((btn, idx) => (
                    <button onClick={btn.btnOnClick} key={idx} className='bg-blue-700 text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4'>{btn.name}</button>
                ))
            }
        </div>
    </div>
  )
}

export default Card