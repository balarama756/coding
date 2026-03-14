import { Chat, ChatTeardropText, SignOut, UserCircle } from '@phosphor-icons/react';
import React, { useState } from 'react';
import DarkModeSwitcher from '../components/DarkModeSwitcher';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LogoutUser } from '../redux/slices/auth';

const NAVIGATION = [
    {
        key: 0,
        title: 'DMs',
        icon: <Chat size={24} />,
        path: '/dashboard'
    },
    {
        key: 1,
        title: 'Profile',
        icon: <UserCircle size={24} />,
        path: '/dashboard/profile'
    },

];


export default function Sidebar() {

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selected, setSelected] = useState(0);

    const handleClick = (key) => {
        navigate(NAVIGATION[key].path);
        setSelected(key);

    }
    return (
        <>
        {/* Desktop sidebar */}
        <div className='hidden sm:flex flex-col border-r border-stroke p-2 dark:border-strokedark'>


            <div className='flex flex-col items-center space-y-5'>
                <ChatTeardropText size={32} weight='bold' className='text-primary' />


                {NAVIGATION.map(({ icon, key, title }) => <div key={key} className='space-y-2 flex flex-col text-center hover:cursor-pointer hover:text-primary' onClick={() => { handleClick(key) }}>

                    <div className={`mx-auto border rounded-md border-stroke p-2 dark:border-strokedark ${selected === key && 'bg-primary bg-opacity-90 text-white'} hover:border-primary dark:hover:border-primary`}>
                        {icon}
                    </div>
                    <span className={`font-medium text-sm ${selected === key && 'text-primary'}`}>{title}</span>

                </div>
                )}
            </div>

            <div className='flex flex-col grow'></div>

            <div className='space-y-4.5'>

                <div className='flex flex-row items-center justify-center'>
                    <DarkModeSwitcher />
                </div>


                <button onClick={() => {
                    dispatch(LogoutUser(navigate));
                }} className=' w-full flex flex-row items-center justify-center border rounded-md border-stroke p-2 dark:border-strokedark hover:bg-stone-100 hover:cursor-pointer'>
                    <SignOut size={24} />
                </button>

            </div>
        </div>

        {/* Mobile bottom nav */}
        <div className='sm:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-stroke bg-white dark:bg-boxdark dark:border-strokedark px-4 py-2'>
            {NAVIGATION.map(({ icon, key, title, path }) => (
                <button
                    key={key}
                    onClick={() => { navigate(path); setSelected(key); }}
                    className={`flex flex-col items-center gap-0.5 text-xs ${
                        selected === key ? 'text-primary' : 'text-gray-500'
                    }`}
                >
                    {icon}
                    <span>{title}</span>
                </button>
            ))}
            <button
                onClick={() => dispatch(LogoutUser(navigate))}
                className='flex flex-col items-center gap-0.5 text-xs text-gray-500'
            >
                <SignOut size={24} />
                <span>Logout</span>
            </button>
        </div>
        </>
    )
}
