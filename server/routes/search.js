var express = require("express");
const axios = require("axios");
var router = express.Router();

const taskTimestamps = {};

const backgroundJobs = {};
const processBackgroundJob = (task_id, count, id_list) => {
  backgroundJobs[task_id] = {
    task_id: task_id,
    status: "processing",
    created_time: new Date().toISOString(),
  };
  setTimeout(() => {
    const result = {
      pmids: id_list,
    };
    backgroundJobs[task_id].status = "completed";
    backgroundJobs[task_id].result = result;
    backgroundJobs[task_id].run_seconds =
      (new Date() - new Date(backgroundJobs[task_id].created_time)) / 1000;
  }, 5000);
};

router.get("/", async function (req, res, next) {
  const term = req.query.term;
  if (term) {
    try {
      const response = await axios.get(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&usehistory=y&retmode=json&retstart=0&retmax=10000&term=${term}`
      );
      const records = parseInt(response.data.esearchresult.count);
      const query = response.data.esearchresult.translationset[0].from;
      const task_id = response.data.esearchresult.webenv.replace("MCID_", "");
      const id_list = response.data.esearchresult.idlist;
      processBackgroundJob(task_id, records, id_list);
      const formattedJson = {
        records: records,
        query: query,
        task_id: task_id,
      };
      taskTimestamps[task_id] = Date.now();
      res.json(formattedJson);
    } catch (error) {
      console.error("Error fetching data from NCBI API:", error);
      res.status(500).json({ error: "Failed to fetch data from NCBI API" });
    }
  } else {
    res.status(400).send("Missing search term");
  }
});

router.get("/:task_id", (req, res) => {
  const task_id = req.params.task_id;
  const job = backgroundJobs[task_id];
  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ error: "Job not found" });
  }
});

module.exports = router;
