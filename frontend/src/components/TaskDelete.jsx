import { Trash } from "lucide-react"
import request from "../network/request"
import Endpoints from "../network/endpoints"
import { notifyError, notifySuccess } from "../utills/toastService"
import { useDispatch } from "react-redux"
import { handelDeleteTask } from "../feature/board/slice"

const TaskDelete = ({ taskId, ListIndex }) => {
    const dispatch = useDispatch()
    const handelDelete = async (taskId) => {
        try {
            const { success } = await request({
                url: `${Endpoints.deleteTask}/${taskId}`,
                method: "DELETE",
            })
            if (success) {
                dispatch(handelDeleteTask({ taskId, ListIndex }))
                notifySuccess("Task deleted")
            } else {
                notifyError("Something went wrong")
            }
        } catch (error) {

            notifyError("Something went wrong")
        }
    }

    const confirmDelete = (taskId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this task? This action cannot be undone.');
        if (isConfirmed) {
            handelDelete(taskId);
        }
    };

    return <Trash onClick={() => confirmDelete(taskId)} />
}

export default TaskDelete