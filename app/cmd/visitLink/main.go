package main

import (
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func HandleRequest(request events.APIGatewayProxyResponse) (events.APIGatewayProxyResponse, error) {
	apiResponse := events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       "Visit Link",
	}

	return apiResponse, nil
}

func main() {
	lambda.Start(HandleRequest)
}
