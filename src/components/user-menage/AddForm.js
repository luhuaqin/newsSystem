import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select

const roleObj = {
  '1': 'superAdmin',
  '2': 'regionAdmin',
  '3': 'regionEditor'
}

const AddForm = forwardRef((props, ref) => {
  const { roleId, region } = JSON.parse(localStorage.getItem('token'))
  const [isDisabled, setIsDisabled] = useState(false)
  useEffect(() =>{
    setIsDisabled(props.isUpdateDisabled)
  }, [props.isUpdateDisabled])

  const checkRegionDisabled = (item) => {
    if(props.isUpdateRegion) {
      if(roleObj[roleId] === 'superAdmin') {
        return false
      }else {
        return true
      }
    }else {
      if(roleObj[roleId] === 'superAdmin') {
        return false
      }else {
        return item.value !== region
      }
    }
  }

  const checkRoleDisabled = (item) => {
    if(props.isUpdateRegion) {
      if(roleObj[roleId] === 'superAdmin') {
        return false
      }else {
        return true
      }
    }else {
      if(roleObj[roleId] === 'superAdmin') {
        return false
      }else {
        return roleObj[item.id] !== 'regionEditor'
      }
    }
  }

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      ref={ref}
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input placeholder="请输入密码" />
      </Form.Item>
      <Form.Item
        label="区域"
        name="region"
        rules={isDisabled ? [] : [
          {
            required: true,
            message: 'Please input your region!',
          },
        ]}
      >
        <Select
          placeholder="请选择区域"
          allowClear
          showSearch
          disabled={isDisabled}
          filterOption={(val, option) => {
            // val为输入的值，option为对象，option:{children: "Option中的label值"，key: "Option中的key值"，value: "Option中的value值"}
            if(option && (option.key.indexOf(val) >= 0 || option.key.indexOf(val.toLowerCase()) >= 0 || option.children.indexOf(val) >= 0)) {
              return true
            }
          }}
        >
          {
            props.regionList.map(item => {
              return <Option value={item.value} key={item.pinyin} disabled={checkRegionDisabled(item)}>{item.title}</Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        label="角色"
        name="roleId"
        rules={[
          {
            required: true,
            message: 'Please input your role!',
          },
        ]}
      >
        <Select
          placeholder="请选择角色"
          allowClear
          onChange={(value) => {
            if(value === 1) {
              setIsDisabled(true)
              ref.current.setFieldsValue({
                region: ''
              })
            }else {
              setIsDisabled(false)
            }
          }}
        >
          {
            props.rolesList.map(item => {
              return <Option value={item.roleType} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
            })
          }
        </Select>
      </Form.Item>
    </Form>
  )
})

export default AddForm
