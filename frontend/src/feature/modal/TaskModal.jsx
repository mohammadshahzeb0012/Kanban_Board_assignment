import { Modal, Form, Input, DatePicker, Select } from "antd";

const { Option } = Select;

const TaskModal = ({ isVisible, onClose, onSubmit, selectedListId }) => {
  const [form] = Form.useForm();

  const handleFormSubmit = (values) => {
    const formattedValues = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.format("DD-MM-YY") : null,
      listId: selectedListId,
    };
    onSubmit(formattedValues);
    form.resetFields();
  };

  return (
    <Modal
      title="Add New Task"
      open={isVisible}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Add Task"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <Form.Item label="Title" name="title" rules={[{ required: true, message: "Title is required" }]}>
          <Input placeholder="Enter task title" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Enter task description (optional)" />
        </Form.Item>

        <Form.Item label="Due Date" name="dueDate" rules={[{ required: true, message: "Due date is required" }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Priority" name="priority" rules={[{ required: true, message: "Priority is required" }]}>
          <Select placeholder="Select priority">
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;