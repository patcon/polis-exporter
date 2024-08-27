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

// Manually build custom Polis export date format.
// Example: Wed Jul 27 21:56:00 WIB 2022
function formatCustomDate(timestamp) {
  const date = new Date(Number(timestamp))

  // Convert to the target timezone and format (Asia/Jakarta)
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
    timeZone: "Asia/Jakarta",
  }
  const formatter = new Intl.DateTimeFormat('en-CA', options)
  const parts = formatter.formatToParts(date)

  const dayName = parts.find(part => part.type === 'weekday').value
  const monthName = parts.find(part => part.type === 'month').value
  const day = parts.find(part => part.type === 'day').value.padStart(2, '0')
  const year = parts.find(part => part.type === 'year').value

  const hours = parts.find(part => part.type === 'hour').value.padStart(2, '0')
  const minutes = parts.find(part => part.type === 'minute').value.padStart(2, '0')
  const seconds = parts.find(part => part.type === 'second').value.padStart(2, '0')

  const timeZone = parts.find(part => part.type === 'timeZoneName').value

  return `${dayName} ${monthName} ${day} ${hours}:${minutes}:${seconds} ${timeZone} ${year}`
}

const refinedData = []
refinedData.push(["timestamp", "datetime", "comment-id", "voter-id", "vote"])
sorted.forEach(item => {
  refinedData.push([
    item.modified,
    formatCustomDate(item.modified),
    item.tid,
    item.pid,
    // Invert API response for some reason. Why?
    -item.vote,
  ])
})

let csvContent = ''
refinedData.forEach(row => {
  csvContent += row.join(',') + '\n'
})

fs.writeFile(`outputs/${CONVO_ID}--votes.csv`, csvContent, err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
})
console.log(`Writing: outputs/${CONVO_ID}--votes.csv`)
