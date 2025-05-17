import React, { useEffect } from "react";
import { Layout, Card, Table, List } from "antd";
import { Line, Bar } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Chart, registerables } from "chart.js";
import { useNavigate } from "react-router-dom";
import { configs } from "../../configs";
import { useSelector } from "react-redux";

Chart.register(...registerables);

const { Content } = Layout;

const statsData = [
  { icon: <UserOutlined />, label: "Students", value: "150" },
  { icon: <BookOutlined />, label: "Courses", value: "8" },
  { icon: <CalendarOutlined />, label: "Classes This Month", value: "22" },
  { icon: <FileTextOutlined />, label: "Assignments Graded", value: "56" },
];

const lineChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    { label: "Students", data: [50, 70, 80, 100, 90, 110], borderColor: "#1890ff", fill: false },
  ],
};

const barChartData = {
  labels: ["Math", "English", "Science", "History", "IT"],
  datasets: [
    { label: "Progress", data: [75, 85, 90, 80, 95], backgroundColor: "#52c41a" },
  ],
};

const classColumns = [
  { title: "Course", dataIndex: "course", key: "course" },
  { title: "Students", dataIndex: "students", key: "students" },
  { title: "Progress", dataIndex: "progress", key: "progress" },
];

const classData = [
  { key: "1", course: "Mathematics", students: 30, progress: "80%" },
  { key: "2", course: "English", students: 25, progress: "75%" },
  { key: "3", course: "Science", students: 20, progress: "90%" },
];

const schedule = [
  { title: "Math Class - 10:00 AM", date: "March 28, 2025" },
  { title: "English Class - 2:00 PM", date: "March 28, 2025" },
  { title: "Science Lab - 4:00 PM", date: "March 29, 2025" },
];

const Dashboard = () => {
  const authState = useSelector((state) => state.auth);
  const login = authState.isLoggedIn;
  const navigate = useNavigate();

  useEffect(() => {
    if(!login) navigate(configs.routes.login);
  }, [])

  return (
    <Layout>
      <Content className="container mt-4">
        {/* Statistics */}
        <div className="row mb-4">
          {statsData.map((stat, index) => (
            <div key={index} className="col-md-3">
              <Card>
                <h4>{stat.icon} {stat.value}</h4>
                <p>{stat.label}</p>
              </Card>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="row mb-4">
          <div className="col-md-6">
            <Card title="Student Growth">
              <Line data={lineChartData} options={{ responsive: true }} />
            </Card>
          </div>
          <div className="col-md-6">
            <Card title="Class Progress">
              <Bar data={barChartData} options={{ responsive: true }} />
            </Card>
          </div>
        </div>

        {/* Class Management */}
        <Card title="My Classes" className="mb-4">
          <Table columns={classColumns} dataSource={classData} pagination={false} />
        </Card>

        {/* Schedule */}
        <Card title="Upcoming Classes">
          <List
            dataSource={schedule}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={item.title} description={item.date} />
              </List.Item>
            )}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default Dashboard;