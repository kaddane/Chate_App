
import {create} from 'zustand'
import { createAuthSlice } from './slice/auth-slice'
import { createChatSlice } from './slice/contact-slice'

export const userAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}))












