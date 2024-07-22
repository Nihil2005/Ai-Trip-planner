import React, { useEffect } from 'react'
import { Button } from '../ui/button'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';





const Header = () => {
  const user= JSON.parse(localStorage.getItem('user'));
  
  useEffect(()=>{
    console.log(user)

  },[])

  return (
    <div className='p-2 shadow-sm flex justify-between items-center px-5' >
      <img src='logo.svg'/>
<div>
  {user?
  <div>
    
    
    <Popover>
  <PopoverTrigger>
  <img src={user?.picture} className='h-[35px] w-[35px] rounded-3xl' />
    
  </PopoverTrigger>
  <PopoverContent>
    <h2 className='cursor-pointer' onClick={()=>{
      googleLogout();

      localStorage.removeItem('user');
      window.location.reload();
    
    }} >Logout</h2>
  </PopoverContent>
</Popover>


  </div>:
  <Button>Sign in</Button>
  
}
  
</div>
    </div>
  )
}

export default Header