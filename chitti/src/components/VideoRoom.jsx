import { Microphone, MicrophoneSlash, PhoneDisconnect, VideoCamera, VideoCameraSlash } from '@phosphor-icons/react'
import React, { useState } from 'react'

export default function VideoRoom({ open, handleClose, currentUser, otherUser, groupName, groupAvatar, isGroup }) {

    const [muteAudio, setMuteAudio] = useState(false);
    const [muteVideo, setMuteVideo] = useState(false);

    const handleToggleAudio = () => {
        setMuteAudio((p) => !p);
    }
    const handleToggleVideo = () => {
        setMuteVideo((p) => !p);
    }

    const myAvatar = currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'You'}`;
    const theirName = isGroup ? groupName : (otherUser?.name || 'Unknown');
    const theirAvatar = isGroup 
        ? (groupAvatar || `https://ui-avatars.com/api/?name=${groupName}&background=6366f1&color=fff`)
        : (otherUser?.avatar || `https://ui-avatars.com/api/?name=${otherUser?.name || 'Unknown'}`);

    return (
        <div className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${open ? 'block' : 'hidden'}`}>
            <div className='w-full max-w-142.5 rounded-lg bg-white dark:bg-boxdark md:py-8 px-8 py-12 '>

                <div className='flex flex-col space-y-6'>

                    {/* Video feed Grid */}

                    <div className='grid grid-cols-2 gap-4 h-50 mb-4'>
                        {/* Video Feed 1 */}
                        <div className='relative h-full w-full bg-gray dark:bg-boxdark-2 rounded-md flex items-center justify-center'>
                            <div className='space-y-2 flex flex-col items-center'>
                                <img src={myAvatar} alt='You' className='h-20 w-20 rounded-full object-center object-cover' />
                                <div className='font-medium text-sm text-center'>You</div>
                            </div>

                            <div className='absolute top-3 right-4'>
                                {muteAudio && <MicrophoneSlash size={20} className='text-primary' />}
                            </div>

                        </div>

                        {/* Video Feed 2 */}

                        <div className='relative h-full w-full bg-gray dark:bg-boxdark-2 rounded-md flex items-center justify-center'>
                            <div className='space-y-2 flex flex-col items-center'>
                                <img src={theirAvatar} alt={theirName} className='h-20 w-20 rounded-full object-center object-cover' />
                                <div className='font-medium text-sm text-center truncate max-w-xs px-2'>{theirName}</div>
                            </div>

                            <div className='absolute top-3 right-4'>
                                <MicrophoneSlash size={20} className='text-primary' />
                            </div>

                        </div>
                    </div>


                    {/* Call controls  */}

                    <div className='flex flex-row items-center justify-center space-x-4'>
                        {/* Microphone Button */}

                        <button onClick={handleToggleAudio} className='p-3 rounded-md bg-gray dark:bg-boxdark text-black dark:text-white hover:bg-opacity-80 flex items-center justify-center'>
                            {muteAudio ? <MicrophoneSlash size={20} /> : <Microphone size={20} />}
                        </button>

                        {/* Disconnecting */}

                        <button onClick={handleClose} className='p-3 rounded-full bg-red text-white hover:bg-opacity-80'>
                            <PhoneDisconnect size={20} />
                        </button>

                        {/* Video camera  button*/}
                        <button onClick={handleToggleVideo} className='p-3 rounded-md bg-gray dark:bg-boxdark text-black dark:text-white hover:bg-opacity-80 flex items-center justify-center'>
                            {muteVideo ? <VideoCameraSlash size={20} /> : <VideoCamera size={20} />}
                        </button>

                    </div>

                </div>
            </div>

        </div>
    )
}
