# Polis Exporter

This is a messy work-in-progress set of scripts for generating a Polis zipped archive from public resources.

Docs: [Export format](https://compdemocracy.org/export/)

## Usage

```
npm install

CONVO_ID=xxxxxxxx
node getData.js $CONVO_ID     # Download json data on convo
node makeVotes.js $CONVO_ID   # Make votes.csv from downloaded files
node makeSummary.js $CONVO_ID # Make summary.csv (WIP)
```

## Roadmap

- [x] Write script to download all relevant files
- [x] Map all relevant CSV export data to data from public REST API
    - Ideally, this would not need supplying a password.
- Write script to generate...
    - [x] `votes.csv`
    - [ ] `summary.csv`
    - [ ] `comments.csv`
    - [ ] `participants-votes.csv`
    - [ ] `stats-history.csv`
- [ ] Encapsulate AI calls in a small rest client library
- [ ] Encapsulate processing steps in a library
- [ ] Write a simple webapp to allow viewing of CSV files
- [ ] Allow downloading all CSV's in zip format
- [ ] Allow including xid's when moderator email/pass is supplied
- [ ] Add an explanatory front page
