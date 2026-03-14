import { Chat, Clock, DotsThreeVertical, VideoCamera, X, Prohibit } from '@phosphor-icons/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleBlockUser } from '../../redux/slices/conversation'

export default function UserInfo({ handleToggleUserInfo, participant, isGroup }) {
    const dispatch = useDispatch();
    const { blockedUsers } = useSelector((state) => state.conversation);
    const isBlocked = participant ? blockedUsers.includes(participant._id) : false;
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

            <div className='px-6 flex flex-col space-y-4'>
                <div className='flex flex-row space-x-2'>
                    <button className='w-full border border-stroke dark:border-strokedark p-2 rounded-md flex flex-row items-center justify-center hover:bg-gray-2 dark:hover:bg-boxdark-2'>
                        <Chat size={20} className='mr-3' />
                        Message
                    </button>
                    <button className='w-full border border-stroke dark:border-strokedark p-2 rounded-md flex flex-row items-center justify-center hover:bg-gray-2 dark:hover:bg-boxdark-2'>
                        <VideoCamera size={20} className='mr-3' />
                        Huddle
                    </button>
                    <button className='border border-stroke dark:border-strokedark p-2 rounded-md flex flex-row items-center justify-center hover:bg-gray-2 dark:hover:bg-boxdark-2'>
                        <DotsThreeVertical size={20} />
                    </button>
                </div>

                {!isGroup && participant && (
                    <button 
                        onClick={() => dispatch(toggleBlockUser(participant._id))}
                        className={`w-full border border-stroke dark:border-strokedark p-2 rounded-md flex flex-row items-center justify-center hover:bg-gray-2 dark:hover:bg-boxdark-2 transition-colors ${
                            isBlocked ? 'text-black dark:text-white' : 'text-danger'
                        }`}
                    >
                        <Prohibit size={20} className='mr-3' />
                        {isBlocked ? 'Unblock User' : 'Block User'}
                    </button>
                )}
            </div>
        </div>
    )
}
