#!/usr/bin/env sh
set -e

if [ $# -gt 0 ]
then
    exec "$@"
else
    # Build frontend
    cd frontend ; yarn ; yarn build

    # Build backend and run migrations
    cd .. ; cd backend ; npm run migration:run
    
    # Execute supervisord
    exec /usr/bin/supervisord -c /etc/supervisord.conf

    # Uncomment for debug
    # tail -f /dev/null
fi
