import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Table } from 'antd'
import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import './news.css'


const EditableContext = React.createContext(null);

export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get('/categories').then(res => {
      setDataSource(res.data)
    })
  }, [])

  const handleSave = (record) => {
    setDataSource(dataSource.map(item => {
      if(item.id === record.id) {
        return {
          id: item.id,
          title: record.title,
          value: record.title
        }
      }
      return item
    }))

    axios.patch(`/categories/${record.id}`, {
      title: record.title,
      value: record.title
    })
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
    },
    {
      title: '操作',
      render: (_, record) => <Button icon={<DeleteOutlined />} shape='circle' danger onClick={() => handleDelete(record)}/>
    }
  ]

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
  
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
  
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
  
    let childNode = children;
  
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  
    return <td {...restProps}>{childNode}</td>;
  };

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除该条新闻吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setDataSource(dataSource.filter(item => item.id !== record.id))
        axios.delete(`/categories/${record.id}`).then(() => {
          message.success('删除成功')
        }).catch(() => {
          message.error('删除失败')
        })
      }
    });
  }

  return (
    <div>
      <Table components={components} columns={columns} dataSource={dataSource} rowKey={(item) => item.id} pagination={{pageSize: 6}} />
    </div>
  )
}
