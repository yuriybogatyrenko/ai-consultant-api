#!/usr/bin/env bash

# Disk percentage warning threshold
DISK_WARN_THRESHOLD=90

# Text settings
COLOR_PRIMARY="\e[38;5;67m"
COLOR_SECONDARY="\e[38;5;172m"
COLOR_RED="\e[38;5;160m"
COLOR_ORANGE="\e[38;5;130m"
COLOR_GREEN="\e[38;5;106m"
COLOR_BLUE="\e[38;5;33m"
COLOR_GRAY="\e[38;5;244m"
COLOR_WARNING="\e[38;5;130m"
COLOR_RESET="\e[0m"
# Use gray color as a default color
COLOR_RESET=$COLOR_GRAY

# System date

DATE=`date`

# System uptime
uptime=`cat /proc/uptime | cut -f1 -d.`
upDays=$((uptime/60/60/24))
upHours=$((uptime/60/60%24))
upMins=$((uptime/60%60))
upSecs=$((uptime%60))
UPTIME="${upDays}d ${upHours}h ${upMins}m ${upSecs}s"

# Basic info
IS_APP_NAME_SET=0
# Define app name
# Use hostname unless APP_NAME is set and not empty
if [ -z "$APP_NAME" ]; then
    # APP_NAME is empty or not set, prioritize hostname
    APP_NAME=$(hostname)
else
    # APP_NAME is set and not empty, use it instead
    APP_NAME=$APP_NAME
    IS_APP_NAME_SET=1
fi
LINUX_VERSION=`awk -F= '/PRETTY_NAME/ {gsub("\"", "", $2); print $2}' /etc/os-release`

# System info
MEMORY_USED=`free -m | grep "Mem" | awk '{print $3" MB";}'`
MEMORY_TOTAL=`free -m | grep "Mem" | awk '{print $2" MB";}'`
SWAP_USED=`free -m | grep "Swap" | awk '{print $3" MB";}'`
SWAP_TOTAL=`free -m | grep "Swap" | awk '{print $2" MB";}'`
CPU_CORES=`lscpu | egrep '^CPU\(s\):' | awk '{print $2}'`
LOAD_1=`cat /proc/loadavg | awk '{print $1}'`
LOAD_5=`cat /proc/loadavg | awk '{print $2}'`
LOAD_15=`cat /proc/loadavg | awk '{print $3}'`

# Reset primary color
COLOR_PRIMARY=${COLOR_BLUE}

# Welcome screen

clear

# Figlet
echo
echo -e ${COLOR_PRIMARY}
figlet -f /etc/banner3.flf -w $(tput cols) -c "RAKANISHU"
echo -e ${COLOR_RESET}
echo -e ${COLOR_SECONDARY}
figlet -f /etc/calvins.tlf -w $(tput cols) -c "s o s i s e"
echo -e ${COLOR_RESET}
echo

# Welcom message
echo -e " Welcome to ${COLOR_PRIMARY}$APP_NAME${COLOR_RESET} app container based on ${COLOR_SECONDARY}${LINUX_VERSION} ${COLOR_RESET}"
if [ "$IS_APP_NAME_SET" -eq 0 ]; then
    echo -e " Please add the APP_NAME environment variable to your docker-compose.yml file"
fi


# System info
echo
echo -e " ${COLOR_PRIMARY}█${COLOR_RESET} System date............: $DATE"
echo -e " ${COLOR_PRIMARY}█${COLOR_RESET} Uptime.................: $UPTIME"
echo -e " ${COLOR_PRIMARY}█${COLOR_RESET} CPU cores..............: $CPU_CORES"
echo -e " ${COLOR_PRIMARY}█${COLOR_RESET} CPU usage..............: $LOAD_1, $LOAD_5, $LOAD_15"
echo -e " ${COLOR_PRIMARY}█${COLOR_RESET} Memory used............: $MEMORY_USED / $MEMORY_TOTAL"
echo -e " ${COLOR_PRIMARY}█${COLOR_RESET} Swap used..............: $SWAP_USED / $SWAP_TOTAL"
echo

# Running artisan commands
RUNNING_ARTISAN_COMMANDS=$(ps | grep '[n]ode build/artisan.js' | awk '{printf "%s ", $1; for(i=6;i<=NF;i++) printf "%s ", $i; printf "\n"}')
if [[ -n $RUNNING_ARTISAN_COMMANDS ]]; then
    echo "Running artisan commands:"
    # Read through each line in RUNNING_ARTISAN_COMMANDS
    while read -r COMMAND; do
      echo -e " ${COLOR_PRIMARY}›${COLOR_RESET} ${COMMAND}"
    done <<< "$RUNNING_ARTISAN_COMMANDS"
    echo
fi

echo
echo