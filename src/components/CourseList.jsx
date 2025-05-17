import React from "react";
import {
  Table,
  Tag,
  Image,
  Menu,
  Dropdown as AntDropdown,
  message,
  Modal,
  Card,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button } from "react-bootstrap";
import { configs } from "../configs";
import { useNavigate } from "react-router-dom";
import { CourseStatus } from "../utils/enums";
import axios from "axios";

const statusColors = {
  draft: "gray",
  pending: "orange",
  published: "green",
  hidden: "blue",
  rejected: "red",
};

const statusLabels = {
  draft: "Nháp",
  pending: "Chờ duyệt",
  published: "Đã xuất bản",
  hidden: "Ẩn",
  rejected: "Bị từ chối",
};

const CourseList = ({ courses, fetchCourses }) => {
  const navigate = useNavigate();

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await axios.delete(
        `${configs.API_BASE_URL}/courses/${courseId}`
      );
      message.success("Khóa học đã được xóa thành công");
      fetchCourses();
    } catch (error) {
      console.error("Lỗi khi xóa khóa học:", error);
      message.error("Không thể xóa khóa học. Vui lòng thử lại.");
    }
  };

  const handleActionConfirm = async (key, record) => {
    let _status = '';
    if (key === "published") {
      _status = CourseStatus.PUBLISHED;
    } else if (key === "rejected") {
      _status = CourseStatus.REJECTED;
    } else {
      return;
    }

    try {
      await axios.put(`${configs.API_BASE_URL}/courses/${record.id}`,
        {
          status: _status,
        }
      );
      message.success('Duyệt khóa học thành công')
    } catch (error) {
      message.error("Lỗi duyệt khóa học");
    } finally {
      fetchCourses();
    }
  };

  const handleAction = async (key, record) => {
    const actions = {
      published: {
        action: "duyệt",
        okText: "Duyệt",
        icon: <CheckCircleOutlined style={{ color: "green" }} />,
      },
      rejected: {
        action: "từ chối",
        okText: "Từ chối",
        icon: <CloseCircleOutlined style={{ color: "red" }} />,
      },
    };
  
    const selectedAction = actions[key];
    if (!selectedAction) return;
  
    const { action, okText, icon } = selectedAction;
    const title = `Xác nhận ${action} khóa học`;
    const content = `Bạn có chắc chắn muốn ${action} khóa học này không?`;
  
    Modal.confirm({
      title,
      icon,
      content,
      centered: true,
      okText,
      cancelText: "Hủy",
      onOk() {
        handleActionConfirm(key, record);
      },
    });
  };

  const columns = [
    {
      title: "Khóa học",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={record.image?.file_url}
            width={80}
            height={50}
            style={{ borderRadius: 5 }}
          />
          <div style={{ marginLeft: 12, maxWidth: 300 }}>
            <div
              style={{
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/courses/view/${record.id}`)}
            >
              {record.name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#888",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Giáo viên",
      dataIndex: "teacher_name",
      key: "teacher_name",
      render: (teacher_name) => teacher_name || "N/A",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category) => category || "N/A",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price !== null && price !== undefined && price !== 0
          ? `${price.toLocaleString()} VND`
          : "Miễn phí",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "online" ? "blue" : "purple"}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <AntDropdown
          overlay={
            <Menu onClick={(e) => handleAction(e.key, record)}>
              <Menu.Item
                key="published"
                icon={<CheckCircleOutlined />}
                style={{ color: "#1890ff" }}
              >
                Duyệt
              </Menu.Item>
              <Menu.Item key="rejected" icon={<CloseCircleOutlined />} danger>
                Từ chối
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button variant="light" className="border-0">
            <EllipsisOutlined style={{ fontSize: "18px" }} />
          </Button>
        </AntDropdown>
      ),
    },
  ];

  return (
    <Card>
      <Table
        columns={columns}
        dataSource={courses}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default CourseList;
