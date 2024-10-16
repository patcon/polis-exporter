import fs from 'node:fs/promises'
import { formatCustomDate, formatCSVValue } from './lib/utils.js';

// Read the JSON file
const args = process.argv.slice(2);
const convoId = args[0]
const CONVO_ID = convoId || "6bkf4ujff9"

const comments = JSON.parse(await fs.readFile(`data/${CONVO_ID}--comments.json`, "utf-8"))

// Sort comments by comment-id (tid), descending order.
comments.sort((a, b) => b.tid - a.tid)

// CSV header
const csvHeader = 'timestamp,datetime,comment-id,author-id,agrees,disagrees,moderated,comment-body'
const csvRows = [csvHeader]

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
  csvRows.push(csvRow)
})

const csvContent = csvRows.join('\n') + '\n'
const filePath = `outputs/${CONVO_ID}/comments.csv`
try {
  await fs.writeFile(filePath, csvContent, 'utf-8')
  console.log(`Successfully wrote to: ${filePath}`)
} catch (error) {
  console.error(`Failed to write to: ${filePath}`, error)
}