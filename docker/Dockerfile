FROM alpine:3.20

# Workdirectory
WORKDIR /var/www/app

RUN \
    # Install base packages
    apk add --no-cache \
    tzdata supervisor dcron bash git vim \
    figlet ncurses util-linux-misc \
    # Project related packages
    nodejs-current ts-node npm \
    yarn && \
    # Configure timezone
    cp /usr/share/zoneinfo/Asia/Almaty /etc/localtime && \
    echo "Asia/Almaty" > /etc/timezone

# Copy supervisor config
COPY ./docker/configs/supervisord/supervisord.conf /etc/supervisord.conf

# Copy docker entrypoint
COPY ./docker/docker-entrypoint.sh /docker-entrypoint.sh

# Copy welcome message customization files
COPY ./docker/configs/motd/banner3.flf ./docker/configs/motd/calvins.flf /etc/
COPY ./docker/configs/motd/30motd.sh /etc/profile.d/30motd.sh
COPY ./docker/configs/motd/.bashrc /root/.bashrc
RUN chmod +x /etc/profile.d/30motd.sh
ENV ENV=/root/.bashrc

# Permissions
RUN chmod +x /docker-entrypoint.sh

# Copy code base
COPY . /var/www/app

# Build backend and frontend
RUN cd backend ; rm -rf node_modules ; yarn ; yarn build ; cd ../frontend ; rm -rf node_modules ; yarn

# Run entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
