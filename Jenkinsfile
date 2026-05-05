pipeline {
    agent any

    environment {
        IMAGE_NAME = "sanjay5raj/master-node:latest"
        CONTAINER_NAME = "my-node-container"
        PORT = "3000"

        // Docker Hub credentials ID from Jenkins
        DOCKER_CREDENTIALS = "docker-hub-cred"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t $IMAGE_NAME ."
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "$DOCKER_CREDENTIALS",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat """
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    """
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                bat "docker push $IMAGE_NAME"
            }
        }

        stage('Stop Old Container') {
            steps {
                bat """
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                """
            }
        }

        stage('Run Container') {
            steps {
                bat """
                docker run -d -p $PORT:3000 --name $CONTAINER_NAME $IMAGE_NAME
                """
            }
        }
    }

    post {
        success {
            echo "Build, Push & Deployment successful 🚀"
        }
        failure {
            echo "Pipeline failed ❌"
        }
    }
}