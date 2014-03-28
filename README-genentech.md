#deploy
##stage
    grunt build

##resdev
    rsync --recursive --delete examples/* rescomp2:/gne/research/web/dev/apache/htdocs/pviz/examples/
##dmz
    rsync --recursive --delete examples/* rescomp2:/gne/research/web/dev/apache-share/htdocs/pviz/examples/
Then visit [jenkins](http://rescode03:8080/build/job/synch_to_research-pub-dmz/) and uncheck the dry box

##update the bower component
    grunt test
    grunt build
    git commit -m "..."
    npm version patch
