
pipeline {
    agent any

    environment {
        PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
        IMAGE = "experiment-8-app:v2"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Application') {
            steps {
                sh 'npm ci'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build --no-cache -t $IMAGE .'
            }
        }

        stage('Load Image into Minikube') {
            steps {
                sh 'minikube image load $IMAGE'
            }
        }

        stage('Deploy Blue and Green') {
            steps {
                sh 'kubectl apply -f blue-deployment.yaml'
                sh 'kubectl apply -f green-deployment.yaml'
                sh 'kubectl apply -f service.yaml'

                sh 'kubectl rollout status deployment/experiment-8-blue --timeout=120s'
                sh 'kubectl rollout status deployment/experiment-8-green --timeout=120s'
            }
        }

        stage('Verify Green Health') {
            steps {
                sh '''
                    GREEN_POD=$(kubectl get pods \
                      -l app=experiment-8,version=green \
                      -o jsonpath='{.items[0].metadata.name}')

                    kubectl exec "$GREEN_POD" -- \
                      node -e "
                        fetch('http://127.0.0.1:3000/health')
                          .then(async r => {
                            console.log(await r.text());
                            if (!r.ok) process.exit(1);
                          })
                          .catch(() => process.exit(1));
                      "
                '''
            }
        }

        stage('Switch Traffic to Green') {
            steps {
                sh '''
                    kubectl patch service experiment-8-service \
                      --type=merge \
                      -p '{"spec":{"selector":{"app":"experiment-8","version":"green"}}}'
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl get deployments'
                sh 'kubectl get pods --show-labels'
                sh 'kubectl get endpoints experiment-8-service'
                sh 'kubectl get service experiment-8-service'
            }
        }
    }
}

