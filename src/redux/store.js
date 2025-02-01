import { configureStore } from "@reduxjs/toolkit"
import userBetReducer from './reducer'

export default configureStore({
  reducer: {
    userBetList: userBetReducer,
  },
})