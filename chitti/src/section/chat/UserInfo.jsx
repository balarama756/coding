import { Chat, Clock, DotsThreeVertical, VideoCamera, X } from '@phosphor-icons/react'
import React from 'react'

export default function UserInfo({ handleToggleUserInfo, participant }) {
    return (
        <div className='border-l flex flex-col h-full border-stroke dark:border-strokedark'>
            <div className='sticky border-b border-stroke dark:border-strokedark flex flex-row items-center justify-between w-full px-6 py-7.5'>
                <div className='text-black dark:text-white font-semibold text-lg'>Profile</div>
                <button onClick={handleToggleUserInfo}>
                    <X size={24} />
                </button>
            </div>

            <div className='mx-auto my-8'>
                <img
                    src={participant?.avatar || `https://ui-avatars.com/api/?name=${participant?.name}&size=176`}
                    className='w-44 h-44 rounded-lg object-cover object-center'
                    alt={participant?.name}
                />
            </div>

            <div className='px-6 space-y-1'>
                <div className='text-black dark:text-white text-xl font-medium'>
                    {participant?.name || 'Unknown User'}
                </div>
                <span className='text-body text-md'>{participant?.jobTitle || ''}</span>
            </div>

            <div className='px-6 my-6'>
                <div className='flex flex-row items-center space-x-2'>
                    <span className={`h-2.5 w-2.5 rounded-full ${participant?.status === 'Online' ? 'bg-success' : 'bg-gray-400'}`}></span>
                    <div>{participant?.status || 'Offline'}</div>
                </div>
                {participant?.bio && (
                    <p className='mt-3 text-sm text-body'>{participant.bio}</p>
                )}
            </div>

            <div className='px-6 flex flex-row space-x-2'>
                <button className='w-full border border-stroke dark:border-strokedark p-2 rounded-md flex flex-row items-center justify-center'>
                    <Chat size={20} className='mr-3' />
                    Message
                </button>
                <button className='w-full border border-stroke dark:border-strokedark p-2 rounded-md flex flex-row items-center justify-center'>
                    <VideoCamera size={20} className='mr-3' />
                    Huddle
                </button>
                <button className='border border-stroke dark:border-strokedark p-2 rounded-md flex flex-row items-center justify-center'>
                    <DotsThreeVertical size={20} />
                </button>
            </div>
        </div>
    )
}
