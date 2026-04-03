import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PROFILE_ACTIVITY } from '@/lib/data/catalog'
import type { ProfileActivity } from '@/lib/types/models'

interface ProfileState {
  activity: ProfileActivity[]
}

const initialState: ProfileState = {
  activity: PROFILE_ACTIVITY,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    hydrateProfileActivity: (state, action: PayloadAction<ProfileActivity[]>) => {
      state.activity = action.payload
    },
  },
})

export const { hydrateProfileActivity } = profileSlice.actions
export default profileSlice.reducer
