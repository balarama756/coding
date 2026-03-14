import React from 'react'
import { ChatList, MessageInbox } from '../section/chat'
import GifModal from '../components/GifModal'
import VoiceRecorder from '../components/VoiceRecorder'
import MediaPicker from '../components/MediaPicker'
import DocumentPicker from '../components/DocumentPicker'
import { useSelector } from 'react-redux'

export default function Messages() {
  const { activeConversation } = useSelector((state) => state.conversation);

  return (
    <>
      <div className='flex w-full h-full overflow-hidden'>
        {/* On mobile: show ChatList only when no active conversation, Inbox only when active */}
        <div className={`${activeConversation ? 'hidden sm:flex' : 'flex'} w-full sm:w-80 xl:w-96 flex-shrink-0 h-full`}>
          <ChatList />
        </div>

        <div className={`${activeConversation ? 'flex' : 'hidden sm:flex'} flex-1 min-w-0 h-full bg-white dark:bg-boxdark relative`}>
          <MessageInbox />
        </div>
      </div>

      <GifModal />
      <VoiceRecorder />
      <MediaPicker />
      <DocumentPicker />
    </>
  )
}
