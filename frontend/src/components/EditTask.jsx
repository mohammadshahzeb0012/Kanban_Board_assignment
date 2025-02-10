import { Pen } from 'lucide-react'

const EditTask = ({task,taskIndex,listIndex,showModal}) => {
  return (
    <Pen onClick={()=>{
        showModal(undefined,listIndex,"update",taskIndex,task._id)
    }} />
  )
}

export default EditTask
