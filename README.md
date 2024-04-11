# Polis Exporter

This is a messy work-in-progress set of scripts for generating a Polis zipped archive from public resources.

## Usage

```
npm install

CONVO_ID=xxxxxxxx
node getData.js $CONVO_ID     # Download json data on convo
node makeVotes.js $CONVO_ID   # Make votes.csv from downloaded files
node makeSummary.js $CONVO_ID # Make summary.csv (WIP)
```
