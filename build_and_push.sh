#!/bin/sh

# Set the repository name
REPO_NAME="srkraut/uddu"

# Check if a tag argument is provided
if [ -z "$1" ]; then
    echo "No tag provided. Using 'latest'."
    TAG="latest"
else
    TAG="$1"
fi

FULL_IMAGE_NAME="${REPO_NAME}:${TAG}"

echo "========================================"
echo "Building and Pushing Docker image: $FULL_IMAGE_NAME"
echo "Platforms: linux/amd64, linux/arm64"
echo "========================================"

# Check if a dedicated builder exists, if not create one
# This helps with multi-arch build stability and network handling
BUILDER_NAME="multi-arch-builder"
if ! docker buildx inspect "$BUILDER_NAME" > /dev/null 2>&1; then
    echo "Creating new buildx builder: $BUILDER_NAME"
    docker buildx create --use --name "$BUILDER_NAME" --driver docker-container
    docker buildx inspect --bootstrap
else
    echo "Using existing buildx builder: $BUILDER_NAME"
    docker buildx use "$BUILDER_NAME"
fi

# Build and LOAD into local Docker daemon
# We use --load instead of --push here. This builds the image and saves it locally first.
# This avoids networking issues often seen when pushing directly from the buildx container.
echo "Building for linux/amd64 and loading locally..."
docker buildx build --platform linux/amd64 -t "$FULL_IMAGE_NAME" --load .

if [ $? -eq 0 ]; then
    echo "========================================"
    echo "Build successful! Pushing to Docker Hub..."
    echo "========================================"
    
    # Push using the standard docker client (more robust network handling)
    docker push "$FULL_IMAGE_NAME"
    
    if [ $? -eq 0 ]; then
        echo "========================================"
        echo "Successfully pushed $FULL_IMAGE_NAME"
        echo "========================================"
    else
        echo "Error: Failed to push image."
        exit 1
    fi
else
    echo "Error: Build failed."
    exit 1
fi
