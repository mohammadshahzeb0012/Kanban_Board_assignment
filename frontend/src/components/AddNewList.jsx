import { useState } from "react"
import Endpoints from "../network/endpoints"
import request from "../network/request"
import { notifyError, notifySuccess } from "../utills/toastService"
import { useDispatch } from "react-redux"
import { addList } from "../feature/board/slice"

const AddNewList = () => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const addNewList = async (title) => {
        setLoading(true)
        try {
            const { data, success } = await request({
                url: Endpoints.createList,
                method: "POST",
                data: {
                    title
                }
            })
            if (success) {
                notifySuccess("List created")
                dispatch(addList(data))
                console.log(data)
            } else {
                notifyError("Something went wrong")
            }
        } catch (error) {
            notifyError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const TakeTittleInput = () => {
        const title = window.prompt()
        if (title) {
            if (title.length < 4) {
                notifyError("Title must be atleast 4 character long")
                return
            }
            addNewList(title)
        }
    }

    return <button
        disabled={loading}
        onClick={TakeTittleInput}>Add New List</button>
}

export default AddNewList
