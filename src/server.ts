import cluster from 'cluster';
import { cpus } from 'os';
import { createServer, request } from 'http';
import * as dotenv from 'dotenv';
import { pipeline } from 'stream';
import { HttpMethodEnum } from './types/types';
import { findRoute } from './utility/utilities';

dotenv.config();

const PORT = process.env.PORT || 3000;
const amountOfCPU = cpus().length;

// console.log('Cluster', cluster)

if (cluster?.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 1; i < amountOfCPU; i++) {
    const workerPort = Number(PORT) + i;
    const env = { WORKER_PORT: workerPort.toString() };
    const worker = cluster.fork(env);
    const workerProcess = worker.process as unknown as NodeJS.Process;
    workerProcess.env = env;
  }

  let workerIndex = 0;

  const server = createServer((req, res) => {
    if (!cluster.workers) {
      return;
    }

    const workerPORTs = Object.values(cluster.workers || {}).map((worker) => {
      if (!(worker?.process as unknown as NodeJS.Process)?.env) {
        console.error(`Worker ${worker?.process.pid} has no env`);
      }
      return (worker?.process as unknown as NodeJS.Process).env?.WORKER_PORT;
    });

    console.log('ports', workerPORTs);

    const targetPort = workerPORTs[workerIndex];
    workerIndex = (workerIndex + 1) % workerPORTs.length;

    const proxyOptions = {
      hostname: 'localhost',
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = request(proxyOptions, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      pipeline(proxyRes, res, (err) => {
        if (err) {
          console.error('Error during response stream:', err);
          res.writeHead(500);
          res.end(`Error forwarding response: ${err.message}`);
        }
      });
    });

    pipeline(req, proxyReq, (err) => {
      if (err) {
        console.error('Error during request stream:', err);
        res.writeHead(500);
        res.end(`Error forwarding request: ${err.message}`);
      }
    });

    proxyReq.on('error', (err) => {
      res.writeHead(500);
      res.end(`Error forwarding request: ${err.message}`);
    });
  });

  server.listen(PORT, () => {
    console.log(`Load balancer listening on http://localhost:${PORT}/api`);
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // In this case it is an HTTP server
  console.log('here');
  const workerPort = process.env.WORKER_PORT;
  console.log(workerPort);

  if (!workerPort) {
    console.error('WORKER_PORT environment variable is not set.');
    process.exit(1);
  }

  const workerServer = createServer((req, res) => {
    console.log('server');
    if (!req.url) {
      res.writeHead(400);
      res.end('Bad Request: URL is missing');
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method as HttpMethodEnum;
    const path = url.pathname || '';

    console.log('Method:', method, 'Path:', path);

    findRoute(method, path, req, res);
  });

  workerServer.listen(workerPort, () => {
    console.log(`Worker ${process.pid} listening on http://localhost:${workerPort}/api`);
  });

  workerServer.on('error', (err) => {
    console.error('Server error:', err);
  });
}
