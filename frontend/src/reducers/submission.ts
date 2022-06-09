import {
    RESET_DATA,
    SUBMISSION_ERROR,
    SUBMISSION_INPROGRESS,
    SUBMISSION_SUCCESS
} from "../types/reduxTypes";

export type SubmissionState = {
    inProgress: boolean
    successful: boolean | null
}

const initialState: SubmissionState = {
    inProgress: false,
    successful: null
}

export default function (state: SubmissionState = initialState, action: any): SubmissionState {
    // This reducer is a noop
    switch (action.type) {
        case SUBMISSION_INPROGRESS:
            return {
                ...state,
                inProgress: true,
                successful: null
            }
        case SUBMISSION_SUCCESS:
            return {
                ...state,
                inProgress: false,
                successful: true
            }
        case SUBMISSION_ERROR:
            return {
                ...state,
                inProgress: false,
                successful: false
            }
        case RESET_DATA:
            return initialState
        default:
            return state;
    }
}