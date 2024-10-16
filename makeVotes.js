// - create dir: data/:convoId/
// - fetch /api/v3/conversationStats.json
// - fetch /api/v3/conversations.json
// - fetch /api/v3/math/pca2.json
// - write summary.csv
// - write votes.csv

import fs from 'node:fs/promises'
import { formatCustomDate } from './lib/utils.js';

const args = process.argv.slice(2);
const convoId = args[0]
const CONVO_ID = convoId || "6bkf4ujff9"

const json = await fs.readFile(`data/${CONVO_ID}--votes.json`, "utf-8");
const unsorted = JSON.parse(json)
const sortByCommentIdAsc = (a, b) => {
  return a.tid - b.tid || a.pid - b.pid
}
const sorted = unsorted.sort(sortByCommentIdAsc)

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

const filePath = `outputs/${CONVO_ID}/votes.csv`
try {
  await fs.writeFile(filePath, csvContent, 'utf-8')
  console.log(`Successfully wrote to: ${filePath}`)
} catch (error) {
  console.error(`Failed to write to: ${filePath}`, error)
}
