import { check, sleep } from "k6";
import remote from "k6/x/remotewrite";

export let options = {
  iterations: 500
};

const client = new remote.Client({
  url: __ENV.K6_PROMETHEUS_RW_SERVER_URL || "http://prometheus:9090/api/v1/write",
});

// Example query:
// avg_over_time(cpu_usage[5m]) > 80

export default function () {
    sendMetricData("server1", Math.floor(Math.random() * 21) + 80); // 80-100
}

function sendMetricData(instanceValue, value) {
  const res = client.store([
    {
      labels: [
        { name: "__name__", value: `cpu_usage` },
        { name: "job", value: "exporter" },
        { name: "instance", value: instanceValue },
      ],
      samples: [{ value: value }],
    },
  ]);
  check(res, {
    "is status 204": (r) => r.status === 204,
  });
  sleep(0.001);
}
