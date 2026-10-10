# Image for the Node build service. It only provides Node and npm. The project files are
# mounted from the host when the container starts, so nothing from the project is copied
# into the image.
#
# Node 26 is one of the versions that the "engines" field in package.json allows, and
# @wordpress/scripts 36 supports it. Change this tag and "engines" together.
FROM node:26-alpine

# docker-compose.yml mounts a Docker volume at /app/node_modules. A new volume takes the
# permissions of the folder that already exists in the image at the same path. The
# container runs with the user id of the person on the host (LOCAL_UID), and that id can
# differ from the ids that exist in this image. Making the folder writable for every user
# id lets npm install the packages into the volume no matter which id is used.
RUN mkdir -p /app/node_modules && chmod 777 /app/node_modules

WORKDIR /app

# Use the unprivileged user that the Node image provides when the image is run without
# Docker Compose. Docker Compose replaces this with the user id from LOCAL_UID.
USER node
