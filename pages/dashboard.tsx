import Router from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Author from "../components/Author";
import Action from "../components/Action";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Answer from "../components/Answer";

export default function DashboardPage() {
  const [isAuth, setIsAuth] = useState({ status: false, token: undefined });
  const [list, setList] = useState([]);

  const [isCreate, setIsCreate] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createDesc, setCreateDesc] = useState("");

  const [showAnswer, setShowAnswer] = useState("");

  const [searchInput, setSearchInput] = useState("");

  function handleInit() {
    const isAuth = Cookies.get("access_token");

    if (!isAuth) {
      return setIsAuth({
        status: false,
        token: "",
      });
    }
    setIsAuth({
      status: true,
      token: isAuth,
    });
  }

  async function handleFetchQuestions() {
    try {
      const result = await axios.get("http://localhost:8080/v1/questions");

      if (result.status === 200 && result.data) {
        setList(result.data.data);
      }
    } catch (error) {}
  }

  async function handleCreateQuestion() {
    if (!createTitle || !createDesc) return;

    try {
      const result = await axios.post(
        "http://localhost:8080/v1/question/create",
        {
          title: createTitle,
          desc: createDesc,
        },
        {
          headers: { Authorization: `Bearer ${isAuth.token}` },
        }
      );

      if (result.status === 200 && result.data) {
        await handleFetchQuestions();
        setIsCreate(false);
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
    }
  }

  function isValid(authorId) {
    if (!isAuth.token) return false;

    const base64Url = isAuth.token.split(".")[1];
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
    handleInit();
    handleFetchQuestions();
  }, []);

  async function handleSearch() {
    if (!searchInput) return await handleFetchQuestions();
    try {
      const result = await axios.get(
        `http://localhost:8080/v1/question/search?query=${searchInput}`
      );

      if (result.status === 200 && result.data) {
        console.log(result.data);
        setList([result.data.data]);
      }
    } catch (error) {}
  }

  useEffect(() => {
    handleSearch();
  }, [searchInput]);

  return (
    <>
      <nav className="navbar">
        <div className="container d-flex flex-row">
          <h3>Discutio</h3>

          <div className="d-flex w-20">
            {isAuth?.status ? (
              <div className="mx-2">
                <div className="d-flex align-items-center">
                  <button
                    onClick={() => setIsCreate(true)}
                    className="btn btn-primary"
                  >
                    Create
                  </button>

                  <Dialog open={isCreate} onClose={() => setIsCreate(false)}>
                    <DialogTitle>Ask a Question</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Please make sure to have a clear title and description
                        to help reader understart your problems.
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setCreateTitle(e.target.value)}
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        id="desc"
                        multiline
                        rows={4}
                        label="Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setCreateDesc(e.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setIsCreate(false)}>Cancel</Button>
                      <Button onClick={() => handleCreateQuestion()}>
                        Ask Question
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </div>
            ) : undefined}

            {/* SEARCH */}
            <div className="form-inline d-flex w-100 mr-5 gap-2">
              <input
                type="text"
                className="form-control mr-4 mb-2 mb-sm-0"
                placeholder="Search question..."
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {!isAuth?.status ? (
              <div id="login-status" style={{ marginLeft: "8px" }}>
                <div className="d-flex align-items-center">
                  <a className="btn btn-primary" href="/login">
                    Login
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ marginLeft: "8px" }}>
                <div className="d-flex align-items-center">
                  <button
                    className="btn"
                    onClick={() => {
                      Cookies.set("access_token", "");
                      Router.push("/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div
        id="question-list"
        className="container mt-10"
        style={{ margin: "18px 8%", marginBottom: "10%" }}
      >
        {list
          .filter((item) => item.Title !== "")
          .map((value, index) => (
            <div key={index} className="feed-items py-3 pl-5 border-bottom">
              <div className="box-item-quora">
                <div className="w-100" style={{ maxWidth: "700px" }}>
                  <div className="contentbox">
                    <Author id={value.AuthorID} />{" "}
                    <span>- {new Date(value.CreatedAt).toLocaleString()} </span>
                    <span>
                      - {value.Answers.length}{" "}
                      {value.Answers.length > 1 ? "Peoples" : "People"} help
                      this question
                    </span>
                    <button
                      onClick={() => setShowAnswer(value.ID)}
                      className="btn btn-sm btn-link"
                    >
                      Show Answer
                    </button>
                  </div>
                  <div className="caption mt-1">
                    <h5>{value.Title}</h5>
                  </div>
                  <div>
                    <p>{value.Desc}</p>
                  </div>
                </div>
                {isValid(value.AuthorID) ? (
                  <Action
                    callBack={async () => await handleFetchQuestions()}
                    token={isAuth.token}
                    questionId={value.ID}
                  />
                ) : undefined}
              </div>
              <Answer
                showAnswer={showAnswer === value.ID}
                callBack={async () => await handleFetchQuestions()}
                token={isAuth.token}
                questionId={value.ID}
              />
            </div>
          ))}
      </div>

      {/* <form action="https://example.org/comments.php">
        <h4>Answer this post</h4>
        <textarea
          name="comments"
          cols={40}
          rows={4}
          placeholder="Enter your answer here ..."
        ></textarea>
        <input type="button" name="button" value="Replay" />
      </form> */}
    </>
  );
}
