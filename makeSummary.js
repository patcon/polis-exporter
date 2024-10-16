import fs from 'node:fs/promises'
import { formatCSVValue } from './lib/utils.js';

const args = process.argv.slice(2);
const convoId = args[0]
const CONVO_ID = convoId || "6bkf4ujff9"

const convo = JSON.parse(await fs.readFile(`data/${CONVO_ID}--conversations.json`, "utf-8"))
const pca2 = JSON.parse(await fs.readFile(`data/${CONVO_ID}--math-pca2.json`, "utf-8"))
const convoStats = JSON.parse(await fs.readFile(`data/${CONVO_ID}--conversationStats.json`, "utf-8"))

const summary = {
  topic: convo.topic,
  url: `https://pol.is/${CONVO_ID}`,
  views: convo.participant_count,
  voters: pca2["n"],
  "voters-in-conv": pca2["n"],
  commenters: convoStats.firstCommentTimes.length,
  comments: pca2["n-cmts"],
  groups: pca2["group-clusters"].length,
  "conversation-description": convo.description,
}

const csvRows = Object.entries(summary).map(([key, value]) => {
  const formattedValue = formatCSVValue(value)
  return `${key},${formattedValue}`
})
const csvContent = csvRows.join('\n') + '\n'

const filePath = `outputs/${CONVO_ID}/summary.csv`
try {
  await fs.writeFile(filePath, csvContent, 'utf-8')
  console.log(`Successfully wrote to: ${filePath}`)
} catch (error) {
  console.error(`Failed to write to: ${filePath}`, error)
}