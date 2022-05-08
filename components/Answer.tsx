import { useState, useEffect, useRef } from "react";
import Router from "next/router";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import Author from "./Author";

export default function Answer({ showAnswer, token, questionId, callBack }) {
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [updateAnswer, setUpdateAnswer] = useState({ text: "", id: undefined });
  const [deleteAnswer, setDeleteAnswer] = useState({ id: undefined });

  const answerRef = useRef();

  async function handleFetchAnswers() {
    try {
      const result = await axios.get(
        `http://localhost:8080/v1/question/${questionId}`
      );

      if (result.status === 200 && result.data) {
        setAnswers(result.data.data.Answers);
      }
    } catch (error) {}
  }

  async function handleCreateAnswer(e) {
    e.preventDefault();

    if (!token) {
      return Router.push("/login");
    }

    if (!answerText) return;

    try {
      const result = await axios.post(
        "http://localhost:8080/v1/answer/create",
        {
          question_id: questionId,
          answer: answerText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (result.status === 200 && result.data) {
        await handleFetchAnswers();
        // @ts-ignore
        answerRef.current.value = "";
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
    }
  }

  async function handleUpdateAnswer() {
    if (!updateAnswer.text || !updateAnswer.id) return;

    try {
      const result = await axios.post(
        "http://localhost:8080/v1/answer/update",
        {
          id: updateAnswer.id,
          answer: updateAnswer.text,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (result.status === 200 && result.data) {
        await handleFetchAnswers();
        setIsEdit(false);
        setUpdateAnswer({ text: "", id: undefined });
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
    }
  }

  async function handleDeleteAnswer() {
    if (!deleteAnswer.id) return;

    try {
      const result = await axios.post(
        "http://localhost:8080/v1/answer/delete",
        {
          id: deleteAnswer.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (result.status === 200 && result.data) {
        await handleFetchAnswers();
        setDeleteAnswer({ id: undefined });
        setIsDelete(false);
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
    }
  }

  function isValid(authorId) {
    if (!token) return false;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const id = JSON.parse(jsonPayload).id;

    if (id && id === authorId) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    handleFetchAnswers();
  }, []);

  if (!showAnswer) return <></>;

  if (!answers || answers.length === 0)
    return (
      <div className="py-3">
        <p className="text-center py-5">No answers yet.</p>

        <div className="container">
          <form
            onSubmit={(e) => handleCreateAnswer(e)}
            className="form-inline d-flex gap-2 w-100 mr-5"
          >
            <input
              ref={answerRef}
              type="text"
              className="form-control mr-3 mb-2 mb-sm-0"
              placeholder="Help this question"
              required
              onChange={(e) => setAnswerText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </div>
      </div>
    );

  return (
    <div>
      <div>
        {answers.map((value, index) => (
          <div className="feed-items py-3" key={index}>
            <div className="box-item-quora">
              <div
                className="w-100"
                style={{
                  marginLeft: "8px",
                  paddingLeft: "18px",
                  borderLeft: "3px solid grey",
                  maxWidth: "700px",
                }}
              >
                <div className="contentbox">
                  <Author id={value.AuthorID} />{" "}
                  <span>- {new Date(value.CreatedAt).toLocaleString()} </span>
                  {isValid(value.AuthorID) ? (
                    <>
                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => {
                          setUpdateAnswer({
                            text: value.AnswerText,
                            id: value.ID,
                          });
                          setIsEdit(true);
                        }}
                      >
                        Edit
                      </button>

                      {/* EDIT DIALOG */}
                      <Dialog open={isEdit} onClose={() => setIsEdit(false)}>
                        <DialogTitle>Edit answer</DialogTitle>
                        <DialogContent>
                          <TextField
                            autoFocus
                            value={updateAnswer.text}
                            margin="dense"
                            id="answer"
                            label="Answer"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) =>
                              setUpdateAnswer({
                                ...updateAnswer,
                                text: e.target.value,
                              })
                            }
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setIsEdit(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => handleUpdateAnswer()}>
                            Update
                          </Button>
                        </DialogActions>
                      </Dialog>

                      <div
                        className="btn btn-sm btn-link"
                        onClick={() => {
                          setDeleteAnswer({ id: value.ID });
                          setIsDelete(true);
                        }}
                      >
                        Delete
                      </div>

                      <Dialog
                        open={isDelete}
                        onClose={() => setIsDelete(false)}
                      >
                        <DialogTitle>Delete this Answer?</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Deleting this answer will remove the ability of your
                            answer to be listed in the question, please proceed
                            with caution.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setIsDelete(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => handleDeleteAnswer()}>
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </>
                  ) : undefined}
                </div>
                <div className="caption mt-1">
                  <p>{value.AnswerText}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="container">
        <form
          onSubmit={(e) => handleCreateAnswer(e)}
          className="form-inline d-flex gap-2 w-100 mr-5"
        >
          <input
            ref={answerRef}
            type="text"
            className="form-control mr-3 mb-2 mb-sm-0"
            placeholder={
              !token ? "You need to login first" : "Help this question"
            }
            required
            disabled={!token}
            onChange={(e) => setAnswerText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
