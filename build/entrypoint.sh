#!/bin/bash

# TODO: M Remove after testing
# set -x

ERROR="[ ERROR ]"
WARN="[ WARN ]"
INFO="[ INFO ]"

echo "${INFO} supervisord start"
exec supervisord -c /etc/supervisord/supervisord.conf
