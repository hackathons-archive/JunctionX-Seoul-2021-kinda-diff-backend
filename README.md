# JunctionX Seoul 2021 | Indian Faker | Team kinda-diff

Indian Faker, a online indian poker game application, allow people to play poker face to face.

### AWS - Amazon Web Services

#### CI/CD Pipeline Diagram

![CI/CD Pipeline Diagram](/public/CI-CD-pipeline.png)

#### AWS Architecture Diagram

![AWS Architecture Diagram](/public/AWS-diagram.png)

### Why We Designed Architecture this Way?

- The Five Pillars of AWS Architecture guide the implementation of an Application into the AWS cloud environment.
- As part of these considerations our operations continously build and deploy our application into AWS.
  Right now we are using Github actions as the main driver for Continous Integration (CI) and Continious Deployment(CD).
- Except for one bucket used in the Frontend, which should be easy to add, everything is declaritively defined in this repository.
  As such, whenever something changes in repository it will automatically be reflected in AWS.

#### Future Improvement

- In the future it would probably make sense, to move the github repository and the CI and CD into their respective AWS counterparts (AWS CodeCommit, AWS CodeBuild, AWS CodePipeline).
- We did not use those parts for now, as it was easier and faster to set up, because of previous experiences and we wanted to move fast, through small, frequent and reversible changes.
- One big problem right now, is that every commit to this repository triggers Github Actions and as such deploys automatically. In the future it would be better to include a filter.
  However as we do not work with branches right now, it does not affect us at all.

#### AWS Lambda

- One of the biggest reasons for using lambda include the ability to not worry about most of the tech stack, because it is managed by AWS.
  Furthermore a function call is quite cheap for a REST API that is rarely called.
- In addition it facilitates high availability, as functions can be deployed in multiple regions and datacenters automatically. It also collects logs automatically and is resistend to failure due to automatic recovery and horizontal scalability.

#### Dynamo DB

- Security wise we did not include any meaningful information about players, that is stored permanently. In fact every information stored in the managed database DynamoDB is automatically deleted through the TTL feature. As such no identification for outside users is necessary. However no production hardening has been done to AWS IAM users. As such each user has full permissions for experimentation and testing purposes.
- However in the future it would be no problem splitting between test account for prototyping and production accounts with restricted access. In the future it might be a sensible thing to support passwords for private rooms, so meetings cannot be attended randomly.

#### More thoughts...

- Furthermore as we are reyling on AWS as a crucial Partner for the current Infrastructure by providing the building blocks that our product connects.
  Our application supports multiple regions and datacenters natively and as such it's easy to scale globally.

- By using Cloud9 for an easy and disposable environment with collaborative features, we could move quickly in most cases of problems in the development process.

- Unfortunately right now, it not viable as a free service, because the video chatting implementation would be quite expensive right now.
  Furtunatelym Calculating costs can be done easily based on the time the players are active

### Major Features

- Completely Serverless Game Application using AWS API Gateway, AWS Lambda, DynamoDB
- Stream Face Video to Game Players through AWS Chime SDK
- Face Emotion Detection through AWS Rekognition
- Automatic Deployment using GitHub Actions and serverless.yml file

### More Detailed Description can be found below

Project Proposal Link: [Indian Faker Proposal File](https://drive.google.com/file/d/1mcAYqd_rrh9I98tl8zo0jQh6qdeJoEj2/view?usp=sharing)

Git Repository Link: [Indian Faker Git Repository](https://github.com/kinda-diff)

### Acknowledgements

We would like to express our very great appreciation to people from JunctionxSeoul for their valuable support and organize many activities. We would like to express our deep gratitude to mentors from AWS for their enthusiatic encouragement and AWS credits for us to use API services in AWS platform to develop this project.

### License

Indian Faker is [MIT licensed](https://github.com/kinda-diff/kinda-diff-backend/blob/main/LICENSE)
