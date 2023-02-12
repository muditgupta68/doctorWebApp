import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button } from "antd";
import { useSelector } from 'react-redux';

const NotificationTable = ({ handleMethod, target, actionBtn, BtnType }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (text) => (
        <a
          onClick={() => {
            navigate(text);
          }}
        >
          {text.replace('/','')}
        </a>
      ),
    },
    {
      title: "Message",
      dataIndex: "msg",
      key: "msg",
    },
  ];

  const dataGen = (targetData) => {
    let finalData = [];

    targetData?.map((tg) => {
      let obj = {};
      obj.key = tg?.data?.doctorId;
      obj.msg = tg?.message;
      obj.link = tg?.data?.onClickPath;
      obj.name = tg?.data?.name;
      obj.subject = tg?.type;
      finalData.push(obj);
      return 0;
    });
    return finalData;
  };

  const data = dataGen(target);

  return (
    <div>
      <div className="d-flex justify-content-end m-3">
        {BtnType === "danger" ? (
          <Button onClick={handleMethod} type="primary" danger ghost>{actionBtn}</Button>
        ) : (
          <Button onClick={handleMethod} type="primary" ghost>{actionBtn}</Button>
        )}
      </div>
      <Table
        pagination={{
          pageSizeOptions: ["15", "20"],
          showSizeChanger: true,
          pageSize: 5,
        }}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};

export default NotificationTable;
