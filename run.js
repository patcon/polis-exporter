// /:convoId.zip

// /:convoId/comments.csv
// - timestamp (int) comments[].created
// - datetime (str) comments[].created
// - comment-id (int) comments[].tid
// - author-id (int) comments[].pid
// - agrees (int) comments[].agree_count
// - disagrees (int) comments[].disagree_count
// - moderated (enum: -1,0,1) comments[].mod
// - comment-body (str) comments[].txt
//
// /:convoId/participants-votes.csv
// - participant (pid int) XID-participationInit.ptpt.pid
// - xid (str, nullable) XID
// - group-id (int, nullable) group-clusters[members contains pid]
// - n-comments (int) comments[pid] | length
// - n-votes (int) votes[] | length
// - n-agree (int) votes[vote=1] | length
// - n-disagree (int) votes[vote=-1] | length
// - 0 (enum: -1,0,1) votes[tid=0].vote
// - 1 (enum: -1,0,1) votes[tid=1].vote
// - 2 (enum: -1,0,1) votes[tid=2].vote
// - ...
//
// /:convoId/stats-history.csv (incrementing)
// - n-votes (int)
// - n-comments (int)
// - n-visitors (int)
// - n-voters (int)
// - n-commenters (int)
//
// /:convoId/summary.csv
// - url (str) conversations.topic
// - views (int) conversations.participant_count
// - voters (int) pca2.n (or conversationStats.firstVoteTimes | length)
// - voters-in-conv (int) pca2.n (or conversationStats.firstVoteTimes | length)
// - commenters (int) conversationStats.firstCommentTimes | length
// - comments (int) pca2.n-cmts (or conversationStats.commentTimes | length)
// - groups (int) pca2.group-clusters | length
// - conversation-description (str) conversations.description
//
// /:convoId/votes.csv (votesAgg = aggregated votes endpoint)
// - timestamp (unix) votesAgg.modified
// - datetime (str) votesAgg.modified
// - comment-id (int) votesAgg.tid
// - voter-id (pid, int) votesAgg.pid
// - vote (enum: -1,0,1) votesAgg.vote
