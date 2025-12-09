FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o user-service ./cmd/main.go

FROM alpine:latest

WORKDIR /app
COPY firebase-credentials.json ./

COPY --from=builder /app/user-service .

COPY --from=builder /app/.config.env* ./

EXPOSE 8081

CMD ["./user-service"]