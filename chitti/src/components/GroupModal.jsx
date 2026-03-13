import React, { useState, useEffect } from 'react';
import { X } from '@phosphor-icons/react';
import { getUsers, createGroup } from '../utils/api';
import { addConversation, setActiveConversation } from '../redux/slices/conversation';
import { clearMessages } from '../redux/slices/message';
import { useDispatch } from 'react-redux';
import { getSocket } from '../utils/socket';

export default function GroupModal({ onClose }) {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        getUsers().then(r => setUsers(r.data.users || [])).catch(console.error);
    }, []);

    const toggle = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

    const handleCreate = async () => {
        if (!groupName.trim() || selected.length < 2) return;
        try {
            const res = await createGroup(groupName.trim(), selected);
            const conv = res.data.conversation;
            dispatch(addConversation(conv));
            dispatch(setActiveConversation(conv));
            dispatch(clearMessages());
            const socket = getSocket();
            if (socket) socket.emit('direct-chat-history', { conversationId: conv._id });
            onClose();
        } catch (err) {
            console.error('Error creating group:', err);
        }
    };

    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
            <div className='bg-white dark:bg-boxdark rounded-xl shadow-xl w-96 max-h-[75vh] flex flex-col'>
                <div className='flex items-center justify-between px-5 py-4 border-b border-stroke dark:border-strokedark'>
                    <h4 className='font-semibold text-black dark:text-white'>New Group</h4>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <div className='px-5 py-3 space-y-2'>
                    <input
                        type='text'
                        placeholder='Group name...'
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                        className='w-full rounded border border-stroke bg-gray-2 py-2 px-4 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white'
                    />
                    <input
                        type='text'
                        placeholder='Search members...'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className='w-full rounded border border-stroke bg-gray-2 py-2 px-4 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white'
                    />
                </div>

                {selected.length > 0 && (
                    <div className='px-5 flex flex-wrap gap-1'>
                        {selected.map(id => {
                            const u = users.find(x => x._id === id);
                            return (
                                <span key={id} className='flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full'>
                                    {u?.name}
                                    <button onClick={() => toggle(id)}>×</button>
                                </span>
                            );
                        })}
                    </div>
                )}

                <div className='overflow-auto px-5 pb-3 space-y-1 flex-1'>
                    {filtered.map(u => (
                        <div
                            key={u._id}
                            onClick={() => toggle(u._id)}
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer ${selected.includes(u._id) ? 'bg-primary/10' : 'hover:bg-gray-2 dark:hover:bg-boxdark-2'}`}
                        >
                            <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} className='h-9 w-9 rounded-full object-cover' alt={u.name} />
                            <p className='text-sm font-medium text-black dark:text-white'>{u.name}</p>
                            {selected.includes(u._id) && <span className='ml-auto text-primary text-lg'>✓</span>}
                        </div>
                    ))}
                </div>

                <div className='px-5 py-3 border-t border-stroke dark:border-strokedark'>
                    <button
                        onClick={handleCreate}
                        disabled={!groupName.trim() || selected.length < 2}
                        className='w-full py-2 rounded bg-primary text-white text-sm font-medium disabled:opacity-50'
                    >
                        Create Group ({selected.length} members)
                    </button>
                </div>
            </div>
        </div>
    );
}
