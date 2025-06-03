const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

const datasetId = 'purchases_dataset';
const tableId = 'purchases';

exports.registerPurchase = async (req, res) => {
  try {
    const { userId, points } = req.body;
    if (!userId || !points) {
      res.status(400).send('missing userId or points');
      return;
    }
    const [datasets] = await bigquery.getDatasets();
    const datasetExists = datasets.some((ds) => ds.id === datasetId);

    if (!datasetExists) {
      await bigquery.createDataset(datasetId);
    }

    const dataset = bigquery.dataset(datasetId);

    const [tables] = await dataset.getTables();
    const tableExists = tables.some((t) => t.id === tableId);

    if (!tableExists) {
      await dataset.createTable(tableId, {
        schema: [
          { name: 'userId', type: 'INT64' },
          { name: 'points', type: 'INT64' },
          { name: 'timestamp', type: 'TIMESTAMP' },
        ],
      });
    }

    const rows = [
      {
        userId,
        points,
        timestamp: new Date().toISOString(),
      },
    ];

    await dataset.table(tableId).insert(rows);

    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};
