import http from 'k6/http';
import { sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  vus: 30,
  duration: '30s',
  summaryTrendStats: [
    "avg",
    "min",
    "med",
    "max",
    "p(95)",
    "p(99)",
    "p(99.9)",
    "count",
  ]
};

export default function () {
  const userid = uuidv4();

  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let content = '';
  for (let i = 0; i < 5; i++) {
    content += possible[Math.floor(Math.random() * possible.length)];
  }

  const data = {
    userid: userid,
    content: content,
    top_level: true,
  };

  http.post('http://dab-project.io/api/message', JSON.stringify(data));
}
