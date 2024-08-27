import fs from 'node:fs/promises'

const args = process.argv.slice(2);
const convoId = args[0]
const CONVO_ID = convoId || "6bkf4ujff9"

const range = (n) => Array.from({ length: n }, (_, i) => i)
const filterVotesByPid = (votes, pid) => votes.filter(vote => vote.pid === pid)
const filterCommentsByPid = (comments, pid) => comments.filter(comment => comment.pid === pid)
const getGroupIdByPid = (groupClusters, pid) => {
  for (const group of groupClusters) {
    if (group.members.includes(pid)) {
      return group.id
    }
  }
  return null
}
const getVoteByParticipantAndStatementIds = (votes, pid, tid) => {
  const participantVotes = filterVotesByPid(votes, pid)
  const statementVote = participantVotes.find(vote => vote.tid === tid)
  if (statementVote) return statementVote.vote
  return null
}

const votes = JSON.parse(await fs.readFile(`data/${CONVO_ID}--votes.json`, "utf-8"))
const comments = JSON.parse(await fs.readFile(`data/${CONVO_ID}--comments.json`, "utf-8"))
const pca2 = JSON.parse(await fs.readFile(`data/${CONVO_ID}--math-pca2.json`, "utf-8"))

const commentCount = pca2['n-cmts']
const participantCount = pca2['n']

const csvHeaderOrder = [
  ...[
    'participant',
    'group-id',
    'n-comments',
    'n-votes',
    'n-agree',
    'n-disagree',
  ],
  ...range(commentCount)
]

let csvRows = [csvHeaderOrder.join(',')]
range(participantCount).forEach((pid) => {
  const participantVotes = filterVotesByPid(votes, pid)
  const participantVotesAggData = {
    'participant': pid,
    'group-id': getGroupIdByPid(pca2['group-clusters'], pid),
    'n-comments': filterCommentsByPid(comments, pid).length,
    'n-votes': participantVotes.length,
    'n-agree': participantVotes.filter(vote => vote.vote === 1).length,
    'n-disagree': participantVotes.filter(vote => vote.vote === -1).length,
  }
  // Incrementing number in header for each statement tid.
  const participantVotesStatements = Object.fromEntries(
    range(commentCount)
      .map(tid => [tid, getVoteByParticipantAndStatementIds(votes, pid, tid)])
  )
  const mergedRow = Object.assign({}, participantVotesAggData, participantVotesStatements)
  const rowString = csvHeaderOrder.map(header => mergedRow[header]).join(',')
  csvRows.push(rowString)
})

const csvContent = csvRows.join('\n') + '\n'
const filePath = `outputs/${CONVO_ID}/participants-votes.csv`
try {
  await fs.writeFile(filePath, csvContent, 'utf-8')
  console.log(`Successfully wrote to: ${filePath}`)
} catch (error) {
  console.error(`Failed to write to: ${filePath}`, error)
}