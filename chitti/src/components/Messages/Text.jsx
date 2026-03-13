import React, { useState } from 'react';
import extractLinks from '../../utils/extractLinks';
import Microlink from '@microlink/react';
import { Checks, Check, ArrowBendUpLeft, ArrowBendUpRight, Trash, PushPin } from '@phosphor-icons/react';

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

function SmileSVG() {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <circle cx='12' cy='12' r='10' />
            <path d='M8 13s1.5 2 4 2 4-2 4-2' />
            <line x1='9' y1='9' x2='9.01' y2='9' />
            <line x1='15' y1='9' x2='15.01' y2='9' />
        </svg>
    );
}

export default function Text({
    incoming,
    author,
    timestamp,
    content,
    seenBy = [],
    reactions = [],
    replyTo = null,
    messageId,
    currentUserId,
    onReact,
    onReply,
    onDelete,
    onForward,
    onPin,
    isDeleted,
}) {
    const [showActions, setShowActions] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const { links, originalString } = extractLinks(content || '');

    const isRead = seenBy.length > 0;
    const readReceiptStatus = isRead ? 'read' : 'delivered';

    const groupedReactions = reactions.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
    }, {});

    const myReaction = reactions.find(r => r.userId === currentUserId)?.emoji;

    if (isDeleted) {
        return (
            <div className={`max-w-125 ${!incoming ? 'ml-auto' : ''}`}>
                <p className='text-xs italic text-gray-400 px-3 py-2 border border-dashed border-gray-300 rounded-xl'>
                    🚫 This message was deleted
                </p>
            </div>
        );
    }

    return (
        <div
            className={`max-w-125 relative ${!incoming ? 'ml-auto' : ''}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => { setShowActions(false); setShowEmojiPicker(false); }}
        >
            {/* Reply preview */}
            {replyTo && (
                <div className={`text-xs px-3 py-1.5 mb-1 rounded-lg border-l-4 border-primary bg-gray-100 dark:bg-boxdark-2 ${!incoming ? 'ml-auto' : ''}`}>
                    <p className='font-medium text-primary truncate'>
                        ↩ {typeof replyTo.author === 'object' ? replyTo.author?.name : 'Message'}
                    </p>
                    <p className='truncate text-gray-500 dark:text-gray-400'>{replyTo.content}</p>
                </div>
            )}

            {/* Bubble row — bubble + smiley attached */}
            <div className={`relative flex items-end gap-1 mb-4 ${!incoming ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Message bubble */}
                <div className='relative'>
                    {incoming && <p className='mb-2.5 text-sm font-medium'>{author}</p>}

                    {incoming ? (
                        <div className='rounded-2xl rounded-tl-none bg-gray px-5 py-3 dark:bg-boxdark-2 space-y-2'>
                            <p dangerouslySetInnerHTML={{ __html: originalString }} />
                            {links.length > 0 && <Microlink style={{ width: '100%' }} url={links[0]} />}
                        </div>
                    ) : (
                        <div className='rounded-2xl rounded-br-none bg-primary px-5 py-3 space-y-2'>
                            <p className='text-white' dangerouslySetInnerHTML={{ __html: originalString }} />
                            {links.length > 0 && <Microlink style={{ width: '100%' }} url={links[0]} />}
                        </div>
                    )}

                    {/* Smiley — attached to bottom corner of bubble */}
                    {showActions && (
                        <div className={`absolute -bottom-3 ${!incoming ? 'left-2' : 'right-2'}`}>
                            <button
                                onClick={() => setShowEmojiPicker(p => !p)}
                                className='w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-boxdark border border-stroke dark:border-strokedark shadow-sm text-gray-400 hover:text-yellow-500 transition-colors'
                                title='React'
                            >
                                <SmileSVG />
                            </button>

                            {/* Emoji picker popup */}
                            {showEmojiPicker && (
                                <div className={`absolute bottom-7 flex gap-1.5 bg-white dark:bg-boxdark shadow-lg border border-stroke dark:border-strokedark rounded-full px-3 py-2 z-30 ${incoming ? 'left-0' : 'right-0'}`}>
                                    {REACTIONS.map(emoji => (
                                        <button
                                            key={emoji}
                                            className={`text-xl hover:scale-125 transition-transform leading-none ${myReaction === emoji ? 'opacity-40' : ''}`}
                                            onClick={() => {
                                                onReact?.(messageId, emoji === myReaction ? '' : emoji);
                                                setShowEmojiPicker(false);
                                            }}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Reactions display — below bubble */}
            {Object.keys(groupedReactions).length > 0 && (
                <div className={`flex flex-wrap gap-1 mt-1 ${!incoming ? 'justify-end' : ''}`}>
                    {Object.entries(groupedReactions).map(([emoji, count]) => (
                        <button
                            key={emoji}
                            onClick={() => onReact?.(messageId, emoji === myReaction ? '' : emoji)}
                            className={`text-xs px-1.5 py-0.5 rounded-full border ${emoji === myReaction ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white dark:bg-boxdark'}`}
                        >
                            {emoji}{count > 1 ? ` ${count}` : ''}
                        </button>
                    ))}
                </div>
            )}

            {/* Timestamp + read receipt */}
            <div className={`flex items-center gap-1 mt-0.5 ${!incoming ? 'justify-end' : ''}`}>
                {!incoming && (
                    <div className={readReceiptStatus === 'read' ? 'text-primary' : 'text-body dark:text-white'}>
                        {readReceiptStatus !== 'sent' ? <Checks weight='bold' size={16} /> : <Check weight='bold' size={16} />}
                    </div>
                )}
                <p className='text-xs'>{timestamp}</p>
            </div>

            {/* Other action icons — below bubble on hover */}
            {showActions && (
                <div className={`flex items-center gap-2 mt-1 ${!incoming ? 'justify-end' : 'justify-start'}`}>
                    <button onClick={() => onReply?.(messageId)} title='Reply' className='text-gray-400 hover:text-primary'>
                        <ArrowBendUpLeft size={14} />
                    </button>
                    <button onClick={() => onForward?.(messageId)} title='Forward' className='text-gray-400 hover:text-primary'>
                        <ArrowBendUpRight size={14} />
                    </button>
                    <button onClick={() => onPin?.(messageId)} title='Pin' className='text-gray-400 hover:text-primary'>
                        <PushPin size={14} />
                    </button>
                    <button onClick={() => onDelete?.(messageId, !incoming)} title='Delete' className='text-gray-400 hover:text-danger'>
                        <Trash size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
