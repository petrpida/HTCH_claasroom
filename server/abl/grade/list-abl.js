const path = require("path");
const Ajv = require("ajv").default;
const GradeDao = require("../../dao/grade-dao");
let dao = new GradeDao(
  path.join(__dirname, "..", "..", "storage", "grades.json")
);

let schema = {
  type: "object",
  properties: {},
  required: [],
};

async function ListAbl(req, res) {
  try {
    const grades = await dao.listGrades();
    res.json(grades);
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = ListAbl;
