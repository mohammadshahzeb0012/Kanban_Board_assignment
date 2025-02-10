import { Tooltip, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { deleteList, updateList } from "../feature/board/slice";
import request from "../network/request";
import Endpoints from "../network/endpoints";
import { notifyError, notifySuccess } from "./toastService";

const ActionTooltip = ({ listIndex, listId }) => {
    const dispatch = useDispatch()

    const handelModify = async (type) => {
        let title = null
        if (type === "PUT") {
            title = prompt()
            if (!title || title.length < 3) {
                notifyError("Totile must be provided")
                return
            }
        }

        try {
            const { success } = await request({
                url: `${Endpoints.modifyList}/${listId}`,
                method: type === 'PUT' ? 'PUT' : 'DELETE',
                data: {
                    ...(title && { title })
                }
            })
            if (success) {
                if (type === "PUT"){
                    notifySuccess("List updates")
                    dispatch(updateList({listIndex,title}))
                }else{
                    notifySuccess("List deleted")
                    dispatch(deleteList(listIndex))
                }
            } else {
                notifyError("Something went wrong")
            }
        } catch (error) {
            notifyError("Something went wrong")
        }
    }

    return (
        <Tooltip
            title={
                <Space direction="vertical" size="small">
                    <Button type="text" icon={<EditOutlined />} onClick={() => handelModify('PUT')}>
                        Edit
                    </Button>
                    <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handelModify("DELETE")}>
                        Delete
                    </Button>
                </Space>
            }
            placement="bottom"
            overlayInnerStyle={{
                backgroundColor: "#ffffff",
            }}
        >
            <Button icon={<MoreOutlined />} />
        </Tooltip>
    );
};

export default ActionTooltip;