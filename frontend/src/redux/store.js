// src/store.js

import { configureStore } from "@reduxjs/toolkit";
import boardsAndListsReducer from "../feature/board/slice";

const store = configureStore({
    reducer: {
        boardsAndLists: boardsAndListsReducer
    }
});

export default store;