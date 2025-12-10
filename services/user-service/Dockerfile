FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o user-service ./cmd/main.go

FROM alpine:latest

WORKDIR /app

RUN apk --no-cache add ca-certificates

COPY --from=builder /app/user-service .

COPY firebase-credentials.json ./
COPY .config.env* ./

EXPOSE 8081

CMD ["./user-service"]
