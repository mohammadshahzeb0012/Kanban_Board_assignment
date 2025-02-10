import { createSlice } from "@reduxjs/toolkit";

const initialState =  {
    boardsAndListsResponse: null,
    apiStatus: "init",
    error: null
}

const boardsAndListsSlice = createSlice({
    name: "boardsAndLists",
    initialState,
    reducers: {
        fetchBoardsAndListsStart: (state) => {
            state.apiStatus = "loading";
            state.error = null;
        },
        fetchBoardsAndListsSuccess: (state, action) => {
            state.apiStatus = "success";
            state.boardsAndListsResponse = action.payload;
        },
        fetchBoardsAndListsFailure: (state, action) => {
            state.apiStatus = "failure";
            state.error = action.payload;
        },
        handelBoardsAndListsDnD: (state, action) => {
            const { filterdFromListTasks,
                fromListIndex, taskToDrop,
                toListIndex } = action.payload
            state.boardsAndListsResponse.lists[fromListIndex].tasks = filterdFromListTasks
            state.boardsAndListsResponse.lists[toListIndex].tasks.push(taskToDrop)
        },
        handelDeleteTask: (state, action) => {
            const { taskId, ListIndex } = action.payload
            state.boardsAndListsResponse.lists[ListIndex].tasks = state.boardsAndListsResponse.lists[ListIndex].tasks
                .filter((task) => task._id !== taskId)
        },
        addList: (state, action) => {
            state.boardsAndListsResponse.lists.push(action.payload)
        },
        deleteList: (state, action) => {
            state.boardsAndListsResponse.lists.splice(action.payload, 1)
        },
        updateList: (state, action) => {
            const { listIndex, title } = action.payload
            state.boardsAndListsResponse.lists[listIndex].title = title
        },
        addTask:(state, action) =>{
            const { listIndex, task } = action.payload
            state.boardsAndListsResponse.lists[listIndex].tasks.push(task)
        },
        updateTask: (state,action)=>{
        const {listIndex,taskIndex,task} = action.payload
           state.boardsAndListsResponse.lists[listIndex].tasks[taskIndex] = task
        },
        resetState: () => initialState
    }
});

export const {
    fetchBoardsAndListsStart,
    fetchBoardsAndListsSuccess,
    fetchBoardsAndListsFailure,
    handelBoardsAndListsDnD,
    handelDeleteTask,
    addList,
    deleteList,
    updateList,
    addTask,
    updateTask,
    resetState
} = boardsAndListsSlice.actions;

export default boardsAndListsSlice.reducer;