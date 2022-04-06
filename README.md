Steps for the second part of assignment
-- installing minikube on Ubuntu 
1. download the package
 # curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
2. change the permission of the downloaded package
 # chmod +x minikubee
3. move the binary file to /usr/local/bin/minikube in order to use it as command 
 # sudo mv ./minikube /usr/local/bin/minikube
4. start minikube in case you have already installed docker 
 # minikube start --driver=docker
 to work properly with docker and images with minikube that has installed docker and in order to use local docker images to create pods we should apply: # eval $(minikube docker-env)
 start minikube if you have docker installed with minikube tool
 # minikube start
5. confirm minikube is running and the cluster is created 
 # docker ps
 
-- Simple docker file 

FROM node

WORKDIR /app

COPY . .

RUN npm install

CMD ["node","index.js"]
 
after creating the Dockerfile inside the directory which we have the application file we will run the follow command to create a docker image 

 #docker build -t demo/simpleapp .
 after complete the building we can validate the image using the follow command 
 #docker images 
NOTE: in real node application we will have multiple modules we can use Nginx but we should configure nginx to meet the requirments such as /etc/nginx/nginx.conf and /etc/nginx/sites-enabled/default 
-- Kubernetes manifests to deploy your application into your minikube cluster using kubectl
 we should create a Yaml file to create pod for the created docker image and the below is the manifest yaml file 
 also we have to create a service(type NodePort) to receive the traffic 

apiVersion: apps/v1
kind: Deployment
metadata:
  name: simpleapp-deployment
  labels:
    app: simpleapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: simpleapp
  template:
    metadata:
      labels:
        app: simpleapp
    spec:
      containers:
        - name: simpleapp
          image: demo/simpleapp
          imagePullPolicy: Never
          ports:
            - containerPort: 8282

---
apiVersion: v1
kind: Service
metadata:
  name:  simpleapp-service
  labels:
    app: simpleapp
spec:
  type: NodePort
  selector:
    app: simpleapp
  ports:
    - name: http
      protocol: TCP
      port: 8282
      targetPort: 8282

use the below command to ensure the output of applied yaml file and the pod is running with the service 
#kubectl get pods 
#kubectl get service 
if any issue we can troubleshooting by use:
#kubectl logs POD_ID
#kubectl describe pod POD_ID
#kubectl describe service SERVICE_NAME	  
--- An Ingress manifest which will route to your web server only on the following URL: http://local.astriauniversity.com/author

kind: Ingress
metadata:
  name: sampleapp-ingress
spec:
  ingressClassName: simpleapp-class
  rules:
    - host: "local.astriauniversity.com"
      http:
        paths:
          - path: /author
            pathType: Exact
            backend:
              service:
                name: simpleapp-service
                port:
                  number: 8282
use the below command to ensure the output of applied yaml file
#kubectl get ingress
#kubectl describe ingress INGRESS_NAME
--- A build script which, in a single command, takes care of building, packaging and deploying your application and configuring your minikube cluster. (You can assume minikube is already installed

#! /bin/bash
cd /app/janade/assignment
IMAGE_ID=`docker images|grep "demo/simpleapp"|awk '{print $3}'`
docker rmi -f $IMAGE_ID
docker build -t demo/simpleapp .
kubectl delete -f /app/janade/assignment/Deployment.yaml
kubectl apply -f /app/janade/assignment/Deployment.yaml
while [[ -z $(kubectl get pods |grep simpleapp-deployment- |grep Running) ]] ;do sleep 10s;echo "Applying the Artifact on kubernetes"; done

