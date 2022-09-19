import {useState} from "react";
import Icon from "@mdi/react";
import {mdiTrashCanOutline} from "@mdi/js";
import Confirmation from "./Confirmation";


function StudentGradeDelete({grade, onDelete, onError}) {
    const [deleteGradeCall, setDeleteGradeCall] = useState({
        state: 'inactive'
    })

    const handleDelete = async () => {
        if (deleteGradeCall.state = "pending")
            return

        setDeleteGradeCall({state: "pending"})

        const res = await fetch(`http://localhost:3000/grade/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: grade.id})
        });

        const data = await res.json();

        if (res.status >= 400) {
            setDeleteGradeCall({state: 'error', error: data});

            if (typeof onError === 'function')
                onError(data.errorMessage);

        } else {
            setDeleteGradeCall({state: 'success', data});

            if (typeof onDelete === 'function') {
                onDelete(grade.id);
            }
        }
    }

    return (
        <Confirmation
            title="Smazat známku"
            message="Opravdu si přejete smazat známku?"
            confirmText="Smazat"
            onConfirm={handleDelete}
        >
            <Icon
                path={mdiTrashCanOutline}
                style={{cursor: 'pointer', color: 'red'}}
                size={0.8}
            ></Icon>
        </Confirmation>
    )
}

export default StudentGradeDelete