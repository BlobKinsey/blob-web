import { GoogleSpreadsheet } from 'google-spreadsheet';
import { GOOGLE_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SHEET_ID } from '$env/static/private';
import type { Question, QuestionPool } from '$lib/models/Question';


export async function getGSheetData() {
  const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
  await doc.useServiceAccountAuth({
    client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  });
  await doc.loadInfo();
  let count = doc.sheetCount;
  // console.log("count", count);

  const sheets:any[] = []
  for (let i = 0; i < count; i++) {
    const sheet = doc.sheetsByIndex[i];
    sheets.push(sheet);
  }

  const poolsArray = await Promise.all(sheets.map(async (sheet:any) => {
    return await getSheetData(sheet);
  }));

  return {
    title: doc.title as string,
    poolsArray ,
  }
}


export async function getSheetData(sheet:any) {

  const poolId:string = sheet.title;
  sheet.loadHeaderRow()
  const rows:any[] = await sheet.getRows(); // can pass in { limit, offset }

  const questions:any[] = [];
  for(let i = 0; i+3 < (rows.length); i+=4) {
    const row = rows[i];

    let situation = row._rawData[0];
    let interviewer = row._rawData[1];
    let question = row._rawData[2];
    let rounds= {
      0: [] as string[],
      1: [] as string[],
      2: [] as string[],
      3: [] as string[],
    }
    for(let r= 0; r<4; r++){
      for(let j = 0; j < 4; j++) {
        const row = rows[i+j];
        rounds[r.toString()].push(row._rawData[r+3]);
      }
    }
    questions.push({
      situation,
      interviewer,
      question,
      rounds,
      index: i/4,

    })
  }

  return {
    poolId,
    questions,
  }
}


function toQuestion(row:Record<string, string>, index:number, poolId:string): Question {
  const { id, statement, response, goodAnswer} = row;
  const proposals = [];
  for(let i = 1; i < 12; i++) {
    const key = `proposal.${i}`;
    if (row[key] !== "" && row[key] !== undefined) {
      proposals.push(
        {
          id: key,
          text: row[key],
        }
      );
    }
  }
  return {
    // id,
    poolId,
    statement,
    index,
    proposals,
    // response,
    goodAnswer,
  }
}