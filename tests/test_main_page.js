import http from 'k6/http';

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
  http.get('http://dab-project.io/');
}
