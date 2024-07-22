import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='flex flex-col items-center mx-56 gpa-9'>
        <h1 className='font-extrabold text-center text-[30px]' >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus vol
        </h1>
<Link to={'/create-trip'}>
<Button className='mt-3'>Get Started Its Free</Button>
</Link>
    </div>
  )
}

export default Hero