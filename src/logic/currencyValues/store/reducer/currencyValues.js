// @flow
import { Map } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import { SET_CURRENCY_BALANCES } from '../actions/setCurrencyBalances'

import { SET_CURRENT_CURRENCY } from '~/logic/currencyValues/store/actions/setCurrencySelected'
import type { State } from '~/logic/tokens/store/reducer/tokens'

export const CURRENCY_VALUES_KEY = 'currencyValues'

export default handleActions<State, *>(
  {
    [SET_CURRENCY_BALANCES]: (state: State, action: ActionType<Function>): State => {
      const { currencyBalances } = action.payload

      const newState = state.set('currencyBalances', currencyBalances)

      return newState
    },
    [SET_CURRENT_CURRENCY]: (state: State, action: ActionType<Function>): State => {
      const { currencyValueSelected } = action.payload

      const newState = state.set('currencyValueSelected', currencyValueSelected)

      return newState
    },
  },
  Map(),
)
