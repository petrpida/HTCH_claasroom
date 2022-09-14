import React from "react";
import Icon from "@mdi/react";
import Card from "react-bootstrap/Card";
import { mdiAccountSchoolOutline, mdiIdentifier } from "@mdi/js";
import { getColorByGrade } from "../helpers/common";

function Student (props) {
    return (
        <Card>
            <Card.Body>
                <div>
                    <Icon path={mdiAccountSchoolOutline} size={1} color="grey" />{" "}
                    {props.student.firstname} {props.student.surname}
                </div>
                <div>
                    <Icon path={mdiIdentifier} size={1} color="grey" />{" "}
                    {props.student.nationalId}
                </div>
                <div style={{ marginTop: "20px" }}>
                    {props.student.subjectList.map((subject) => {
                        let average = subject.averageGrade;
                        if (average) average = average.toFixed(1);
                        else average = "N";
                        return (
                            <div key={subject.id}>
                                {subject.name}:{" "}
                                <b style={{ color: getColorByGrade(average) }}>{average}</b>
                            </div>
                        );
                    })}
                </div>
            </Card.Body>
        </Card>
    )
}

export default Student;