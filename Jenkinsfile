pipeline {
    agent any

    environment {
        IMAGE_NAME      = "sanjay5raj/master-node:latest"
        CONTAINER_NAME  = "my-node-container"
        APP_PORT        = "3000"
        EC2_HOST        = "ubuntu@<your-ec2-public-ip>"   // ← change this
        DOCKER_CREDS    = "docker-hub-cred"
        EC2_SSH_KEY     = "ec2-ssh-key"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_CREDS}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
                        docker push ${IMAGE_NAME}
                    """
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(credentials: ["${EC2_SSH_KEY}"]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_HOST} '
                            docker pull ${IMAGE_NAME}
                            docker stop ${CONTAINER_NAME} || true
                            docker rm   ${CONTAINER_NAME} || true
                            docker run -d \
                                -p ${APP_PORT}:3000 \
                                --name ${CONTAINER_NAME} \
                                --restart always \
                                ${IMAGE_NAME}
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployed successfully to EC2!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs."
        }
    }
}