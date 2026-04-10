#!/bin/bash
set -e

echo "Generating Go protobuf (media)..."

protoc -I ./proto \
    --go_out=./gen/go \
    --go-grpc_out=./gen/go \
    --go_opt=module=github.com/ShmatkoBrest/contracts \
    --go-grpc_opt=module=github.com/ShmatkoBrest/contracts \
    ./proto/media.proto

echo "Go generation complete."