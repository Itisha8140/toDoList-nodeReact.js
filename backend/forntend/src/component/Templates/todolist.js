import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Header from "../header";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";

import {
  Box,
  Button,
  Container,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TableBody,
} from "@mui/material";
// const Delete = 'Some text';
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.05)",
  p: 4,
};
export default function BasicTable(props) {
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open, setOpen] = React.useState(false);
  const [task, setTask] = useState([]);
  const [loader, setLoader] = useState(true);
  const [editId, setEditId] = useState("");
  const [searhQuery, setSearchQuery] = useState("");
  const [priority, setPriority] = useState("");

  //pagination
  const [page, setPage] = useState(1); 
  const [pageSize, setPageSize] = useState(5);
  const [resultCount, setResultCount] = useState(0);
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");
  const handleSearch = () => {
    getUsertask();
  };
  //post
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    duedate: "",
    priority: "",
    status: "",
  });
  const [selectedPriority, setSelectedPriority] = useState("");
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleClick = (event) => {
    event.preventDefault();
    const data = {
      id: editId ? editId : null,
      title: formData.title,
      description: formData.description,
      duedate: formData.duedate,
      priority: formData.priority,
      status: formData.status,
    };
    fetch(`/api/v1/task/taskAdd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        getUsertask();
        console.log("Todo added successfully:", data);
        setFormData({
          title: "",
          description: "",
          duedate: "",
          priority: "",
          status: "",
        });
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  };

  console.log("check page",page,pageSize,resultCount)
  //get
  const getUsertask = async (id) => {
    setLoader(true);
    let addQuery = "";
    if (status) {
      addQuery = addQuery + `&status=${status}`;
    }
    if (sort) {
      addQuery = addQuery + `&sortkey=duedate&sortorder=${sort}`;
      console.log("add", addQuery);
    }
    if (priority) {
      // console.log("add ", addQuery);
      addQuery = addQuery + `&sortkey=priority&sortorder=${priority}`;
    }
    if (searhQuery) {
      addQuery = addQuery + `&keyword=${searhQuery}`;
    }
    console.log(addQuery);
    await axios
      .get(
        `http://localhost:3000/api/v1/task/taskFind?page=${page}&resultPerPage=${pageSize}${addQuery}`
      )
      .then((response) => {
        console.log("response",response, response.data.task, response?.data?.taskCount);
        setTask(response?.data?.task);
        setResultCount( response?.data?.taskCount);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoader(false);
      });
  };
  // columns
  const columns = [
    { field: "id", headerName: "Id", width: 200 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 500 },
    { field: "priority", headerName: "Priority", width: 180 },
    { field: "status", headerName: "Status", width: 180 },
    { field: "duedate", headerName: "Due Date", width: 180 },
    {
      field: "actions",
      //   flex: 1,
      headerName: "Edit",
      minWidth: 30,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        console.log(editId);
        return <EditNoteIcon onClick={(e) => editTask(e, params)} />;
      },
    },

    {
      field: "delete",
      //   flex: 1,
      headerName: "Delete",
      minWidth: 30,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return <DeleteIcon onClick={(e, id) => deleteTask(e, params.id)} />;
      },
    },
  ];
  //rows
  const rows = [];
  console.log("task",task)
  task &&
    task.length > 0 &&
    task.map((item) =>
      rows.push({
        id: item?._id,
        title:
          item?.title?.charAt(0).toUpperCase() + item?.title?.slice(1) ?? "",
        description:
          item?.description?.charAt(0).toUpperCase() +
            item?.description?.slice(1) ?? "",
        priority:
          item?.priority === 1
            ? "High"
            : item?.priority === 2
            ? "Medium"
            : item?.priority === 3
            ? "Low"
            : "",
        status:
          item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1) ?? "",
        duedate: new Date(item?.duedate).toLocaleDateString(),
      })
    );
  rows.filter((row) => {
    if (selectedPriority === "") {
      return true; // If no priority is selected, show all rows
    } else {
      return row.priority === selectedPriority; // Show rows with the selected priority
    }
  });
  //delete
  const deleteTask = (e, id) => {
    e.stopPropagation();
    console.log("id", id);
    axios
      .delete(`http://localhost:3000//api/v1/task/taskDelete/${id}`)
      .then((response) => {
        console.log("Todo deleted:", response?.data);
        return getUsertask();
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };
  // updated
  const editTask = (e, params) => {
    e.stopPropagation();
    console.log("id", params.id);
    setEditId(params.id);
    handleOpen(true);
  };
  //useeffects
  useEffect(() => {
    getUsertask();
  }, [open, page, pageSize, status, sort, priority, searhQuery]);

  return (
    <React.Fragment>
      <Header />
      <CssBaseline />
      <Box sx={{ paddingTop: 20 }}>
        <TableContainer component={Paper}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
          >
            <div>
              <Stack spacing={2} direction="row" sx={{ p: 1 }}>
                <Button
                  onClick={() => {
                    handleOpen();
                    setEditId("");
                  }}
                  variant="contained"
                >
                  Add Task
                </Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Text in a modal
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      <Box
                        component="form"
                        sx={{
                          "& > :not(style)": { m: 1, width: "25ch" },
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          id="standard-basic"
                          label="Titlte"
                          name="title"
                          variant="standard"
                          value={formData.title}
                          onChange={handleInputChange}
                        />
                      </Box>
                      <Box
                        component="form"
                        sx={{
                          "& > :not(style)": { m: 1, width: "25ch" },
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          id="standard-basic"
                          name="description"
                          label="Description"
                          variant="standard"
                          value={formData.description}
                          onChange={handleInputChange}
                        />
                      </Box>
                      <Box
                        component="form"
                        sx={{
                          "& > :not(style)": { m: 1, width: "25ch" },
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          required
                          fullWidth
                          label="Due Date"
                          name="duedate"
                          type="date"
                          value={formData.duedate}
                          onChange={handleInputChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            min: new Date().toISOString().split("T")[0],
                          }}
                        />
                      </Box>
                    </Typography>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel htmlFor="grouped-native-select">
                        Status
                      </InputLabel>
                      <Select
                        native
                        defaultValue=""
                        label="Grouping"
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option aria-label="None" value="" />
                        <option value="Pending">Pending</option>
                        <option value="In progress">In progress</option>
                        <option value="Completed">Completed</option>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel htmlFor="grouped-select">Priority</InputLabel>
                      <Select
                        defaultValue=""
                        label="Grouping"
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="3">Low</MenuItem>
                        <MenuItem value="2">Medium</MenuItem>
                        <MenuItem value="1">High</MenuItem>
                      </Select>
                    </FormControl>
                    <Stack spacing={2} direction="row" sx={{ p: 1 }}>
                      <Button variant="contained" onClick={handleClick}>
                        submit
                      </Button>
                    </Stack>
                  </Box>
                </Modal>
              </Stack>
            </div>
            <FormControl
              sx={{ mt: 0, mb: 2, ml: 2, minWidth: 120 }}
              size="small"
            >
              <InputLabel id="Status">Status</InputLabel>
              <Select
                labelId="Status"
                label="Status"
                name="status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              sx={{ mt: 0, mb: 2, ml: 2, minWidth: 120 }}
              size="small"
            >
              <InputLabel id="Due Date">Due Date</InputLabel>
              <Select
                labelId="Due Date"
                label="Due Date"
                name="sort"
                value={sort}
                onChange={(e) => {
                  setPriority("");
                  setPage(1);
                  setSort(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
            <div>
              <TextField
                key="search"
                id="search"
                size="small"
                name="search"
                label="search"
                variant="outlined"
                value={searhQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outlined" size="large" onClick={handleSearch}>
                <SearchIcon />
              </Button>
            </div>
          </Box>
          <div style={{ height: 450, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pagination
              rowsPerPageOptions={[5]}
              page={page == 0 ? 0 : page - 1}
              paginationMode="server"
              pageSize={pageSize}
              onPageChange={(newPage) => {
                setPage(newPage + 1);
              }}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              disableColumnMenu={true}
              hideFooterSelectedRowCount={true}
              rowCount={resultCount ?? 0}
            />
          </div>
        </TableContainer>
      </Box>
    </React.Fragment>
  );
}
