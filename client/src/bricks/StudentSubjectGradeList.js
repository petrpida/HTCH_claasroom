import Icon from "@mdi/react";
import {Alert, Button, Modal, Table} from 'react-bootstrap';
import {
    mdiCalendar,
    mdiClipboardListOutline,
    mdiClose,
    mdiLoading, mdiPencilOutline,
    mdiPlus, mdiReload,
    mdiStar,
    mdiText,
    mdiWeight
} from "@mdi/js";
import {useContext, useEffect, useMemo, useState} from 'react'
import {getColorByGrade} from "../helpers/common";
import StudentGradeForm from "./StudentGradeForm";
import StudentGradeDelete from "./StudentGradeDelete"
import UserContext from "../UserProvider";

function StudentSubjectGradeList({student, subject, classroom, disabled}) {
    const {canEdit} = useContext(UserContext)
    const [isModalShown, setShow] = useState(false);
    const [studentSubjectGradeListCall, setStudentSubjectGradeListCall] =
        useState({
            state: "pending",
        });
    const [addGradeShow, setAddGradeShow] = useState({
        state: false
    });
    const [deleteGradeError, setDeleteGradeError] = useState('');
    const handleGradeDeleted = (gradeId) => {
        if (studentSubjectGradeListCall.state === "success") {
            setStudentSubjectGradeListCall({
                state: "success",
                data: studentSubjectGradeListCall.data.filter((g) => g.id !== gradeId)
            });
        }
    }

    const handleAddGradeShow = (data) => setAddGradeShow({state: true, data});
    const handleShowModal = () => {
        if (!disabled)
            setShow(true)
    };
    const handleCloseModal = () => setShow(false);

    const handleGradeAdded = (grade) => {
        if (studentSubjectGradeListCall.state === "success") {
            let gradeList = [...studentSubjectGradeListCall.data]

            if (grade.id) {
                gradeList = gradeList.filter((g) => g.id === grade.id);
            }

            setStudentSubjectGradeListCall({
                state: "success",
                data: [...gradeList, grade]
            });
        }
    }

    const average = useMemo(() => {
        if (studentSubjectGradeListCall.state === "success") {
            if (studentSubjectGradeListCall.data.length) {
                let gradeSum = 0;
                let weightSum = 0;
                studentSubjectGradeListCall.data.forEach((grade) => {
                    gradeSum += grade.grade * grade.weight;
                    weightSum += grade.weight;
                });

                if (gradeSum) return gradeSum / weightSum;
                else return "N";
            } else {
                return "N";
            }
        } else {
            return "N";
        }
    }, [studentSubjectGradeListCall.state, studentSubjectGradeListCall.data]);

    const fetchData = async () => {
        setStudentSubjectGradeListCall({state: "pending"});

        const res = await fetch(`http://localhost:3000/grade/list?subjectId=${subject.id}&studentId=${student.id}`);
        const data = await res.json();

        if (res.status >= 400) {
            setStudentSubjectGradeListCall({state: "error", error: data});
        } else {
            setStudentSubjectGradeListCall({state: "success", data});
        }
    };

    useEffect(() => {
        if (isModalShown) fetchData();
    }, [isModalShown, student, subject]);

    return <>
        <Modal show={isModalShown} onHide={handleCloseModal} className={"hidden"}>
            <Modal.Header closeButton>
                <Modal.Title>Přehled známek</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {deleteGradeError &&
                    <Alert variant="danger">
                        Error: { deleteGradeError }
                    </Alert>
                }
                <div>
                    <div>
                        <span className="text-muted">Žák: </span>
                        <b>{student.firstname + " " + student.surname}</b>
                    </div>
                    <div>
                        <span className="text-muted">Předmět: </span>
                        <b>{subject.name}</b>
                    </div>
                    <div>
                        <span className="text-muted">Průměr: </span>
                        <b style={{color: getColorByGrade(average)}}>{typeof average === 'number' ? average.toFixed(1) : average}</b>
                    </div>
                </div>
                {studentSubjectGradeListCall.state === "pending" && (
                    <div className="d-flex flex-column justify-content-center align-items-center mt-5 mb-5">
                        <Icon size={2} path={mdiLoading} spin={true}/>
                    </div>
                )}

                {studentSubjectGradeListCall.state === "success" && (
                    <div style={{maxHeight: "55vh", overflow: "auto"}}>
                        <Table className="mt-3" striped>
                            <thead>
                            <tr>
                                <th style={{width: "40px", color: "grey"}}>
                                    <Icon size={1} path={mdiStar}/>
                                </th>
                                <th style={{width: "40px", color: "grey"}}>
                                    <Icon size={1} path={mdiWeight}/>
                                </th>
                                <th style={{color: "grey"}}>
                                    <Icon size={1} path={mdiText}/>
                                </th>
                                <th style={{width: "120px", color: "grey"}}>
                                    <Icon size={1} path={mdiCalendar}/>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {studentSubjectGradeListCall.data.map((grade) => {
                                return (
                                    <tr key={grade.id}>

                                        <td
                                            style={{
                                                color: getColorByGrade(grade.grade),
                                                textAlign: "center",
                                            }}
                                        >
                                            <b>{grade.grade}</b>
                                        </td>
                                        <td
                                            style={{
                                                textAlign: "center",
                                            }}
                                        >
                                            {grade.weight}
                                        </td>
                                        <td>{grade.description}</td>
                                        <td
                                            style={{
                                                textAlign: "center",
                                            }}
                                        >
                                            {new Date(grade.dateTs).toLocaleDateString()}
                                        </td>
                                        {canEdit() &&
                                            <>
                                                <td>
                                                    <Icon
                                                        size={0.8}
                                                        path={mdiPencilOutline}
                                                        style={{color: 'orange', cursor: 'pointer'}}
                                                        onClick={() => handleAddGradeShow(grade)}
                                                    />
                                                </td>
                                                <td>
                                                    <StudentGradeDelete
                                                        grade={grade}
                                                        onDelete={(id) => handleGradeDeleted(id)}
                                                        onError={(error) => setDeleteGradeError(error)}>
                                                    </StudentGradeDelete>
                                                </td>
                                            </>
                                        }
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>
                    </div>
                )}

                {studentSubjectGradeListCall.state === "error" && (
                    <div className="d-flex flex-column justify-content-center align-items-center mt-5 mb-5">
                        <div>
                            Nepodařilo se načíst data o známkách studenta{" "}
                            <b>{student.firstname + " " + student.surname}</b> z předmětu{" "}
                            <b>{subject.name}</b>.
                        </div>
                        <br/>
                        <pre>
                            {JSON.stringify(studentSubjectGradeListCall.error, null, 2)}
                        </pre>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex flex-row gap-2">
                    <Button
                        variant="light"
                        className="text-muted"
                        onClick={handleCloseModal}
                    >
                        <div className="d-flex flex-row gap-1 align-items-center">
                            <Icon path={mdiClose} size={1}></Icon>
                            <span>Zavřít</span>
                        </div>
                    </Button>
                    <Button
                        variant="light"
                        className="text-muted"
                        onClick={fetchData}
                    >
                        <Icon size={1} path={mdiReload}></Icon>
                    </Button>
                    {canEdit() &&
                        <Button
                            variant="success"
                            onClick={() => handleAddGradeShow()}
                        >
                            <div className="d-flex flex-row gap-1 align-items-center">
                                <Icon path={mdiPlus} size={1}></Icon>
                                <span>Přidat známku</span>
                            </div>
                        </Button>
                    }

                </div>
            </Modal.Footer>
        </Modal>
        <StudentGradeForm
            student={student}
            subject={subject}
            classroom={classroom}
            show={addGradeShow.state}
            setAddGradeShow={setAddGradeShow}
            onComplete={(grade) => handleGradeAdded(grade)}
            grade={addGradeShow.data}
        />
        <Icon
            path={mdiClipboardListOutline}
            style={{
                color: disabled ? 'lightgray' : "grey",
                cursor: disabled ? "default" : "pointer"
            }}
            size={1}
            onClick={handleShowModal}
        />
    </>
}

export default StudentSubjectGradeList