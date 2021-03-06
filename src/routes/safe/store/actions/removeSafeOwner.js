// @flow
import { createAction } from 'redux-actions'

export const REMOVE_SAFE_OWNER = 'REMOVE_SAFE_OWNER'

const removeSafeOwner = createAction<string, *>(REMOVE_SAFE_OWNER)

export default removeSafeOwner
