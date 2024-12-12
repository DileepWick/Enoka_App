import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/authContext/'
import { doSignOut } from '../../../backend/firebase/auth'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    
    return (
        <nav className="flex items-center justify-between w-full fixed top-0 left-0 h-16 px-4 md:px-6 border-b border-gray-200 bg-white shadow-sm z-20">
            <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-blue-600">YourLogo</Link>
            </div>
            <div className="flex items-center space-x-4">
                {userLoggedIn ? (
                    <button 
                        onClick={() => { doSignOut().then(() => { navigate('/login') }) }}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link 
                            to="/login"
                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/signup"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Header

