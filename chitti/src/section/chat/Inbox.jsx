import React, { useState, useEffect, useRef } from 'react';
import { Gif, Microphone, PaperPlaneTilt, Phone, VideoCamera } from '@phosphor-icons/react';
import Dropdown from '../../components/Dropdown';
import EmojiPicker from '../../components/EmojiPicker';
import UserInfo from './UserInfo';
import Giphy from '../../components/Giphy';
import { useDispatch, useSelector } from 'react-redux';
import { ToggleAudioModal } from '../../redux/slices/app';
import Attachment from '../../components/Attachment';
import MsgSeparator from '../../components/MsgSeparator';
import TypinhIndicator from '../../components/TypinhIndicator';
import { TextMessage } from '../../components/Messages';
import VideoRoom from '../../components/VideoRoom';
import AudioRoom from '../../components/AudioRoom';
import { getSocket } from '../../utils/socket';
import { addMessage, setMessages, setTyping } from '../../redux/slices/message';
import { updateConversationLastMessage } from '../../redux/slices/conversation';

export default function Inbox() {
    const dispatch = useDispatch();
    const { activeConversation } = useSelector((state) => state.conversation);
    const { messages, typingUsers } = useSelector((state) => state.message);
    const { user, token } = useSelector((state) => state.auth);

    const [userInfoOpen, setUserInfoOpen] = useState(false);
    const [videoCall, setVideoCall] = useState(false);
    const [audioCall, setAudioCall] = useState(false);
    const [gifOpen, setGifOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);

    const messagesEndRef = useRef(null);

    const otherParticipant = activeConversation?.participants?.find(p => p._id !== user?._id);
    const isTyping = typingUsers[activeConversation?._id];

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Listen to socket events
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        // Receive chat history
        socket.on('chat-history', (data) => {
            if (data.conversationId === activeConversation?._id) {
                dispatch(setMessages(data.history || []));
            }
        });

        // Receive new message
        socket.on('new-direct-message', (data) => {
            if (data.conversationId === activeConversation?._id) {
                dispatch(addMessage(data.message));
            }
            dispatch(updateConversationLastMessage({
                conversationId: data.conversationId,
                message: data.message,
            }));
        });

        // Typing indicators
        socket.on('start-typing', (data) => {
            if (data.conversationId === activeConversation?._id) {
                dispatch(setTyping({ conversationId: data.conversationId, typing: true }));
            }
        });

        socket.on('stop-typing', (data) => {
            if (data.conversationId === activeConversation?._id) {
                dispatch(setTyping({ conversationId: data.conversationId, typing: false }));
            }
        });

        return () => {
            socket.off('chat-history');
            socket.off('new-direct-message');
            socket.off('start-typing');
            socket.off('stop-typing');
        };
    }, [activeConversation?._id]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !activeConversation) return;

        const socket = getSocket();
        if (!socket) return;

        const message = {
            author: user?._id,
            content: inputValue.trim(),
            type: 'Text',
        };

        socket.emit('new-message', {
            conversationId: activeConversation._id,
            message,
        });

        setInputValue('');
        handleStopTyping();
    };

    const handleTyping = (e) => {
        setInputValue(e.target.value);
        const socket = getSocket();
        if (!socket || !activeConversation || !otherParticipant) return;

        socket.emit('start-typing', {
            conversationId: activeConversation._id,
            userId: otherParticipant._id,
        });

        if (typingTimeout) clearTimeout(typingTimeout);
        const timeout = setTimeout(() => handleStopTyping(), 2000);
        setTypingTimeout(timeout);
    };

    const handleStopTyping = () => {
        const socket = getSocket();
        if (!socket || !activeConversation || !otherParticipant) return;
        socket.emit('stop-typing', {
            conversationId: activeConversation._id,
            userId: otherParticipant._id,
        });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!activeConversation) {
        return (
            <div className='flex h-full flex-col items-center justify-center border-l border-stroke dark:border-strokedark xl:w-3/4'>
                <p className='text-gray-400 text-lg'>Select a conversation to start chatting</p>
            </div>
        );
    }

    return (
        <>
            <div className={`flex h-full flex-col border-l border-stroke dark:border-strokedark ${userInfoOpen ? 'xl:w-1/2' : 'xl:w-3/4'}`}>
                {/* Chat header */}
                <div className='sticky flex items-center flex-row justify-between border-b border-stroke dark:border-strokedark px-6 py-4.5'>
                    <div className='flex items-center cursor-pointer' onClick={() => setUserInfoOpen(p => !p)}>
                        <div className='mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full'>
                            <img
                                src={otherParticipant?.avatar || `https://ui-avatars.com/api/?name=${otherParticipant?.name}`}
                                alt='avatar'
                                className='h-full w-full object-cover object-center'
                            />
                        </div>
                        <div>
                            <h5 className='font-medium text-black dark:text-white'>{otherParticipant?.name}</h5>
                            <p className='text-sm'>
                                {otherParticipant?.status === 'Online' ? (
                                    <span className='text-success'>Online</span>
                                ) : 'Offline'}
                            </p>
                        </div>
                    </div>

                    <div className='flex flex-row items-center space-x-8'>
                        <button onClick={() => setVideoCall(p => !p)}>
                            <VideoCamera size={24} />
                        </button>
                        <button onClick={() => setAudioCall(p => !p)}>
                            <Phone size={24} />
                        </button>
                        <Dropdown />
                    </div>
                </div>

                {/* Messages list */}
                <div className='max-h-full space-y-3.5 overflow-auto no-scrollbar px-6 py-7 grow'>
                    {messages.length === 0 ? (
                        <div className='text-center text-gray-400 py-8'>No messages yet. Say hi! 👋</div>
                    ) : (
                        messages.map((msg, index) => {
                            const isOwn = msg.author === user?._id || msg.author?._id === user?._id;
                            return (
                                <TextMessage
                                    key={msg._id || index}
                                    author={isOwn ? user?.name : otherParticipant?.name}
                                    content={msg.content}
                                    incoming={!isOwn}
                                    timestamp={formatTime(msg.createdAt)}
                                    read_receipt='delivered'
                                />
                            );
                        })
                    )}
                    {isTyping && <TypinhIndicator />}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className='sticky bottom-0 border-t border-stroke bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark'>
                    <form className='flex items-center justify-between space-x-4.5' onSubmit={handleSendMessage}>
                        <div className='relative w-full'>
                            <input
                                type='text'
                                placeholder='Type something here'
                                value={inputValue}
                                onChange={handleTyping}
                                className='h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white'
                            />
                            <div className='absolute right-5 top-1/2 -translate-y-1/2 items-center justify-end space-x-4'>
                                <button type='button' onClick={() => dispatch(ToggleAudioModal(true))} className='hover:text-primary'>
                                    <Microphone size={20} weight='bold' />
                                </button>
                                <button type='button' className='hover:text-primary'>
                                    <Attachment />
                                </button>
                                <button type='button' onClick={(e) => { e.preventDefault(); setGifOpen(p => !p); }}>
                                    <Gif size={20} />
                                </button>
                                <button type='button' className='hover:text-primary'>
                                    <EmojiPicker />
                                </button>
                            </div>
                        </div>
                        <button type='submit' className='flex items-center justify-center h-13 max-w-13 w-full rounded-md bg-primary text-white hover:bg-opacity-90'>
                            <PaperPlaneTilt size={20} weight='bold' />
                        </button>
                    </form>
                    {gifOpen && <Giphy />}
                </div>
            </div>

            {videoCall && <VideoRoom open={videoCall} handleClose={() => setVideoCall(false)} />}
            {audioCall && <AudioRoom open={audioCall} handleClose={() => setAudioCall(false)} />}
            {userInfoOpen && (
                <div className='w-1/4'>
                    <UserInfo handleToggleUserInfo={() => setUserInfoOpen(false)} participant={otherParticipant} />
                </div>
            )}
        </>
    );
}
