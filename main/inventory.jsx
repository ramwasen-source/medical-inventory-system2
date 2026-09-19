import { useEffect, useState } from 'react';
import {
  Breadcrumb,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function Inventory() {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const fetchItems = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/inventory'
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setItems(data);
    } catch (error) {
      message.error(
        error.message || 'Failed to load inventory'
      );
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);

    form.setFieldsValue({
      name: item.Name,
      category: item.Category,
      quantity: item.Quantity,
      type: item.Type,
    });

    setIsModalOpen(true);
  };

  const handleCreate = async (values) => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/inventory',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      message.success(
        'Inventory item added successfully'
      );

      setIsModalOpen(false);
      setEditingItem(null);
      form.resetFields();

      fetchItems();
    } catch (error) {
      message.error(
        error.message || 'Failed to add inventory item'
      );
    }
  };

  const handleUpdate = async (values) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/inventory/${editingItem.Id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      message.success(
        'Inventory item updated successfully'
      );

      setIsModalOpen(false);
      setEditingItem(null);
      form.resetFields();

      fetchItems();
    } catch (error) {
      message.error(
        error.message || 'Failed to update inventory item'
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/inventory/${id}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      message.success(
        'Inventory item deleted successfully'
      );

      fetchItems();
    } catch (error) {
      message.error(
        error.message || 'Failed to delete inventory item'
      );
    }
  };

  const filteredData = items.filter((item) =>
    item.Name.toLowerCase().includes(
      searchText.toLowerCase()
    )
  );

  const columns = [
    {
      title: 'No.',
      key: 'number',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Item Name',
      dataIndex: 'Name',
      key: 'Name',
      sorter: (a, b) =>
        a.Name.toLowerCase().localeCompare(
          b.Name.toLowerCase()
        ),
    },
    {
      title: 'Category',
      dataIndex: 'Category',
      key: 'Category',
      sorter: (a, b) =>
        a.Category.toLowerCase().localeCompare(
          b.Category.toLowerCase()
        ),
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity',
      sorter: (a, b) =>
        a.Quantity - b.Quantity,
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: 'Type',
      render: (type) => (
        <Tag
          color={
            type === 'Equipment'
              ? 'blue'
              : 'green'
          }
        >
          {type}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() =>
              handleEdit(record)
            }
          >
            Edit
          </Button>

          <Button
            danger
            size="small"
            onClick={() =>
              handleDelete(record.Id)
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb
        style={{ margin: '16px 0' }}
        items={[
          { title: 'Dashboard' },
          { title: 'Inventory' },
        ]}
      />

      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: '#fff',
          borderRadius: 8,
        }}
      >
        <Space
          style={{
            width: '100%',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <h2>Inventory Items</h2>

          <Button
            type="primary"
            onClick={handleAdd}
          >
            + Add Item
          </Button>
        </Space>

        <Input
          placeholder="Search item"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
          style={{
            width: 300,
            marginBottom: 20,
          }}
        />

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="Id"
          pagination={{
            pageSize: 5,
          }}
        />
      </div>

      <Modal
        title={
          editingItem
            ? 'Edit Inventory Item'
            : 'Add Inventory Item'
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={
          editingItem
            ? 'Update'
            : 'Add'
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={
            editingItem
              ? handleUpdate
              : handleCreate
          }
        >
          <Form.Item
            label="Item Name"
            name="name"
            rules={[
              {
                required: true,
                message:
                  'Please enter item name',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                required: true,
                message:
                  'Please enter category',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              {
                required: true,
                message:
                  'Please enter quantity',
              },
            ]}
          >
            <InputNumber
              min={0}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[
              {
                required: true,
                message:
                  'Please select type',
              },
            ]}
          >
            <Select
              options={[
                {
                  value: 'Supply',
                  label: 'Supply',
                },
                {
                  value: 'Equipment',
                  label: 'Equipment',
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Inventory;

