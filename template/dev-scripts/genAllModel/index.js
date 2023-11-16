const fs = require("fs");
const path = require("path");

const tableInfo = {};

const sqlFilePath = path.join(__dirname, "./data.sql");
const templatePath = path.join(__dirname, "./template.txt");
const modelDir = path.join(__dirname, "../../app/model/feedpig");

const sqlStr = fs.readFileSync(sqlFilePath, { encoding: "utf8" });
const templateStr = fs.readFileSync(templatePath, { encoding: "utf8" });

let getCreateTableReg = /CREATE TABLE \`\w+\` (\([\s\S]+?\))+? ENGINE/g;

let createTableSqls = sqlStr.match(getCreateTableReg);

createTableSqls.map((sql) => {
    const getTableNameReg = /CREATE TABLE \`(\w+)\` (\(([\s\S]+?)\))+? ENGINE/g;
    let res = getTableNameReg.exec(sql);
    let arr = res[3]
        .trim()
        .split(",\n")
        .map((item) => item.trim())
        .filter((item) => {
            let excludeKeyArr = [
                "`id`",
                "`created_at`",
                "`updated_at`",
                "`deleted_at`",
            ];
            for (let i = 0; i < excludeKeyArr.length; i++) {
                let excludeKey = excludeKeyArr[i];
                if (item.includes(excludeKey)) {
                    return false;
                } else if (!/^`/.test(item)) {
                    return false;
                }
            }
            return true;
        })
        .map((item) => {
            const typeMap = {
                int: "number",
                varchar: "string",
                datetime: "string",
                bigint: "number",
                tinyint: "number",
                text: "string",
                enum: "string",
                json:'string'
            };
            let returnObj = {};
            let newArr = item.split(" ");
            let field = newArr[0].replace(/`/g, "");
            if (field.indexOf("_") > -1) {
                returnObj.originField = field;
                field = field
                    .replace(/(_[a-z])/g, (match) => {
                        return `${match.toUpperCase()}`;
                    })
                    .replace(/_/g, "");
                returnObj.isNeedAlias = true;
            }
            returnObj.field = field;
            let type = typeMap[newArr[1].replace(/\(.+\)/, "")];
            if (!type) {
                throw new Error("not map this type:" + type);
            }
            returnObj.type = type;
            return returnObj;
        });
    tableInfo[res[1]] = {
        arr,
    };
});
for (let tableName in tableInfo) {
    let tableData = tableInfo[tableName].arr;
    let content = "";
    tableData.map((item) => {
        if (item.isNeedAlias) {
            content += `\n    @Column({field:'${item.originField}'})\n    ${item.field}: ${item.type};\n`;
        } else {
            content += `\n    @Column\n    ${item.field}: ${item.type};\n`;
        }
    });
    let name = tableName
        .replace(/(_[a-z])/g, (match) => {
            return `${match.toUpperCase()}`;
        })
        .replace(/^\w/, (match) => match.toUpperCase())
        .replace(/_/g, "");
    let finalStr = templateStr
        .replace("placeholder-content", content)
        .replace("placeholder-tableName", tableName)
        .replace(/placeholder-name/g, name);
    fs.writeFileSync(path.join(modelDir, `${name}.ts`), finalStr);
}
