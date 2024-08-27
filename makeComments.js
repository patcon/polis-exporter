import fs from 'node:fs/promises'
import { formatCustomDate, formatCSVValue } from './lib/utils.js';

// Read the JSON file
const args = process.argv.slice(2);
const convoId = args[0]
const CONVO_ID = convoId || "6bkf4ujff9"

const comments = JSON.parse(await fs.readFile(`data/${CONVO_ID}--comments.json`, "binary"))

// Sort comments by comment-id (tid), descending order.
comments.sort((a, b) => b.tid - a.tid)

// CSV header
const csvHeader = 'timestamp,datetime,comment-id,author-id,agrees,disagrees,moderated,comment-body'
console.log(csvHeader)

// Map JSON data to CSV format
comments.forEach(comment => {
  const timestamp = comment.created
  const datetime = formatCustomDate(comment.created)
  const commentId = comment.tid
  const authorId = comment.pid
  const agrees = comment.agree_count
  const disagrees = comment.disagree_count
  const moderated = comment.mod
  const commentBody = formatCSVValue(comment.txt)

  const csvRow = `${timestamp},${datetime},${commentId},${authorId},${agrees},${disagrees},${moderated},${commentBody}`
  console.log(csvRow)
})