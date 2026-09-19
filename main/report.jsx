import { useMemo, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import { SearchOutlined, PrinterOutlined } from '@ant-design/icons';
import { data } from './inventory.jsx';

const { Title, Text } = Typography;

function Reports() {
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const totalItems = data.length;

  const totalQuantity = data.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const lowStock = data.filter(
    (item) => item.quantity > 0 && item.quantity <= 5
  ).length;

  const outOfStock = data.filter(
    (item) => item.quantity === 0
  ).length;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchesType =
        typeFilter === 'All' || item.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [searchText, typeFilter]);

  const columns = [
    {
      title: 'No.',
      key: 'number',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Equipment' ? 'blue' : 'green'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        if (record.quantity === 0) {
          return <Tag color="red">Out of Stock</Tag>;
        }

        if (record.quantity <= 5) {
          return <Tag color="orange">Low Stock</Tag>;
        }

        return <Tag color="green">In Stock</Tag>;
      },
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Breadcrumb
        style={{ margin: '16px 0' }}
        items={[
          { title: 'Dashboard' },
          { title: 'Reports' },
        ]}
      />

      <div className="page-container">
        <Space
          direction="vertical"
          size={4}
          style={{
            width: '100%',
            marginBottom: 24,
          }}
        >
          <Title level={2}>Inventory Reports</Title>

          <Text type="secondary">
            View and monitor your medical inventory stock information.
          </Text>
        </Space>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Items"
                value={totalItems}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Quantity"
                value={totalQuantity}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Low Stock"
                value={lowStock}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Out of Stock"
                value={outOfStock}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title="Inventory Report"
          style={{ marginTop: 24 }}
        >
          <Space
            wrap
            style={{
              width: '100%',
              marginBottom: 20,
              justifyContent: 'space-between',
            }}
          >
            <Space wrap>
              <Input
                placeholder="Search item"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
              />

              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                style={{ width: 160 }}
                options={[
                  { value: 'All', label: 'All Types' },
                  { value: 'Supply', label: 'Supply' },
                  { value: 'Equipment', label: 'Equipment' },
                ]}
              />
            </Space>

            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
            >
              Print Report
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="key"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </>
  );
}

export default Reports;