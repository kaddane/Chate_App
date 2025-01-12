


export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedCateMessage: [],
    ditectMessagesContacts: [],
    setSelectedChatType: (selectedChatType) => set({selectedChatType}),
    setSelectedChatData: (selectedChatData) => set({selectedChatData}),
    setSelectedCateMessage: (selectedCateMessage) => set({selectedCateMessage}),
    setDitectMessagesContacts: (ditectMessagesContacts) => set({ditectMessagesContacts}),
    closeCat: () => set({
        selectedChatData: undefined,
        selectedChatType: undefined,
        selectedCateMessage: []
    }),
    addMessage: (message) => {
        const selectedCateMessage = get().selectedCateMessage
        const selectedChatType = get().selectedChatType

        set({
            selectedCateMessage: [
                ...selectedCateMessage, {
                    ...message,
                    recipinent: selectedChatType === "channel" 
                    ? message.recipinent 
                    : message.recipinent._id,

                    sender: selectedChatType === "channel" 
                    ? message.sender 
                    : message.sender._id,
                }
            ]
        })
    }
})














