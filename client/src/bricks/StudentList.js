import React, {useMemo, useState} from "react";

import StudentTableList from "./StudentTableList";
import StudentGridList from "./StudentGridList";

import {Navbar} from "react-bootstrap";
import {Button} from "react-bootstrap";
import {Form} from "react-bootstrap";

import Icon from "@mdi/react";
import { mdiTable, mdiViewGridOutline, mdiMagnify } from "@mdi/js";

function StudentList (props) {
    const [viewType, setViewType] = useState("grid");
    const isGrid = viewType === "grid";
    const [searchBy, setSearchBy] = useState("")

    const filteredStudentList = useMemo(() => {
       return props.classroom.studentList.filter((item) => {
           return (
               item.firstname
                   .toLocaleLowerCase()
                   .includes(searchBy.toLocaleLowerCase()) ||
               item.surname
                   .toLocaleLowerCase()
                   .includes(searchBy.toLocaleLowerCase())
           )
       })
    }, [searchBy, props.classroom.studentList])

    function handleSearch (e) {
        e.preventDefault();
        setSearchBy(e.target["searchInput"].value);
    }

    function handleSearchDelete (e) {
        if (!e.target.value) setSearchBy ("")
    }

    return (
      <div>
        <Navbar bg="light">
            <div className="container-fluid">
                <Navbar.Brand>Seznam studentů</Navbar.Brand>
                <div>
                    <Form className="d-flex" onSubmit={handleSearch}>
                    <Form.Control id={"searchInput"} style={{maxWidth: "150px"}} type={"search"} placeholder="Search" aria-label="Search" onChange={handleSearchDelete}/>
                    <Button className="me-2" variant="outline-success" type="submit">
                        <Icon path={mdiMagnify} size={1}/>
                    </Button>
                    <Button variant="outline-primary" onClick={() => {
                    setViewType((currentState) => {
                        if (currentState === "grid") return "table";
                        else return "grid";
                        })
                    }}>
                    <Icon size={1} path={isGrid ? mdiTable : mdiViewGridOutline}/>{" "}
                    {isGrid ? "Tabulka" : "Grid"}
                    </Button>
                    </Form>
                </div>
            </div>
        </Navbar>
        {isGrid ? <StudentGridList studentList={filteredStudentList} /> : <StudentTableList studentList={filteredStudentList}/>}
      </div>
    )
}

export default StudentList;