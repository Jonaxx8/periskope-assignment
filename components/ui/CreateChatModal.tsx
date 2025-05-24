import { FC, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { IoClose } from 'react-icons/io5';
import { searchUsers, createChat } from '@/app/chat/actions';

interface User {
  id: string;
  email: string;
}

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: () => void;
}

const CreateChatModal: FC<CreateChatModalProps> = ({ isOpen, onClose, onChatCreated }) => {
  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetModal = () => {
    setTitle('');
    setSearchQuery('');
    setSelectedUsers([]);
    setSearchResults([]);
    setIsLoading(false);
    setIsSearching(false);
    setError(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setError(null);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const users = await searchUsers(query);
      
      // Filter out already selected users
      const filteredResults = users.filter(
        user => !selectedUsers.some(selected => selected.id === user.id)
      );

      setSearchResults(filteredResults);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to search users');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUsers(prev => [...prev, user]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleCreateChat = async () => {
    if (!title || selectedUsers.length === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      await createChat({ title, participants: selectedUsers });
      onChatCreated();
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create chat');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-white shadow-2xl w-full transform transition-all">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <Dialog.Title className="text-xl font-semibold text-gray-900">Create New Chat</Dialog.Title>
            <button 
              onClick={handleClose} 
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-full transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chat Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-100 focus:border-gray-400 focus:bg-white transition-all"
                placeholder="Enter chat title"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Participants
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-100 focus:border-gray-400 focus:bg-white transition-all"
                placeholder="Search by email"
              />
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
                  {searchResults.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 transition-colors text-sm text-gray-700"
                    >
                      {user.email}
                    </button>
                  ))}
                </div>
              )}

              {isSearching && (
                <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 text-center text-sm text-gray-500">
                  Searching...
                </div>
              )}

              {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 text-center text-sm text-gray-500">
                  No users found
                </div>
              )}
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedUsers.map(user => (
                  <div
                    key={user.id}
                    className="bg-gray-50 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-gray-200"
                  >
                    <span className="text-gray-600">{user.email}</span>
                    <button
                      onClick={() => setSelectedUsers(users => users.filter(u => u.id !== user.id))}
                      className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-0.5 transition-colors"
                    >
                      <IoClose size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateChat}
              disabled={!title || selectedUsers.length === 0 || isLoading}
              className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Chat'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateChatModal;