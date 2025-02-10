import { useEffect, useState } from "react";
import { Form } from "antd";
import "./BoardPage.scss";
import request from "../../network/request";
import Endpoints from "../../network/endpoints";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../loader/Loader";
import { addTask, fetchBoardsAndListsSuccess, handelBoardsAndListsDnD, updateTask } from "./slice";
import AddNewList from "../../components/AddNewList";
import { notifyError, notifySuccess } from "../../utills/toastService";
import TaskModal from "../modal/TaskModal";
import TaskList from "../task/TaskList";

const BoardPage = () => {
  const [draggedTask, setDraggedTask] = useState(null);
  const { apiStatus, boardsAndListsResponse } = useSelector((store) => store.boardsAndLists);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState({
    show: false,
    listIndex: null,
    listId: null,
    type: null,
    taskIndex: null,
    taskId: null
  });
  const [selectedListId, setSelectedListId] = useState(null)
  const [isTooltipVisible, setIsTooltipVisible] = useState(null); // Track tooltip visibility
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await request({
          url: Endpoints.getBoards,
          method: "GET",
        });
        dispatch(fetchBoardsAndListsSuccess(data));
      } catch (error) {
      }
    };
    fetchData();
  }, [dispatch]);

  const handleDragStart = (task, listIndex) => {
    setDraggedTask({ task, fromList: listIndex });
  };

  const handleDrop = async (toListIndex) => {
    if (!draggedTask) return;

    try {
      const { success, data } = await request({
        url: Endpoints.moveTask,
        method: "POST",
        data: {
          taskId: draggedTask.task._id,
          newListId: boardsAndListsResponse.lists[toListIndex]._id
        }
      })
      if (success) {
        notifySuccess("Status changed")
      } else {
        notifyError("Something went wrong")
      }
    } catch (error) {
      notifyError("Something went wrong")
    }
    const newBoardData = { ...boardsAndListsResponse };
    const fromList = newBoardData.lists[draggedTask.fromList];
    const fromListIndex = draggedTask.fromList
    const filterdFromListTasks = fromList.tasks.filter((t) => t._id !== draggedTask.task._id);

    dispatch(handelBoardsAndListsDnD({
      filterdFromListTasks,
      fromListIndex,
      taskToDrop: draggedTask.task,
      toListIndex
    }))
    setDraggedTask(null);
  };

  if (apiStatus === "init" || apiStatus === "loading") {
    return <Loader />;
  }

  const showModal = (listId, listIndex, type, taskIndex, taskId) => {
    setIsModalVisible({
      ...isModalVisible,
      show: true,
      listIndex: listIndex,
      listId: listId,
      ...(type && {
        type: 'update',
        taskIndex,
        taskId
      })
    });
  };

  const handleCancel = () => {
    setIsModalVisible({
      show: false,
      listIndex: null,
      listId: null,
      type: null,
      taskIndex: null,
      taskId: null
    });
    form.resetFields();
    setSelectedListId(null)
  };

  const handleFormSubmit = async (values) => {
    const payLoad = {
      ...values,
      dueDate: values.dueDate,
      listId: isModalVisible.listId,
    };

    const url = isModalVisible.type === 'update' ? `${Endpoints.createUpdateTask}/${isModalVisible.taskId}` : Endpoints.createUpdateTask
    const method = isModalVisible.type === 'update' ? 'PUT' : 'POST'

    try {
      const { success, data } = await request({
        url: url,
        method: method,
        data: payLoad
      })
      if (success) {
        if (isModalVisible.type === 'update') {
          notifySuccess("Task updated")
          dispatch(updateTask({
            listIndex: isModalVisible.listIndex,
            taskIndex: isModalVisible.taskIndex,
            task: data
          }))
        } else {
          notifySuccess("Task aded")
          dispatch(addTask({ task: data, listIndex: isModalVisible.listIndex }))
        }
      } else {
        notifyError("Something went wrong")
      }
    } catch (error) {
      notifyError("Something went wrong")
    }
    handleCancel();
  };

  return (
    <div className="dev-board-page">
      <div className="dev-board-top">
        <div>
          <h2>{boardsAndListsResponse.title}</h2>
          <p>
            {boardsAndListsResponse.lists?.length} lists •{" "}
            {boardsAndListsResponse.lists?.reduce((acc, list) => acc + list?.tasks?.length, 0)} tasks
          </p>
        </div>
        <AddNewList />
      </div>

      <div className="dev-board-area">
        {
          boardsAndListsResponse?.lists?.length === 0 ?
            <span style={{ fontSize: '25px', color: '#4B7DEB' }}>Sorry no lists found create one to statrt using the app</span> :
            boardsAndListsResponse.lists.map((list, index) => (
              <TaskList
                key={list._id}
                list={list}
                index={index}
                onDragStart={handleDragStart}
                handleDrop={handleDrop}
                isTooltipVisible={isTooltipVisible}
                setIsTooltipVisible={setIsTooltipVisible}
                showModal={showModal}
              />
            ))
        }
      </div>

      <TaskModal
        isVisible={isModalVisible.show}
        onClose={handleCancel}
        onSubmit={handleFormSubmit}
        selectedListId={selectedListId}
      />

    </div>
  );
};

export default BoardPage;