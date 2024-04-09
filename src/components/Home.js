import React, { useState, useEffect } from "react";
import { Tabs, message, Row, Col, Button } from "antd";
import axios from "axios";

import { BASE_URL, TOKEN_KEY } from "../constants";

const { TabPane } = Tabs;

function Home(props) {
  const [posts, setPost] = useState([]);
  const [activeTab, setActiveTab] = useState("image");
  const [searchOption, setSearchOption] = useState({
    type: "",
    keyword: "",
  });

  const handleSearch = (option) => {
    const { type, keyword } = option;
    setSearchOption({ type: type, keyword: keyword });
  };

  useEffect(() => {
    const { type, keyword } = searchOption;
    fetchPost(searchOption);
  }, [searchOption]);

  const fetchPost = (option) => {
    const { type, keyword } = option;
    let url = "";

    url = `${BASE_URL}/search`;

    const opt = {
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      },
    };

    axios(opt)
      .then((res) => {
        if (res.status === 200) {
          setPost(res.data);
        }
      })
      .catch((err) => {
        message.error("Fetch lists failed!");
        console.log("fetch lists failed: ", err.message);
      });
  };

  return <div className="home"></div>;
}

export default Home;
