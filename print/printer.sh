#!/bin/bash

inotifywait -m ./print -e create -e moved_to |
    while read path action file; do
        # lpr -o fit-to-page -o media=a6 ./print/$file
        lpr ./print/$file
        sleep 3
        mv ./print/$file ./printed/$file
        echo "The file '$file' is scheduled for printing."
    done
