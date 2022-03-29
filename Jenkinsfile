properties([gitLabConnection(gitLabConnection: 'gitlab', jobCredentialId: ''), [$class: 'GitlabLogoProperty', repositoryName: ''], 
parameters([choice(choices: ['master\n', 'Dev'], description: 'pilih brach', name: 'branch')])]) 
node {
   def commit_id
   stage('Clone the Git') {
    git 'https://github.com/nicopanjaitan0607-ardi/phincon-attandance-web-api.git'
  }
   stage('Preparation') {
     sh "git rev-parse --short HEAD > .git/commit-id"
     commit_id = readFile('.git/commit-id').trim()
   }
   stage('Build') {
     nodejs(nodeJSInstallationName: 'nodejs') {
       sh 'npm install'
       //sh 'npm test'
     }
   }
 /* stage('SonarQube analysis') {
        script {
            scannerHome = tool 'sonarqube';
        }
        withSonarQubeEnv('sonarqube') {
            sh """
            sonar-scanner \
  -Dsonar.projectKey=jenkins \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://192.168.100.18:9000 \
  -Dsonar.login=fc10e93d7010fb7107635563ec693c0a96eb38eb
        """
        }
    } */
   /*stage('sonar-scanner') {
      def sonarqubeScannerHome = tool name: 'sonarqube', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
    /* withCredentials([string(credentialsId: 'sonarqube', variable: 'sonarLogin')]) { */
     /* withSonarQubeEnv('sonarqube') {
      /* sh "${sonarqubeScannerHome}/bin/sonar-scanner -e -Dsonar.host.url=http://192.168.100.20:9000 
-Dsonar.login=52ee6a34b6c78beee00ce12cbd4ae6a449f4bb93 -Dsonar.projectName=jenkins -Dsonar.projectVersion=${env.BUILD_NUMBER} -Dsonar.projectKey=jenkins 
-Dsonar.language=java -Dsonar.java.binaries=."
      }
    }
    /*
    stage("Quality Gate"){
        sleep(10)
  timeout(time: 1, unit: 'HOURS') { // Just in case something goes wrong, pipeline will be killed after a timeout
    def qg = waitForQualityGate() // Reuse taskId previously collected by withSonarQubeEnv
    if (qg.status != 'OK') {
      error "Pipeline aborted due to quality gate failure: ${qg.status}"
    }
  }
}
*/
 stage('Initialize'){
        def dockerHome = tool 'docker'
        env.PATH = "${dockerHome}/bin:${env.PATH}"
    }
 
   stage('docker build') {
     
       def app = docker.build("phincon-attandance-web-api:${commit_id}", '.')
     
   }
}
