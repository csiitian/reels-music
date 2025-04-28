pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = credentials('AWS_ACCOUNT_ID')
        ECS_CLUSTER_NAME = 'reels-music-app'
        ECR_REPOSITORY_NAME = 'reels-music-backend'
        BACKEND_ECS_SERVICE_NAME = 'reels-music-backend-service'
        FRONTEND_ECS_SERVICE_NAME = 'reels-music-frontend-service'
        BRANCH_NAME = 'main'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Cloning repository...'
                git branch: env.BRANCH_NAME, url: 'https://github.com/csiitian/reels-music.git'
            }
        }

        stage('Initialize') {
            steps {
                script {
                    env.FRONTEND_IMAGE_TAG = "frontend-${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
                    env.BACKEND_IMAGE_TAG = "backend-${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
                }
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Building Spring Boot backend...'
                sh 'cd backend && mvn clean package -DskipTests'
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building React frontend...'
                sh '''
                    cd frontend
                    npm install
                    CI=false npm run build
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images for backend and frontend...'
                sh '''
                    $(aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com)

                    # Backend Docker image
                    cd backend
                    docker build -t $ECR_REPOSITORY_NAME:$BACKEND_IMAGE_TAG .
                    docker tag $ECR_REPOSITORY_NAME:$BACKEND_IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$BACKEND_IMAGE_TAG
                    cd ..

                    # Frontend Docker image
                    cd frontend
                    docker build -t $ECR_REPOSITORY_NAME:$FRONTEND_IMAGE_TAG .
                    docker tag $ECR_REPOSITORY_NAME:$FRONTEND_IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$FRONTEND_IMAGE_TAG
                    cd ..
                '''
            }
        }

        stage('Push Docker Images to ECR') {
            steps {
                echo 'Pushing Docker images to AWS ECR...'
                sh '''
                    # Push backend image
                    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$BACKEND_IMAGE_TAG

                    # Push frontend image
                    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$FRONTEND_IMAGE_TAG
                '''
            }
        }

        stage('Deploy Backend to ECS') {
            steps {
                echo 'Deploying backend service to ECS...'
                sh '''
                    aws ecs update-service \
                        --cluster $ECS_CLUSTER_NAME \
                        --service $BACKEND_ECS_SERVICE_NAME \
                        --force-new-deployment \
                        --region $AWS_REGION
                '''
            }
        }

        stage('Deploy Frontend to ECS') {
            steps {
                echo 'Deploying frontend service to ECS...'
                sh '''
                    aws ecs update-service \
                        --cluster $ECS_CLUSTER_NAME \
                        --service $FRONTEND_ECS_SERVICE_NAME \
                        --force-new-deployment \
                        --region $AWS_REGION
                '''
            }
        }
    }

    post {
        success {
            echo 'Backend and Frontend deployed successfully! 🚀'
        }
        failure {
            echo 'Deployment failed ❌'
        }
    }
}
