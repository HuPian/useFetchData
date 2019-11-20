import React, {useState} from 'react'
import TestUtils from 'react-dom/test-utils'
import { JSDOM } from 'jsdom'

import useFetchData, {setGlobalOptionConfig} from '../lib/index';
import chai, {expect} from 'chai';
import spies from "chai-spies";
import fetchMock from 'fetch-mock';

const spy = chai.use(spies).spy;
const {document}=(new JSDOM('')).window;
global.document = document;
global.window = document.defaultView;
global.Response = function (body, init) {
    this.status =  init.status;
};

describe("useFetchData", ()=>{
  const mockContext = {
    startLoading: spy(),
    endLoading: spy(),
    successCb:spy(),
    errorCb:spy(),
    timeoutCb:spy(),
    dataHandler:spy()
  };

    function TestComponent({api, optConfig={}}){
        const [page, setPage]=useState(0);

        useFetchData({api:api, body:{page}}, ()=>{
            mockContext.dataHandler();
        },[page],optConfig);

        const handleClick = ()=>{
            setPage(page+1);
        };

        return <div onClick={handleClick} className="btn">click</div>
    }

  beforeEach(()=>{
    const delay = (time=2500) => new Promise((resolve) => {
      setTimeout(() => resolve(), time);
    });
    const mockData={
      data: {},
      message: "",
      success: true
    };
    fetchMock.mock('path:/api/test1', ()=>delay().then(()=>mockData))
        .mock('path:/api/test2',()=>delay().then(()=>({...mockData,success: false})))
        .mock('path:/api/test3',()=>delay(12000).then(()=>({...mockData,success: false})));
  });
  afterEach(()=>{
    fetchMock.restore();
    chai.spy.restore();
  });
  describe("loading handler",()=>{

    it('should show loading and end loading', (done)=>{
        const optConfig = {
            showLoading:true,
            loadingStartCb:()=> {
                mockContext.startLoading();
                expect(mockContext.startLoading).to.have.been.called();
            },
            loadingEndCb:()=>{
                mockContext.endLoading();
                expect(mockContext.endLoading).to.have.been.called();
                done()
            },
        }
      TestUtils.renderIntoDocument(<TestComponent api={'http://test.com/api/test1'} optConfig={optConfig} />);
    });
  });

  describe("success handler",()=>{

    it('should show success msg when request data', (done)=>{

       const optConfig =  {
           showSuccessMsg:true,
           successMsg:"请求成功",
           successCb: (data)=>{
               expect(data).to.be.equal("请求成功");
               done();
           }
       };
       TestUtils.renderIntoDocument(<TestComponent api={'http://test.com/api/test1'} optConfig={optConfig}/>);
    })

  });

  // todo: add more test
});