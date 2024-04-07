// - create dir: data/:convoId/
// - fetch /api/v3/conversationStats.json
// - fetch /api/v3/conversations.json
// - fetch /api/v3/math/pca2.json
// - write summary.csv
// - write votes.csv

import fs from 'node:fs/promises'

const args = process.argv.slice(2);
const convoId = args[0]
const CONVO_ID = convoId || "6bkf4ujff9"

const json = await fs.readFile(`data/${CONVO_ID}--votes.json`, "binary");
const unsorted = JSON.parse(json)
const sortByCommentIdAsc = (a, b) => {
  return a.tid - b.tid || a.pid - b.pid
}
const sorted = unsorted.sort(sortByCommentIdAsc)
console.log(sorted)

const refinedData = []
refinedData.push(["timestamp", "datetime", "comment-id", "voter-id", "vote"])
sorted.forEach(item => {
  refinedData.push([
    item.modified,
    // TODO: Manually build custom Polis export date format.
    // Example: Wed Jul 27 21:56:00 WIB 2022
    new Date(Number(item.modified)).toLocaleString("en-CA", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      hourCycle: "h23",
      timeZoneName: "short",
      timeZone: "Asia/Jakarta",
    }).replaceAll(",", ""),
    item.tid,
    item.pid,
    item.vote,
  ])
})

let csvContent = ''
refinedData.forEach(row => {
  csvContent += row.join(',') + '\n'
})

fs.writeFile(`data/${CONVO_ID}--votes.csv`, csvContent, err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
})
