import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Card,
  Col,
  Row,
  Statistic,
  Typography,
  Tag,
  Input,
  Select,
  Button,
  Space,
  Table,
  message,
} from 'antd';

import {
  DashboardOutlined,
  MedicineBoxOutlined,
  LogoutOutlined,
  SearchOutlined,
  PrinterOutlined,
} from '@ant-design/icons';

import {
  Layout,
  Menu,
  theme,
} from 'antd';

import {
  useLocation,
  useNavigate,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Inventory from './inventory.jsx';
import Login from './Login.jsx';

import './dashboard.css';

const {
  Header,
  Content,
  Footer,
  Sider,
} = Layout;

const {
  Title,
  Text,
} = Typography;

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}

const menuItems = [
  getItem(
    'Dashboard',
    '/',
    <DashboardOutlined />
  ),

  getItem(
    'Inventory',
    '/inventory',
    <MedicineBoxOutlined />
  ),

  getItem(
    'Logout',
    '/logout',
    <LogoutOutlined />
  ),
];

function Dashboard() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] =
    useState('');
  const [typeFilter, setTypeFilter] =
    useState('All');

  const fetchItems = async () => {
    try {
      const token =
        localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:5000/api/inventory',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            'Failed to load inventory'
        );
      }

      setData(result);
    } catch (error) {
      message.error(
        error.message ||
          'Failed to load inventory'
      );
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const totalItems = data.length;

  const totalQuantity = data.reduce(
    (total, item) =>
      total + Number(item.Quantity || 0),
    0
  );

  const totalEquipment = data.filter(
    (item) =>
      item.Type === 'Equipment'
  ).length;

  const totalSupplies = data.filter(
    (item) =>
      item.Type === 'Supply'
  ).length;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemName =
        item.Name || '';

      const matchesSearch =
        itemName
          .toLowerCase()
          .includes(
            searchText.toLowerCase()
          );

      const matchesType =
        typeFilter === 'All' ||
        item.Type === typeFilter;

      return (
        matchesSearch &&
        matchesType
      );
    });
  }, [
    data,
    searchText,
    typeFilter,
  ]);

  const reportColumns = [
    {
      title: 'No.',
      key: 'number',
      render: (_, __, index) =>
        index + 1,
    },

    {
      title: 'Item Name',
      dataIndex: 'Name',
      key: 'Name',
      sorter: (a, b) =>
        (a.Name || '')
          .toLowerCase()
          .localeCompare(
            (b.Name || '')
              .toLowerCase()
          ),
    },

    {
      title: 'Category',
      dataIndex: 'Category',
      key: 'Category',
      sorter: (a, b) =>
        (a.Category || '')
          .toLowerCase()
          .localeCompare(
            (b.Category || '')
              .toLowerCase()
          ),
    },

    {
      title: 'Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity',
      sorter: (a, b) =>
        Number(a.Quantity || 0) -
        Number(b.Quantity || 0),
      defaultSortOrder: 'descend',
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
      title: 'Status',
      key: 'status',

      render: (_, record) => {
        const quantity = Number(
          record.Quantity || 0
        );

        if (quantity === 0) {
          return (
            <Tag color="red">
              Out of Stock
            </Tag>
          );
        }

        if (quantity <= 5) {
          return (
            <Tag color="orange">
              Low Stock
            </Tag>
          );
        }

        return (
          <Tag color="green">
            In Stock
          </Tag>
        );
      },
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <Title level={2}>
            Dashboard
          </Title>

          <Text type="secondary">
            Medical inventory overview
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
        >
          Print Report
        </Button>
      </div>

      <Row
        gutter={[20, 20]}
        className="dashboard-section"
      >
        <Col
          xs={24}
          sm={12}
          lg={6}
        >
          <Card className="stat-card">
            <Statistic
              title="Total Items"
              value={totalItems}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={6}
        >
          <Card className="stat-card">
            <Statistic
              title="Total Quantity"
              value={totalQuantity}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={6}
        >
          <Card className="stat-card">
            <Statistic
              title="Equipment"
              value={totalEquipment}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={6}
        >
          <Card className="stat-card">
            <Statistic
              title="Supplies"
              value={totalSupplies}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Inventory Report"
        className="dashboard-card report-print"
      >
        <div className="report-controls">
          <Space wrap>
            <Input
              placeholder="Search item"
              prefix={
                <SearchOutlined />
              }
              value={searchText}
              onChange={(e) =>
                setSearchText(
                  e.target.value
                )
              }
              style={{
                width: 250,
              }}
            />

            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{
                width: 160,
              }}
              options={[
                {
                  value: 'All',
                  label: 'All Types',
                },
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
          </Space>
        </div>

        <Table
          columns={reportColumns}
          dataSource={filteredData}
          rowKey="Id"
          pagination={false}
        />
      </Card>
    </div>
  );
}

function ProtectedRoute({
  children,
}) {
  const token =
    localStorage.getItem('token');

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

function App() {
  const [collapsed, setCollapsed] =
    useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: {
      colorBgContainer,
    },
  } = theme.useToken();

  // Get logged-in user
  const [user, setUser] =
    useState(null);

  useEffect(() => {
    const storedUser =
      localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(
          JSON.parse(storedUser)
        );
      } catch (error) {
        console.error(
          'Invalid user data:',
          error
        );
      }
    }
  }, []);

  // Login page
  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );

    message.success(
      'Logged out successfully'
    );

    navigate('/login');
  };

  return (
    <ProtectedRoute>
      <Layout className="app-layout">
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          className="app-sider"
        >
          <div className="logo">
            {collapsed
              ? 'MI'
              : 'MEDICAL INVENTORY'}
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[
              location.pathname,
            ]}
            items={menuItems}
            onClick={({ key }) => {
              if (key === '/logout') {
                handleLogout();
                return;
              }

              navigate(key);
            }}
          />
        </Sider>

        <Layout>
          <Header
            className="app-header"
            style={{
              background:
                colorBgContainer,
            }}
          >
            <div className="header-content">
              <div>
                <Title
                  level={4}
                  className="header-title"
                >
                  Medical Inventory
                  System
                </Title>

                <Text type="secondary">
                  Inventory Management
                </Text>
              </div>

              <div className="user-info">
                <div className="user-avatar">
                  {(
                    user?.username ||
                    'A'
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="user-details">
                  <strong>
                    {user?.username ||
                      'Administrator'}
                  </strong>

                  <span>
                    {user?.role ||
                      'Admin'}
                  </span>
                </div>
              </div>
            </div>
          </Header>

          <Content className="app-content">
            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/inventory"
                element={<Inventory />}
              />

              <Route
                path="/logout"
                element={
                  <Navigate
                    to="/login"
                    replace
                  />
                }
              />

              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />
            </Routes>
          </Content>

          <Footer className="app-footer">
            Medical Inventory System
            {' ©2026'}
          </Footer>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
}

export default App;

