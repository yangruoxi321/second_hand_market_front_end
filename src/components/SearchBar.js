import React from "react";
import { Input } from "antd";
import axios from "axios";

import { BASE_URL } from "../constants";

const { Search } = Input;

function SearchBar(props) {
    const handleSearch = (value) => {
        props.onSearch(value);
        axios.post(`${BASE_URL}/search`, {
            search: value
        },
            {
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                // Handle response
                console.log(res.data);
                // You might want to do something with the response data, like updating the state in the parent component
            })
            .catch(error => {
                console.error("Search error:", error);
                // Handle error
            });
    };

    return (
        <div className="search-bar">
            <Search
                placeholder="input search text"
                enterButton="Search"
                size="large"
                onSearch={handleSearch}
            />
            {/* Removed the Radio.Group and associated logic */}
        </div>
    );
}

export default SearchBar;
