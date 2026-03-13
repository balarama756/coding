import { MagnifyingGlass, PencilSimple, X, UsersThree } from '@phosphor-icons/react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getConversations, getUsers, startConversation, getUnreadCount } from '../../utils/api'
import { setConversations, setActiveConversation, addConversation, updateParticipantStatus, setUnreadCounts } from '../../redux/slices/conversation'
import { clearMessages } from '../../redux/slices/message'
import { getSocket } from '../../utils/socket'
import GroupModal from '../../components/GroupModal'

export default function ChatList() {
  const dispatch = useDispatch();
  const { conversations, activeConversation, unreadCounts = {} } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    fetchConversations();
    fetchUnreadCounts();

    const socket = getSocket();
    if (socket) {
      socket.on('user-connected', (data) => {
        dispatch(updateParticipantStatus({ userId: data.userId, status: 'Online' }));
      });
      socket.on('user-disconnected', (data) => {
        dispatch(updateParticipantStatus({ userId: data.userId, status: 'Offline', lastSeen: new Date().toISOString() }));
      });
    }

    return () => {
      if (socket) {
        socket.off('user-connected');
        socket.off('user-disconnected');
      }
    };
  }, []);

  const fetchUnreadCounts = async () => {
    try {
      const res = await getUnreadCount();
      dispatch(setUnreadCounts(res.data.unreadCounts || {}));
    } catch (err) {
      console.error('Error fetching unread counts:', err);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await getConversations();
      dispatch(setConversations(response.data.conversation || []));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpenUserList = () => {
    setShowUserList(true);
    fetchUsers();
  };

  const handleStartConversation = async (userId) => {
    try {
      const response = await startConversation(userId);
      const conversation = response.data.conversation;
      dispatch(addConversation(conversation));
      dispatch(setActiveConversation(conversation));
      dispatch(clearMessages());
      setShowUserList(false);

      const socket = getSocket();
      if (socket) {
        socket.emit('direct-chat-history', { conversationId: conversation._id });
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    dispatch(setActiveConversation(conversation));
    dispatch(clearMessages());
    const socket = getSocket();
    if (socket) {
      socket.emit('direct-chat-history', { conversationId: conversation._id });
    }
  };

  const getOtherParticipant = (conversation) => {
    if (conversation.isGroup) return null;
    return conversation.participants.find(p => p._id !== user?._id);
  };

  const getConvName = (conversation) => {
    if (conversation.isGroup) return conversation.groupName;
    return getOtherParticipant(conversation)?.name || 'Unknown';
  };

  const getConvAvatar = (conversation) => {
    if (conversation.isGroup)
      return conversation.groupAvatar || `https://ui-avatars.com/api/?name=${conversation.groupName}&background=6366f1&color=fff`;
    const other = getOtherParticipant(conversation);
    return other?.avatar || `https://ui-avatars.com/api/?name=${other?.name}`;
  };

  const getLastMessage = (conversation) => {
    if (conversation.messages && conversation.messages.length > 0) {
      const lastMsg = conversation.messages[conversation.messages.length - 1];
      if (lastMsg.type === 'Text') return lastMsg.content || 'Message';
      if (lastMsg.type === 'Media') return '📷 Photo';
      if (lastMsg.type === 'Audio') return '🎤 Voice message';
      if (lastMsg.type === 'Document') return '📄 Document';
      if (lastMsg.type === 'Giphy') return '🎬 GIF';
    }
    return 'Start a conversation';
  };

  const filteredConversations = conversations.filter(conv => {
    const name = conv.isGroup ? conv.groupName : getOtherParticipant(conv)?.name;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className='hidden h-full flex-col xl:flex xl:w-1/4'>
      {/* Header */}
      <div className='sticky border-b border-stroke dark:border-strokedark px-6 py-7.5 flex flex-row items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h3 className='text-lg font-medium text-black dark:text-white 2xl:text-xl'>
            Chats
          </h3>
          <span className='rounded-md border-[.5px] border-stroke dark:border-strokedark bg-gray px-2 py-0.5 text-base font-medium text-black dark:bg-boxdark-2 dark:text-white'>
            {conversations.length}
          </span>
        </div>
        <button
          onClick={handleOpenUserList}
          className='hover:text-primary'
          title='New Conversation'
        >
          <PencilSimple size={22} />
        </button>
        <button
          onClick={() => setShowGroupModal(true)}
          className='hover:text-primary'
          title='New Group'
        >
          <UsersThree size={22} />
        </button>
      </div>

      {/* Search */}
      <div className='flex max-h-full flex-col overflow-auto p-5'>
        <form className='sticky mb-7 relative' onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder='Search conversations...'
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full rounded border border-stroke bg-gray-2 py-2.5 pl-5 pr-10 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2'
          />
          <span className='absolute right-4 top-1/2 -translate-y-1/2'>
            <MagnifyingGlass size={20} />
          </span>
        </form>

        {/* Conversation list */}
        <div className='no-scrollbar overflow-auto max-h-full space-y-2.5'>
          {filteredConversations.length === 0 ? (
            <div className='text-center py-8 text-gray-500 text-sm'>
              No conversations yet.<br />
              <button onClick={handleOpenUserList} className='text-primary mt-1 underline'>
                Start one!
              </button>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherUser = getOtherParticipant(conversation);
              const isActive = activeConversation?._id === conversation._id;
              const unread = unreadCounts[conversation._id];

              return (
                <div
                  className={`flex cursor-pointer items-center rounded px-4 py-2 ${isActive ? 'bg-gray dark:bg-boxdark-2' : 'hover:bg-gray-2 dark:hover:bg-boxdark-2/90'}`}
                  key={conversation._id}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className='relative mr-3.5 h-11 w-full max-w-11 rounded-full'>
                    <img
                      src={getConvAvatar(conversation)}
                      alt='profile'
                      className='h-full w-full rounded-full object-cover object-center'
                    />
                    {!conversation.isGroup && otherUser?.status === 'Online' && (
                      <span className='absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-gray-2 bg-success'></span>
                    )}
                  </div>
                  <div className='w-full overflow-hidden'>
                    <div className='flex items-center justify-between'>
                      <h5 className='text-sm font-medium text-black dark:text-white'>
                        {getConvName(conversation)}
                      </h5>
                      {unread > 0 && (
                        <span className='ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white font-bold'>
                          {unread > 9 ? '9+' : unread}
                        </span>
                      )}
                    </div>
                    <p className='text-sm truncate'>{getLastMessage(conversation)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      {showUserList && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
          <div className='bg-white dark:bg-boxdark rounded-xl shadow-xl w-96 max-h-[70vh] flex flex-col'>
            <div className='flex items-center justify-between px-5 py-4 border-b border-stroke dark:border-strokedark'>
              <h4 className='font-semibold text-black dark:text-white'>New Conversation</h4>
              <button onClick={() => setShowUserList(false)}>
                <X size={20} />
              </button>
            </div>
            <div className='px-5 py-3'>
              <input
                type='text'
                placeholder='Search users...'
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className='w-full rounded border border-stroke bg-gray-2 py-2 px-4 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white'
              />
            </div>
            <div className='overflow-auto px-5 pb-4 space-y-2'>
              {filteredUsers.length === 0 ? (
                <p className='text-center text-sm text-gray-400 py-4'>No users found</p>
              ) : (
                filteredUsers.map((u) => (
                  <div
                    key={u._id}
                    className='flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-2 dark:hover:bg-boxdark-2'
                    onClick={() => handleStartConversation(u._id)}
                  >
                    <img
                      src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`}
                      className='h-10 w-10 rounded-full object-cover'
                      alt={u.name}
                    />
                    <div>
                      <p className='text-sm font-medium text-black dark:text-white'>{u.name}</p>
                      <p className='text-xs text-gray-400'>{u.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showGroupModal && <GroupModal onClose={() => setShowGroupModal(false)} />}
    </div>
  );
}
