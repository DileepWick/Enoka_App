import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/authContext/'
import { doSignOut } from '../../../backend/firebase/auth'
import { Button } from '@nextui-org/react'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    
    return (
        <nav className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200'>
            {
                userLoggedIn
                    ?
                    <>
                        <Button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='bg-black text-white'>Logout</Button>
                    </>
                    :
                    <>
                        <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
                        <Link className='text-sm text-blue-600 underline' to={'/signup'}>Register New Account</Link>
                    </>
            }

        </nav>
    )
}

export default Header