# PS1

# Define app name
# Use hostname unless APP_NAME is set and not empty
if [ -z "$APP_NAME" ]; then
    # APP_NAME is empty or not set, prioritize hostname
    APP_NAME=$(hostname)
else
    # APP_NAME is set and not empty, use it instead
    APP_NAME=$APP_NAME
fi

# Colors
COLOR_PRIMARY="\e[38;5;67m"
COLOR_RED="\e[38;5;160m"
COLOR_ORANGE="\e[38;5;130m"
COLOR_GREEN="\e[38;5;106m"
COLOR_BLUE="\e[38;5;33m"
COLOR_GRAY="\e[38;5;244m"
COLOR_RESET="\e[0m"

# Choose prompt color
COLOR_PRIMARY=${COLOR_BLUE}

# Set prompt
export PS1="\033$COLOR_GRAY[\[\]\[\033[$COLOR_PRIMARY\]$APP_NAME$COLOR_GRAY\[\]][\W]\[\] › \033$COLOR_RESET"

/etc/profile.d/30motd.sh
