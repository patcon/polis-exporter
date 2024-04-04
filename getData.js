import fetch from "node-fetch"
import fs from 'node:fs'

const convoData = {
  conversations: null,
  conversationStats: null,
  pca2: null,
  comments: null,
}

const downloadFile = (async (url, path) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  return new Promise((resolve, reject) => {
      res.json().then(data => {
        fileStream.write(JSON.stringify(data, null, 2))
        resolve(data)
      })
      res.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
});

const CONVO_ID = "6bkf4ujff9"
const REPORT_ID = "r5mnkmeedi5nm8a4dw8ej"

const simpleUrls = {
  conversations:     `https://pol.is/api/v3/conversations?conversation_id=${CONVO_ID}`,
  conversationStats: `https://pol.is/api/v3/conversationStats?conversation_id=${CONVO_ID}&report_id=${REPORT_ID}`,
  pca2:              `https://pol.is/api/v3/math/pca2?conversation_id=${CONVO_ID}`,
  comments:          `https://pol.is/api/v3/comments?conversation_id=${CONVO_ID}&moderation=true&include_voting_patterns=true`,
}

downloadFile(simpleUrls.conversations,     `data/${CONVO_ID}--conversations.json`).then(data => console.log(data))
downloadFile(simpleUrls.conversationStats, `data/${CONVO_ID}--conversationStats.json`)
downloadFile(simpleUrls.pca2,              `data/${CONVO_ID}--math-pca2.json`)
downloadFile(simpleUrls.comments,          `data/${CONVO_ID}--comments.json`)
