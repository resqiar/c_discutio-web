import axios from "axios";
import { useState, useEffect } from "react";

export default function Author({ id }) {
  const [author, setAuthor] = useState({});

  async function handleFetchAuthor() {
    try {
      const result = await axios.get(`http://localhost:8080/v1/userid/${id}`);

      if (result.status === 200 && result.data) {
        setAuthor(result.data.data);
      }
    } catch (error) {}
  }

  useEffect(() => {
    handleFetchAuthor();
  }, []);

  return (
    <strong id="author-username">
      {
        // @ts-ignore
        author.Username ?? ""
      }
      <i className="fas fa-check-circle"></i>
    </strong>
  );
}
