import Image from 'next/image';
import React from 'react'

const url = 'https://www.course-api.com/images/tours/tour-1.jpeg';
function page({params}:{params:{id:string[]}}) {
  return (
    <div>
        {params.id}
          <Image
            src={url}
            alt='tour'
            width={192}
            height={192}
            priority
            className='w-48 h-48 object-cover rounded'
          />
          <h2>remote image</h2>
    </div>
  )
}

export default page
