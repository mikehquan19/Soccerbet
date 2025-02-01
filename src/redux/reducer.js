import { createSlice } from "@reduxjs/toolkit"

// the reducer 
export const userBetSlice = createSlice({
  name: "userBetList",
  initialState: [],
  reducers: {
    // add the bet to the cart, used for bet components 
    addBet: (state, action) => {
      const betInfo = action.payload;
      if (betInfo !== null && betInfo !== undefined) {
        for (var i = 0; i < state.length; i++) {
          // if the bet is already in the list, remove it
          if (betInfo.id === state[i].bet_info.id) {
            return state.filter(userBet => userBet.bet_info.id !== betInfo.id);
          }
        }
        // append the bet which is not already in the list 
        return [...state, {bet_info: betInfo, bet_amount: "0" }]
      }
    },

    // delete the item with given bet info id from the cart 
    // used for the bet cart components
    deleteBet: (state, action) => {
      const betInfoId  = action.payload;
      return state.filter(userBet => userBet.bet_info.id !== betInfoId)
    },

    // enter the bet amount to item with given bet info id in the cart 
    // used for bet cart 
    setBetAmount: (state, action) => {
      const argMap = action.payload;
      return state.map(userBet => {
        if (userBet.bet_info.id === argMap.betInfoId) {
          return { ...userBet, bet_amount: argMap.betAmount };
        }
        return userBet;
      });
    },

    // clear the array 
    clear: (state) => {
      return [];
    }
  }
})

// Action creators are generated for each case reducer function
export const { addBet, deleteBet, setBetAmount, clear } = userBetSlice.actions
export default userBetSlice.reducer

