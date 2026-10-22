pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    environment {
        IMAGE = 'experiment-8-app:v2'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Application') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
                sh 'npm test'
            }
        }

        // Keep your existing Docker, Minikube,
        // Blue-Green deployment and verification stages here.
    }
}
