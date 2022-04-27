import { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

export default function Action({ token, questionId, callBack }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  async function handleFetchQuestion() {
    try {
      const result = await axios.get(
        `http://localhost:8000/v1/question/${questionId}`
      );

      if (result.status === 200 && result.data) {
        setTitle(result.data.data.Title);
        setDesc(result.data.data.Desc);
      }
    } catch (error) {}
  }

  async function handleUpdateQuestion() {
    if (!title || !desc) return;

    try {
      const result = await axios.post(
        "http://localhost:8000/v1/question/update",
        {
          id: questionId,
          title: title,
          desc: desc,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (result.status === 200 && result.data) {
        await callBack();
        setIsEdit(false);
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
    }
  }

  async function handleDeleteQuestion() {
    if (!title || !desc) return;

    try {
      const result = await axios.post(
        "http://localhost:8000/v1/question/delete",
        {
          id: questionId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (result.status === 200 && result.data) {
        await callBack();
        setIsEdit(false);
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
    }
  }

  useEffect(() => {
    handleFetchQuestion();
  }, []);

  return (
    <div>
      <div className="btn" onClick={() => setIsEdit(true)}>
        Edit
      </div>

      {/* EDIT DIALOG */}
      <Dialog open={isEdit} onClose={() => setIsEdit(false)}>
        <DialogTitle>Edit a Question</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please make sure to have a clear title and description to help
            reader understart your problems.
          </DialogContentText>
          <TextField
            autoFocus
            value={title}
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            value={desc}
            margin="dense"
            id="desc"
            multiline
            rows={4}
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEdit(false)}>Cancel</Button>
          <Button onClick={() => handleUpdateQuestion()}>Update</Button>
        </DialogActions>
      </Dialog>

      <div className="btn" onClick={() => setIsDelete(true)}>
        Delete
      </div>

      <Dialog open={isDelete} onClose={() => setIsDelete(false)}>
        <DialogTitle>Delete this question?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting this question will remove the ability of your questions to
            be listed in the dashboard, please proceed with caution.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDelete(false)}>Cancel</Button>
          <Button onClick={() => handleDeleteQuestion()}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
