import React, { useState, useEffect } from 'react';
import { doUpdateUserSignInWithGoogle } from '../../../backend/firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // For API requests

const GoogleSignIn = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [telephone, setTelephone] = useState('');
    const [branchId, setBranchId] = useState('');
    const [branches, setBranches] = useState([]);
    const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoadingBranches, setIsLoadingBranches] = useState(true);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get('https://enokaback-6acbbcbf5c24.herokuapp.com/api/branches'); // Adjust the API URL
                if (Array.isArray(response.data)) {
                    setBranches(response.data); // Set only if response is an array
                    console.log(response.data);
                } else {
                    console.error('Invalid branch data:', response.data);
                    setBranches([]); // Default to an empty array if response is invalid
                }
            } catch (error) {
                console.error('Error fetching branches:', error);
                setErrorMessage('Failed to load branches');
                setBranches([]); // Set to an empty array on error
            } finally {
                setIsLoadingBranches(false);
            }
        };
        fetchBranches();
    }, []);

    const handleSignInWithGoogle = async () => {
        try {
            const response = await doSignInWithGoogle(firstName, lastName, telephone, branchId);
            if (response.user && !response.user.firstName) {
                // If user is new and details are missing
                setIsFirstTimeUser(true);
            } else {
                navigate('/home'); // Redirect after successful sign-in
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };




    //   const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     await handleSignInWithGoogle();
    //   };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            if (!branchId) {
                setErrorMessage('Please select a branch');
                return;
            }
            setIsRegistering(true);
            try {
                await doUpdateUserSignInWithGoogle(firstName, lastName, telephone, branchId);
                navigate('/home'); // Redirect after successful registration
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsRegistering(false);
            }
        }
    };

    return (
        <div className="w-full h-screen flex justify-center items-center">

            <form onSubmit={handleSubmit} className="w-96 p-4 border rounded-lg shadow-md space-y-4">
                <h3 className="text-xl font-bold">Complete Your Profile</h3>
                <div>
                    <label className="text-sm font-bold">First Name</label>
                    <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label className="text-sm font-bold">Last Name</label>
                    <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label className="text-sm font-bold">Telephone</label>
                    <input
                        type="tel"
                        required
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600 font-bold">Branch</label>
                    {isLoadingBranches ? (
                        <select
                            disabled
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-gray-200 outline-none border shadow-sm rounded-lg"
                        >
                            <option>Loading branches...</option>
                        </select>
                    ) : branches.length > 0 ? (
                        <select
                            required
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                        >
                            <option value="">Select Branch</option>
                            {branches.map((branch) => (
                                <option key={branch._id} value={branch._id}>
                                    {branch.name}-{branch.location}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="mt-2 text-red-600 font-bold">
                            No branches available yet. Please check back later.
                        </div>
                    )}
                </div>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                    Save Details
                </button>
            </form>

        </div>
    );
};

export default GoogleSignIn;
