import React from 'react';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: values.username,
            password: values.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Invalid username or password'
        );
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );

      message.success('Login successful');
      navigate('/');
    } catch (error) {
      message.error(
        error.message || 'Login failed'
      );
    }
  };

  return (
    <>
      <section id="center">
        <div className="hero">
          <Form
            name="login"
            initialValues={{
              remember: true,
            }}
            style={{
              maxWidth: 360,
            }}
            onFinish={onFinish}
          >
            <span className="Signin">
              <h1>Sign In</h1>
            </span>

            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message:
                    'Please input your Username!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
              />
            </Form.Item>

           <Form.Item
  name="password"
  rules={[
    {
      required: true,
      message: 'Please input your Password!',
    },
  ]}
>
  <Input.Password
    prefix={<LockOutlined />}
    placeholder="Password"
  />
</Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
            >
              <Checkbox>
                Remember me
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                size="large"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default Login;