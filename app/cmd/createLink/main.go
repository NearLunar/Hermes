package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
)

type Event struct {
	Link string `json:"link"`
}

func HandleRequest(ctx context.Context, event Event) (string, error) {
	fmt.Println("Hello, World!")
	return fmt.Sprintf("Link: %s", event.Link), nil
}

func main() {
	lambda.Start(HandleRequest)
}
