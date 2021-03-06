// @flow
import type { AnyAction, Store } from 'redux'

import type { AddressBookProps } from '~/logic/addressBook/model/addressBook'
import { ADD_ENTRY } from '~/logic/addressBook/store/actions/addAddressBookEntry'
import { REMOVE_ENTRY } from '~/logic/addressBook/store/actions/removeAddressBookEntry'
import { UPDATE_ENTRY } from '~/logic/addressBook/store/actions/updateAddressBookEntry'
import { addressBookMapSelector } from '~/logic/addressBook/store/selectors'
import { saveAddressBook } from '~/logic/addressBook/utils'
import { enhanceSnackbarForAction, getNotificationsFromTxType } from '~/logic/notifications'
import enqueueSnackbar from '~/logic/notifications/store/actions/enqueueSnackbar'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { type GlobalState } from '~/store/'

const watchedActions = [ADD_ENTRY, REMOVE_ENTRY, UPDATE_ENTRY]

const addressBookMiddleware = (store: Store<GlobalState>) => (next: Function) => async (action: AnyAction) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    const state: GlobalState = store.getState()
    const { dispatch } = store
    const addressBook: AddressBookProps = addressBookMapSelector(state)
    if (addressBook) {
      await saveAddressBook(addressBook)
    }

    switch (action.type) {
      case ADD_ENTRY: {
        const { isOwner } = action.payload.entry
        if (!isOwner) {
          const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESSBOOK_NEW_ENTRY)
          dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
        }
        break
      }
      case REMOVE_ENTRY: {
        const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESSBOOK_DELETE_ENTRY)
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
        break
      }
      case UPDATE_ENTRY: {
        const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESSBOOK_EDIT_ENTRY)
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
        break
      }
      default:
        break
    }
  }

  return handledAction
}

export default addressBookMiddleware
