import fetch from "node-fetch"
import fs from 'node:fs'
import https from 'https'
import pThrottle from 'p-throttle'

// Only allow 10 req/sec to avoid Cloudflare block.
const throttle = pThrottle({
  limit: 10,
  interval: 1000,
})

const downloadFile = async (url, path) => {
  try {
    const res = await throttle(() => fetch(url, {
      headers: {'user-agent': 'x'},
      // Ensure TLSv1.3, so Cloudflare doesn't block
      agent: new https.Agent({ minVersion: 'TLSv1.3' }),
    }))()
    console.log(`Fetching: ${url}`)
    const data = await res.json()
    await fs.promises.writeFile(path, JSON.stringify(data, null, 2))
    return data
  } catch (error) {
    console.error(`Error downloading file from ${url}:`, error)
    throw error
  }
}

const args = process.argv.slice(2)
const convoId = args[0]
const reportId = args[1]

const CONVO_ID = convoId || "6bkf4ujff9"
// NOTE: No need to specific the correct report ID. Any report ID bypasses need for moderator permissions.
const REPORT_ID = reportId || "r8d7jd2x2kvf5ay6dyk5e"

const simpleUrls = {
  conversations:     `https://pol.is/api/v3/conversations?conversation_id=${CONVO_ID}`,
  conversationStats: `https://pol.is/api/v3/conversationStats?conversation_id=${CONVO_ID}&report_id=${REPORT_ID}`,
  pca2:              `https://pol.is/api/v3/math/pca2?conversation_id=${CONVO_ID}`,
  comments:          `https://pol.is/api/v3/comments?conversation_id=${CONVO_ID}&moderation=true&include_voting_patterns=true`,
}

downloadFile(simpleUrls.conversations,     `data/${CONVO_ID}--conversations.json`)
downloadFile(simpleUrls.conversationStats, `data/${CONVO_ID}--conversationStats.json`)
downloadFile(simpleUrls.pca2,              `data/${CONVO_ID}--math-pca2.json`).then(data => {
  let allVotes = []
  const downloadVotesN = (n) => {
    return downloadFile(
      `https://pol.is/api/v3/votes?conversation_id=${CONVO_ID}&pid=${n}`,
      `data/${CONVO_ID}--votes--${String(n).padStart(3, '0')}.json`
    )
  }
  Promise.all(Array.from(Array(data.n).keys()).map(n => downloadVotesN(n))).then(responses => {
    // Flatten the array of all responses into one.
    const allVotes = responses.flat(1)
    fs.writeFile(`data/${CONVO_ID}--votes.json`, JSON.stringify(allVotes, null, 2), err => {
      if (err) {
        console.error(err);
      } else {
        // file written successfully
      }
    });
  })
})
downloadFile(simpleUrls.comments,          `data/${CONVO_ID}--comments.json`)

const ensureOutputsDirectory = async (convoId) => {
  try {
    await fs.promises.mkdir(`outputs/${convoId}`, { recursive: true })
  } catch (error) {
    console.error('Error creating convo directory:', error)
    throw error
  }
}

// Ensure the convo's outputs directory exists, for future processing.
ensureOutputsDirectory(CONVO_ID)
