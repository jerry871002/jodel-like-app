# DAB Project 3 Report

To run the application, please refer to `README.md`.

## Core Web Vitals and Performance Test Results

### Lighthouse Performance Score

| Page | Score | Largest Contentful Paint | First Contentful Paint | Cumulative Layout Shift |
|----------------|---------------------:|-------:|----------------:|----------------:|
| Main Page | 100 | 0.3s | 0.3s | 0 |
| Replies Page | 100 | 0.4s | 0.4s | 0.004 |

### Performance Test Results

To run the `k6` performance tests, please also refer to `README.md`.

| Endpoint | Avg requests per sec | Median | 95th percentile | 99th percentile |
|----------------|---------------------:|-------:|----------------:|----------------:|
| Main Page | 112.441923 | 201.26ms | 593.93ms | 883.81ms |
| Post Message | 567.43864 | 89.49ms | 119.83ms | 165.87ms |

## Reflection

The Lighthouse performance of the system is quite good since there are no fancy styles or complex UI components at the moment. Regarding the k6 performance tests, I did the "post message" test before the "main page" test. Since the "post message" test sent more than 30,000 new messages to the api service and the "main page" requires fetching the latest 20 messages from the database. A large amount of messages in the database seems to slow down the query and consequently reduce the performance of the "main page". This might be a point to improve in the future.

## Suggestions

The code `const messagesFetch = await fetch('http://api-app-service:7777/message');` in `index.astro` exposes the internal configuration of the services, which shouldn't be seen by the user. However, I haven't find a way to access the ingress internally to avoid this problem. Also, as mentioned in the previous section, maybe I could cache the database query result to speed up the rendering of the main page. 
