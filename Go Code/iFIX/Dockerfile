FROM golang:latest
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN go get github.com/go-sql-driver/mysql
RUN go get golang.org/x/crypto/bcrypt
RUN go get github.com/Azure/azure-storage-blob-go/azblob
RUN go get github.com/gofrs/uuid
RUN go build -o main .
CMD ["/app/main"]
