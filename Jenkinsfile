#!/usr/bin/env groovy 
def DOCKER_REGISTRY = '204840125866.dkr.ecr.ap-south-1.amazonaws.com'
def	projectName = "adzone-devl-frontend".toLowerCase()
def MajorVersion = '1'
def scmRes
def TAG = "latest"
def revision
def appImage
def allowedNotificationEnvs = ['devl-1','qual-1','cert-1','prod-1']
pipeline {

  agent any
    	
		stages {
			stage('SetupParameters'){
        	agent  any
				steps{
					script{
						properties([
							parameters([
				                choice(name: 'ENV',description: 'Enviroment',choices: ['devl-1','qual-1','cert-1','prod-1'])
								
							])
						])
					}
				}
			}
        
	stage('SetupVariables'){
				  agent {
		    		label "${params.ENV}"
		    	}
				steps{
					echo 'set variable'
					script {
				    	if("${params.ENV}" == 'devl-1'){
				    		DOCKER_REGISTRY = '204840125866.dkr.ecr.ap-south-1.amazonaws.com'
				    		projectName = "adzone-devl-frontend".toLowerCase()
				    		mvnProfile = 'Devl'
							dockerFileName = 'Dockerfile-Devl'
				    	}else if("${params.ENV}" == 'qual-1'){
				    		DOCKER_REGISTRY = '091541603851.dkr.ecr.ap-south-1.amazonaws.com'
				    		projectName = "adzone-qual-frontend".toLowerCase()
				    		mvnProfile = 'Qual'
							dockerFileName = 'Dockerfile-Qual'
				    	}else if("${params.ENV}" == 'cert-1'){
				    		DOCKER_REGISTRY = '091541603851.dkr.ecr.ap-south-1.amazonaws.com'
				    		projectName = "adzone-devl-frontend".toLowerCase()
				    		mvnProfile = 'Cert'
							dockerFileName = 'Dockerfile-Cert'
				    	}else if("${params.ENV}" == 'prod-1'){
				    		DOCKER_REGISTRY = '953770794735.dkr.ecr.ap-south-1.amazonaws.com'
				    		projectName = "adzone-prod-frontend".toLowerCase()
				    		mvnProfile = 'Prod'
							dockerFileName = 'Dockerfile-Prod'
				    	}
				    }
				}
			}

    stage('Checkout') {
	    agent {
		    		label "${params.ENV}"
		    	}
		steps {
		echo 'package checkout'
	   script {
        deleteDir()
        scmRes = checkout scm
        ID = UUID.randomUUID().toString()[-12..-1]
        APP_TAG = "app_${MajorVersion}.${currentBuild.id}-${ID}"
        revision = "${currentBuild.id}"
		}
    }
	}
    
       stage('RemoveGitDirectory') {
	      			  agent {
		    		label "${params.ENV}"
		    	}
	   steps {			
        sh "echo '${scmRes.GIT_COMMIT}' > .revision"
        sh 'rm -fr .git'
    }
	}
   

    stage('Build') {
    	  agent {
		    		label "${params.ENV}"
		    	}
		steps {
   		echo 'package build'
   		script {
        //  appImage = docker.build("${DOCKER_REGISTRY}/${projectName}:${APP_TAG}", '--no-cache -f Dockerfile .')
		 appImage = docker.build("${DOCKER_REGISTRY}/${projectName}:${APP_TAG}", '--no-cache -f '+"${dockerFileName}"+' .')
		 }
		 }
    }

    stage ('Docker :: Push') {
		    	agent {
		    		label "${params.ENV}"
		    	}

		    	steps {
			        sh " echo 'Image push the repo ${projectName}'"
        			script {
        			sh  'docker login -u AWS -p $(aws ecr get-login-password --region ap-south-1) '+"${DOCKER_REGISTRY}"
        			appImage.push('latest')        
				     }
			    }
		  }

    stage('Docker :: Remove Image') {
			    	  agent {
		    		label "${params.ENV}"
		    	}
				steps {
        sh "docker rmi -f ${DOCKER_REGISTRY}/${projectName}:${APP_TAG}"
		}
     }

}
}