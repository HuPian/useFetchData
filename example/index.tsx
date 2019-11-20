import React = require('react');
import {useState} from 'react';
import ReactDom = require('react-dom') ;
import {Table, message} from 'antd';
import 'antd/dist/antd.css'

import useFetchData from '../src';

const testApi = "https://mock.com/test";
const column = [{
  dataIndex:"id",
  title:"编码"
  },
  {
    dataIndex:"name",
    title:"姓名"
  }
]

function Example() {
  const [resource,setResource] = useState([]);
  const [pagination, setPagination] = useState({current:1,pageSize:20,total:0});
  const [loading, setLoading] = useState(false);
  useFetchData({api:testApi,body:{page:pagination.current, pageSize:pagination.pageSize}},(data)=>{
    setResource(data.list);
    setPagination({...pagination, total:data.count})
  }, [pagination.current,pagination.pageSize], {
    loadingStartCb:() => setLoading(true),
    loadingEndCb:() => setLoading(false),
    timeoutCb:(err)=> message.error(err),
    errorCb:(err)=> {
      console.log(err);
      message.error(err)
    }
  });

  const handlePaginationChange = (page,pageSize) => {
    setPagination({...pagination, current:page, pageSize});
  }

  return <Table columns={column} rowKey={"id"}
                dataSource={resource}
                loading={loading}
                pagination={{...pagination,onChange:handlePaginationChange}} />

}

ReactDom.render(<Example />, document.getElementById('app'));