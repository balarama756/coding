import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function index() {
    return (
        <div className='h-screen overflow-hidden pb-14 sm:pb-0'>
            <div className='h-full rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex'>
                {/* sidebar - hidden on mobile */}
                <div className='hidden sm:flex'>
                    <Sidebar />
                </div>
                <Outlet />
            </div>
        </div>
    )
}
