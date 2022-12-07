# DAB Project 3

## Get Started

### `docker-compose` setup

The prerequisite of this setup is only **Docker** (https://docs.docker.com/get-docker/).

Run `docker-compose up --build` to build and start the services.

After the starting process, you can visit the main page http://127.0.0.1:7800/. However, sometimes at the first start `ui` service will throw error since `api` service isn't ready yet, if this happens, just restart the application using `docker-compose restart`.

### `minikube` setup

The prerequisites of this setup are
- Docker (https://docs.docker.com/get-docker/)
- minikube (https://minikube.sigs.k8s.io/docs/start/)

The setup steps are as follow, please make sure you are at the root folder of the project.
1. Start `minikube`.
   ```
   minikube start
   ```
2. (Optional) Open dashboard to monitor everything is going right. If you do this step, this command will occupy a terminal. Open a new terminal for the following steps! Also remember to `cd` to the project's root folder.
   ```
   minikube dashboard
   ```
3. (Optional) Enable `metrics-server` which would be useful for checking auto-scaling.
   ```
   minikube addons enable metrics-server
   ```
4. Build the images.
   ```
   minikube image build -t ui-app ui/
   minikube image build -t api-app api/
   minikube image build -t flyway-migrations flyway/
   ```
5. Install the CloudNativePG operator. After entering this command, please wait about 5 seconds for the installation to complete.
   ```
   kubectl apply -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.18/releases/cnpg-1.18.0.yaml
   ```
6. Create the database cluster. Use `kubectl get pod` or the dashboard to make sure the database cluster is started successfully. (There should be `database-cluster-1` and `database-cluster-2` two pods.)
   ```
   kubectl apply -f kubernetes/database-cluster.yaml
   ```
7. Start the migration job. Use `kubectl get job` of the dashboard to ensure the job is completed.
   ```
   kubectl apply -f kubernetes/database-migration-job.yaml
   ```
8. Create the `api` and `ui` deployments, services, and auto-scalers.
   ```
   kubectl apply -f kubernetes/api-deployment.yaml,kubernetes/api-autoscale.yaml
   kubectl apply -f kubernetes/ui-deployment.yaml,kubernetes/ui-autoscale.yaml
   ```
9. Enable ingress in `minikube`.
   ```
   minikube addons enable ingress
   ```
10. Start nginx ingress.
    ```
    kubectl apply -f kubernetes/nginx-ingress.yaml
    ```
11. Expose the services and ingress. You need to enter root password for this step. This command will occupy a terminal, open another one for the following steps.
    ```
    minikube tunnel
    ```
12. (Uncertain) If you are using a mac, you need to append `127.0.0.1 dab-project.io` to `/etc/hosts` file, which reqires root access to write. If you are using other operating systems, maybe you can directly start using the application by visiting http://dab-project.io/.
13. Visit http://dab-project.io/ to start using the application!

## `k6` Performance Test

The performance tests are constructed under the `minikube` setting, when the tests undergo, you will see auto-scalers making effects on the number of pods under `api` and `ui` deployments.

The prerequisite of this section is k6 (https://k6.io/docs/get-started/installation/). To run the test scripts, `cd` into `tests/` directory, then run either of the following commands.

```
k6 run test_main_page.js
k6 run test_new_message.js
```

If you want to test under the `docker-compose` setting, change `dab-project.io` in the script into `127.0.0.1:7800`.