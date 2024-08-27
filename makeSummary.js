import fs from 'node:fs/promises'

const args = process.argv.slice(2);
const convoId = args[0]
const CONVO_ID = convoId || "6bkf4ujff9"

const convo = JSON.parse(await fs.readFile(`data/${CONVO_ID}--conversations.json`, "binary"))
const pca2 = JSON.parse(await fs.readFile(`data/${CONVO_ID}--math-pca2.json`, "binary"))
const convoStats = JSON.parse(await fs.readFile(`data/${CONVO_ID}--conversationStats.json`, "binary"))

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
  const formattedValue = typeof value === 'string' && value.includes(',') ? `"${value}"` : value
  return `${key},${formattedValue}`
}).join('\n') + '\n'

await fs.writeFile(`outputs/${CONVO_ID}/summary.csv`, csvRows, 'utf8')
