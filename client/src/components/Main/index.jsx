import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import axiosInstance from "../../utils/axiosInstance";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

const Main = () => {
  const [tasks, setTasks] = useState(null);
  const [taskModal, setTaskModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [role, setRole] = useState("user");
  const [taskDetailModal, setTaskDetailModal] = useState(false);
  const [data, setData] = useState({
    taskTitle: "",
    taskDetail: "",
    taskDeadline: "",
    reward: 1000,
    status: "draft",
  });
  const [task, setTask] = useState(data);
  const JWT = localStorage.getItem("token");

  const handleInput = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleEditInput = (e) => {
    e.preventDefault();
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("http://localhost:5000/api/tasks", {
        headers: {
          token: JWT,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) setTasks(res.data);
      else console.log("Error :", res.status);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("http://localhost:5000/api/users", {
        headers: {
          token: JWT,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        setRole(res.data.role);
      } else {
        console.log("Error :", res.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        "http://localhost:5000/api/tasks/create-task",
        data,
        {
          headers: {
            token: JWT,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 201) {
        setTaskModal(false);
        alert("Task created successfully");
        await fetchTasks();
      } else {
        alert("Failed to create task. Please check your input.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (task_data) => {
    try {
      const res = await axiosInstance.delete(
        "http://localhost:5000/api/tasks/delete",
        {
          data: task_data,
        }
      );
      if (res.status === 200) {
        await fetchTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (task_data) => {
    setEditModal(true);
    setTask({
      id: task_data.id,
      userId: task_data.userId,
      taskTitle: task_data.taskTitle,
      taskDetail: task_data.taskDetail,
      taskDeadline: task_data.taskDeadline, // Ensure taskDeadline is set here
      reward: task_data.reward,
      status: task_data.status,
    });
  };
  const handleUpdate = async (task_data) => {
    try {
      const res = await axiosInstance.post(
        "http://localhost:5000/api/tasks/edit",
        {
          id: task_data.id,
          userId: task_data.userId,
          taskTitle: task_data.taskTitle,
          taskDetail: task_data.taskDetail,
          taskDeadline: task_data.taskDeadline,
          reward: task_data.reward,
          status: task_data.status,
        }
      );
      if (res.status === 200) {
        alert("Task updated successfully");
        setEditModal(false);
        await fetchTasks();
      }else {
        alert("Failed to update task. Please check your input.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDetail = (task) => {
    setTaskDetailModal(true);
    setTask(task);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ background: "teal" }}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Task Management App
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Container sx={{ mt: 5 }}>
        {role === "admin" && (
          <Button
            variant="outlined"
            onClick={() => setTaskModal(true)}
            sx={{
              "&:hover": {
                backgroundColor: "#0069d9",
                borderColor: "#0062cc",
                color: "#ffff",
                boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
              },
            }}
          >
            Create Task
          </Button>
        )}
        <Modal
          open={taskModal}
          onClose={() => setTaskModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2>Create Task</h2>
            <form>
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Task Title"
                name="taskTitle"
                onChange={(e) => handleInput(e)}
                value={data.taskTitle}
                fullWidth
                required
                sx={{ mb: 4 }}
              />
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Task Details"
                name="taskDetail"
                multiline
                rows={2}
                maxRows={4}
                onChange={(e) => handleInput(e)}
                value={data.taskDetail}
                fullWidth
                required
                sx={{ mb: 4 }}
              />
              <TextField
                type="date"
                variant="outlined"
                color="secondary"
                label="Task Deadline"
                name="taskDeadline"
                onChange={(e) => handleInput(e)}
                value={data.taskDeadline}
                fullWidth
                required
                sx={{ mb: 4 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                label="Reward"
                name="reward"
                onChange={(e) => handleInput(e)}
                value={data.reward}
                fullWidth
                required
                sx={{ mb: 4 }}
              />
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="status"
                  value={data.status}
                  label="Status"
                  onChange={(e) => handleInput(e)}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
              <Stack container spacing={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  type="submit"
                  onClick={handleCreate}
                >
                  Create Task
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setTaskModal(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </Box>
        </Modal>
        <Modal
          open={editModal}
          onClose={() => setEditModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2>Edit Details</h2>
            <form>
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Task Title"
                name="taskTitle"
                onChange={(e) => handleEditInput(e)}
                value={task.taskTitle}
                fullWidth
                required
                sx={{ mb: 4 }}
              />
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Task Details"
                name="taskDetail"
                multiline
                rows={2}
                maxRows={4}
                onChange={(e) => handleEditInput(e)}
                value={task.taskDetail}
                fullWidth
                required
                sx={{ mb: 4 }}
              />
              <TextField
                type="date"
                variant="outlined"
                color="secondary"
                label="Task Deadline"
                name="taskDeadline"
                onChange={(e) => handleEditInput(e)}
                value={task.taskDeadline}
                fullWidth
                required
                sx={{ mb: 4 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                label="Reward"
                name="reward"
                onChange={(e) => handleEditInput(e)}
                value={task.reward}
                fullWidth
                required
                sx={{ mb: 4 }}
              />
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="status"
                  value={task.status}
                  label="Status"
                  onChange={(e) => handleEditInput(e)}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
              <Stack container spacing={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  type="submit"
                  onClick={() => {
                    handleUpdate(task);
                    setEditModal(false);
                  }}
                >
                  Update Task
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </Box>
        </Modal>
        <Modal
          open={taskDetailModal}
          onClose={() => setTaskDetailModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2>Task Details-2</h2>
            <form>
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Task Title"
                name="taskTitle"
                value={task.taskTitle}
                fullWidth
                disabled
                sx={{ mb: 4 }}
              />
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Task Details"
                name="taskDetail"
                multiline
                rows={2}
                maxRows={4}
                value={task.taskDetail}
                fullWidth
                disabled
                sx={{ mb: 4 }}
              />
              <TextField
                type="date"
                variant="outlined"
                color="secondary"
                label="Task Deadline"
                name="taskDeadline"
                value={task.taskDeadline}
                fullWidth
                disabled
                sx={{ mb: 4 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                label="Reward"
                name="reward"
                value={task.reward}
                fullWidth
                disabled
                sx={{ mb: 4 }}
              />
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="status"
                  value={task.status}
                  label="Status"
                  disabled
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <Stack container spacing={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setTaskDetailModal(false)}
                >
                  Close
                </Button>
              </Stack>
            </form>
          </Box>
        </Modal>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {tasks &&
            tasks.map((task, i) => (
              <Grid item key={i} xs={12} md={6} lg={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {task.taskTitle}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Reward: {task.reward}
                    </Typography>
                    <Typography variant="body2">{task.taskDetail}</Typography>
                    <Button
                      size="small"
                      onClick={() => handleDetail(task)}
                      sx={{ mt: 2 }}
                    >
                      View Details
                    </Button>
                    {role === "admin" && (
                      <>
                        <Button
                          size="small"
                          onClick={() => handleEdit(task)}
                          sx={{ mt: 2, ml: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleDelete(task)}
                          sx={{ mt: 2, ml: 1, color: "error.main" }}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </>
  );
};

export default Main;
