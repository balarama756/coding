import React, { useState, useEffect, useRef } from 'react';
import { Gif, Microphone, PaperPlaneTilt, Phone, VideoCamera, MagnifyingGlass, PushPin, X } from '@phosphor-icons/react';
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
import { addMessage, setMessages, setTyping, updateMessageSeen, updateMessageReaction, deleteMessage, setPinnedMessages } from '../../redux/slices/message';
import { updateConversationLastMessage, incrementUnread } from '../../redux/slices/conversation';
import { searchMessages } from '../../utils/api';

export default function Inbox() {
    const dispatch = useDispatch();
    const { activeConversation } = useSelector((state) => state.conversation);
    const { messages, typingUsers, pinnedMessages } = useSelector((state) => state.message);
    const { user } = useSelector((state) => state.auth);

    const [userInfoOpen, setUserInfoOpen] = useState(false);
    const [videoCall, setVideoCall] = useState(false);
    const [audioCall, setAudioCall] = useState(false);
    const [gifOpen, setGifOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [replyTo, setReplyTo] = useState(null); // { _id, content, author }
    const [forwardModal, setForwardModal] = useState(null); // messageId
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showPinned, setShowPinned] = useState(false);

    const messagesEndRef = useRef(null);

    const isGroup = activeConversation?.isGroup;
    const otherParticipant = !isGroup
        ? activeConversation?.participants?.find(p => p._id !== user?._id)
        : null;
    const isTyping = typingUsers[activeConversation?._id];

    const formatLastSeen = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - d) / 60000);
        if (diff < 1) return 'just now';
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return d.toLocaleDateString();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Mark messages as seen when conversation opens
    useEffect(() => {
        if (!activeConversation || !user) return;
        const socket = getSocket();
        if (socket) {
            socket.emit('mark-seen', { conversationId: activeConversation._id, userId: user._id });
        }
    }, [activeConversation?._id, messages.length]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        socket.on('chat-history', (data) => {
            if (data.conversationId === activeConversation?._id) {
                dispatch(setMessages(data.history || []));
                // Set pinned messages from conversation
                if (activeConversation?.pinnedMessages) {
                    dispatch(setPinnedMessages(activeConversation.pinnedMessages));
                }
            }
        });

        socket.on('new-direct-message', (data) => {
            if (data.conversationId === activeConversation?._id) {
                dispatch(addMessage(data.message));
            } else {
                dispatch(incrementUnread({ conversationId: data.conversationId }));
            }
            dispatch(updateConversationLastMessage({ conversationId: data.conversationId, message: data.message }));
        });

        socket.on('start-typing', (data) => {
            if (data.conversationId === activeConversation?._id)
                dispatch(setTyping({ conversationId: data.conversationId, typing: true }));
        });

        socket.on('stop-typing', (data) => {
            if (data.conversationId === activeConversation?._id)
                dispatch(setTyping({ conversationId: data.conversationId, typing: false }));
        });

        socket.on('messages-seen', (data) => {
            if (data.conversationId === activeConversation?._id)
                dispatch(updateMessageSeen({ seenBy: data.seenBy }));
        });

        socket.on('message-reaction', (data) => {
            if (data.conversationId === activeConversation?._id)
                dispatch(updateMessageReaction({ messageId: data.messageId, reactions: data.reactions }));
        });

        socket.on('message-deleted', (data) => {
            if (data.conversationId === activeConversation?._id)
                dispatch(deleteMessage({ messageId: data.messageId, deleteForEveryone: data.deleteForEveryone, deletedFor: data.deletedFor }));
        });

        socket.on('pin-updated', (data) => {
            if (data.conversationId === activeConversation?._id)
                dispatch(setPinnedMessages(data.pinnedMessages));
        });

        return () => {
            socket.off('chat-history');
            socket.off('new-direct-message');
            socket.off('start-typing');
            socket.off('stop-typing');
            socket.off('messages-seen');
            socket.off('message-reaction');
            socket.off('message-deleted');
            socket.off('pin-updated');
        };
    }, [activeConversation?._id]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !activeConversation) return;
        const socket = getSocket();
        if (!socket) return;

        socket.emit('new-message', {
            conversationId: activeConversation._id,
            message: {
                author: user?._id,
                content: inputValue.trim(),
                type: 'Text',
                replyTo: replyTo?._id || null,
            },
        });

        setInputValue('');
        setReplyTo(null);
        handleStopTyping();
    };

    const handleTyping = (e) => {
        setInputValue(e.target.value);
        const socket = getSocket();
        if (!socket || !activeConversation) return;
        const targets = isGroup
            ? activeConversation.participants.filter(p => p._id !== user?._id)
            : [otherParticipant];

        targets.forEach(p => {
            if (p) socket.emit('start-typing', { conversationId: activeConversation._id, userId: p._id });
        });

        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => handleStopTyping(), 2000));
    };

    const handleStopTyping = () => {
        const socket = getSocket();
        if (!socket || !activeConversation) return;
        const targets = isGroup
            ? activeConversation.participants.filter(p => p._id !== user?._id)
            : [otherParticipant];
        targets.forEach(p => {
            if (p) socket.emit('stop-typing', { conversationId: activeConversation._id, userId: p._id });
        });
    };

    const handleReact = (messageId, emoji) => {
        const socket = getSocket();
        if (!socket) return;
        socket.emit('react-message', { messageId, conversationId: activeConversation._id, userId: user._id, emoji });
    };

    const handleDelete = (messageId, isOwn) => {
        const socket = getSocket();
        if (!socket) return;
        const deleteForEveryone = isOwn;
        socket.emit('delete-message', { messageId, conversationId: activeConversation._id, userId: user._id, deleteForEveryone });
    };

    const handleForward = (messageId) => setForwardModal(messageId);

    const handlePin = (messageId) => {
        const socket = getSocket();
        if (!socket) return;
        const isPinned = pinnedMessages.includes(messageId);
        socket.emit('pin-message', { messageId, conversationId: activeConversation._id, pin: !isPinned });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        try {
            const res = await searchMessages(activeConversation._id, searchQuery);
            setSearchResults(res.data.messages || []);
        } catch (err) {
            console.error(err);
        }
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getDisplayName = () => {
        if (isGroup) return activeConversation.groupName;
        return otherParticipant?.name;
    };

    const getDisplayAvatar = () => {
        if (isGroup) return activeConversation.groupAvatar || `https://ui-avatars.com/api/?name=${activeConversation.groupName}&background=6366f1&color=fff`;
        return otherParticipant?.avatar || `https://ui-avatars.com/api/?name=${otherParticipant?.name}`;
    };

    const getStatusLine = () => {
        if (isGroup) return `${activeConversation.participants.length} members`;
        if (otherParticipant?.status === 'Online') return <span className='text-success'>Online</span>;
        if (otherParticipant?.lastSeen) return `Last seen ${formatLastSeen(otherParticipant.lastSeen)}`;
        return 'Offline';
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
                {/* Header */}
                <div className='sticky flex items-center flex-row justify-between border-b border-stroke dark:border-strokedark px-6 py-4.5'>
                    <div className='flex items-center cursor-pointer' onClick={() => setUserInfoOpen(p => !p)}>
                        <div className='mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full'>
                            <img src={getDisplayAvatar()} alt='avatar' className='h-full w-full object-cover object-center' />
                        </div>
                        <div>
                            <h5 className='font-medium text-black dark:text-white'>{getDisplayName()}</h5>
                            <p className='text-sm'>{getStatusLine()}</p>
                        </div>
                    </div>

                    <div className='flex flex-row items-center space-x-4'>
                        <button onClick={() => setShowPinned(p => !p)} title='Pinned messages' className={showPinned ? 'text-primary' : ''}>
                            <PushPin size={20} />
                        </button>
                        <button onClick={() => setSearchOpen(p => !p)} title='Search messages' className={searchOpen ? 'text-primary' : ''}>
                            <MagnifyingGlass size={20} />
                        </button>
                        <button onClick={() => setVideoCall(p => !p)}><VideoCamera size={24} /></button>
                        <button onClick={() => setAudioCall(p => !p)}><Phone size={24} /></button>
                        <Dropdown />
                    </div>
                </div>

                {/* Search bar */}
                {searchOpen && (
                    <form onSubmit={handleSearch} className='flex items-center gap-2 px-6 py-2 border-b border-stroke dark:border-strokedark bg-gray dark:bg-boxdark-2'>
                        <input
                            type='text'
                            placeholder='Search messages...'
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); if (!e.target.value) setSearchResults([]); }}
                            className='flex-1 rounded border border-stroke bg-white dark:bg-boxdark py-1.5 px-3 text-sm outline-none focus:border-primary dark:border-strokedark dark:text-white'
                        />
                        <button type='submit' className='text-primary text-sm font-medium'>Search</button>
                        <button type='button' onClick={() => { setSearchOpen(false); setSearchResults([]); setSearchQuery(''); }}><X size={16} /></button>
                    </form>
                )}

                {/* Search results */}
                {searchResults.length > 0 && (
                    <div className='px-6 py-2 border-b border-stroke dark:border-strokedark bg-gray dark:bg-boxdark-2 max-h-40 overflow-auto space-y-1'>
                        <p className='text-xs text-gray-400 mb-1'>{searchResults.length} result(s)</p>
                        {searchResults.map(m => (
                            <div key={m._id} className='text-sm px-3 py-1.5 rounded bg-white dark:bg-boxdark border border-stroke dark:border-strokedark'>
                                <span className='text-xs text-gray-400 mr-2'>{formatTime(m.createdAt)}</span>
                                {m.content}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pinned messages */}
                {showPinned && pinnedMessages.length > 0 && (
                    <div className='px-6 py-2 border-b border-stroke dark:border-strokedark bg-yellow-50 dark:bg-boxdark-2'>
                        <p className='text-xs font-medium text-yellow-600 mb-1'>📌 Pinned Messages</p>
                        {pinnedMessages.map(id => {
                            const msg = messages.find(m => m._id === id);
                            return msg ? (
                                <div key={id} className='text-sm truncate text-gray-700 dark:text-gray-300'>{msg.content}</div>
                            ) : null;
                        })}
                    </div>
                )}

                {/* Messages */}
                <div className='max-h-full space-y-3.5 overflow-auto no-scrollbar px-6 py-7 grow'>
                    {messages.length === 0 ? (
                        <div className='text-center text-gray-400 py-8'>No messages yet. Say hi! 👋</div>
                    ) : (
                        messages.map((msg, index) => {
                            const isOwn = msg.author === user?._id || msg.author?._id === user?._id;
                            const authorName = isOwn ? user?.name : (isGroup
                                ? activeConversation.participants.find(p => p._id === (msg.author?._id || msg.author))?.name
                                : otherParticipant?.name);
                            const isDeleted = msg._deleted || (msg.deletedFor?.includes(user?._id) && !msg._deleted && msg.deletedFor?.length === (activeConversation?.participants?.length));
                            const deletedForMe = msg.deletedFor?.includes(user?._id);

                            if (deletedForMe && !msg._deleted) return null;

                            return (
                                <TextMessage
                                    key={msg._id || index}
                                    messageId={msg._id}
                                    author={authorName}
                                    content={msg.content}
                                    incoming={!isOwn}
                                    timestamp={formatTime(msg.createdAt)}
                                    seenBy={msg.seenBy || []}
                                    reactions={msg.reactions || []}
                                    replyTo={msg.replyTo}
                                    currentUserId={user?._id}
                                    isDeleted={isDeleted}
                                    onReact={handleReact}
                                    onReply={() => setReplyTo(msg)}
                                    onDelete={handleDelete}
                                    onForward={handleForward}
                                    onPin={handlePin}
                                />
                            );
                        })
                    )}
                    {isTyping && <TypinhIndicator />}
                    <div ref={messagesEndRef} />
                </div>

                {/* Reply preview bar */}
                {replyTo && (
                    <div className='flex items-center justify-between px-6 py-2 bg-gray dark:bg-boxdark-2 border-t border-stroke dark:border-strokedark'>
                        <div className='text-sm overflow-hidden'>
                            <p className='text-primary font-medium text-xs'>
                                ↩ {typeof replyTo.author === 'object' ? replyTo.author?.name : (replyTo.authorName || 'Reply')}
                            </p>
                            <p className='text-gray-600 dark:text-gray-300 truncate text-xs'>{replyTo.content}</p>
                        </div>
                        <button onClick={() => setReplyTo(null)} className='ml-2 flex-shrink-0'><X size={16} /></button>
                    </div>
                )}

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
                                <button type='button' className='hover:text-primary'><Attachment /></button>
                                <button type='button' onClick={(e) => { e.preventDefault(); setGifOpen(p => !p); }}>
                                    <Gif size={20} />
                                </button>
                                <button type='button' className='hover:text-primary'><EmojiPicker /></button>
                            </div>
                        </div>
                        <button type='submit' className='flex items-center justify-center h-13 max-w-13 w-full rounded-md bg-primary text-white hover:bg-opacity-90'>
                            <PaperPlaneTilt size={20} weight='bold' />
                        </button>
                    </form>
                    {gifOpen && <Giphy />}
                </div>
            </div>

            {/* Forward modal */}
            {forwardModal && (
                <ForwardModal
                    messageId={forwardModal}
                    onClose={() => setForwardModal(null)}
                    currentUserId={user?._id}
                />
            )}

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

// Inline forward modal
function ForwardModal({ messageId, onClose, currentUserId }) {
    const { conversations } = useSelector(s => s.conversation);
    const { user } = useSelector(s => s.auth);

    const handleForward = (toConversationId) => {
        const socket = getSocket();
        if (!socket) return;
        socket.emit('forward-message', { messageId, toConversationId, authorId: currentUserId });
        onClose();
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
            <div className='bg-white dark:bg-boxdark rounded-xl shadow-xl w-80 max-h-[60vh] flex flex-col'>
                <div className='flex items-center justify-between px-5 py-4 border-b border-stroke dark:border-strokedark'>
                    <h4 className='font-semibold text-black dark:text-white'>Forward to...</h4>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <div className='overflow-auto px-5 py-3 space-y-2'>
                    {conversations.map(conv => {
                        const other = conv.isGroup ? null : conv.participants.find(p => p._id !== user?._id);
                        const name = conv.isGroup ? conv.groupName : other?.name;
                        return (
                            <div
                                key={conv._id}
                                onClick={() => handleForward(conv._id)}
                                className='flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-2 dark:hover:bg-boxdark-2'
                            >
                                <img
                                    src={conv.isGroup
                                        ? `https://ui-avatars.com/api/?name=${conv.groupName}&background=6366f1&color=fff`
                                        : (other?.avatar || `https://ui-avatars.com/api/?name=${other?.name}`)}
                                    className='h-9 w-9 rounded-full object-cover'
                                    alt={name}
                                />
                                <p className='text-sm font-medium text-black dark:text-white'>{name}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
